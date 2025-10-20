import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Message {
  role: string;
  content: string;
}

interface RequestBody {
  messages: Message[];
}

Deno.serve(async (req: Request) => {
  console.log("Request received", req.method);
  
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    console.log("Starting chat assistant...");
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    console.log("Environment check:", {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey,
      hasOpenAI: !!openaiApiKey
    });

    if (!openaiApiKey) {
      console.error("OPENAI_API_KEY missing");
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY is not configured" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase credentials missing");
      return new Response(
        JSON.stringify({ error: "Supabase credentials missing" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log("Supabase client created");

    let body;
    try {
      body = await req.json();
      console.log("Request body parsed:", body);
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { messages }: RequestBody = body;

    if (!messages || !Array.isArray(messages)) {
      console.error("Invalid messages format:", messages);
      return new Response(
        JSON.stringify({ error: "Invalid messages format" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("Fetching data from Supabase...");

    const [eventsResult, newsResult, bylawsResult, ideasResult, boardMeetingsResult] = await Promise.all([
      supabase.from("events").select("*").order("date", { ascending: true }),
      supabase.from("news").select("*").eq("published", true).order("created_at", { ascending: false }).limit(5),
      supabase.from("bylaws").select("*").order("section_number", { ascending: true }),
      supabase.from("ideas").select("*").order("created_at", { ascending: false }).limit(10),
      supabase.from("board_meetings").select("*").order("date", { ascending: false }).limit(5)
    ]);

    console.log("Data fetched");

    const events = eventsResult.data || [];
    const news = newsResult.data || [];
    const bylaws = bylawsResult.data || [];
    const ideas = ideasResult.data || [];
    const boardMeetings = boardMeetingsResult.data || [];

    const systemPrompt = `Du er en hjælpsom assistent for Grundejerforeningen Engbakken. Du skal kun svare baseret på information fra foreningens hjemmeside og database.

BESTYRELSEN:
- René nr. 37 (Formand)
- Sune nr. 22 (Næstformand)
- Inger nr. 24 (Kasserer)
- Tommy nr. 9 (Medlem)
- Birger nr. 21 (Medlem)

KONTINGENT:
Kontingentet er 500 kr. årligt for alle medlemmer.

KOMMENDE EVENTS:
${events.map(e => `- ${e.name} den ${new Date(e.date).toLocaleDateString('da-DK', { year: 'numeric', month: 'long', day: 'numeric' })}: ${e.description || ''}`).join('\n') || 'Ingen kommende events'}

SENESTE NYHEDER:
${news.map(n => `- ${n.title}: ${n.content.substring(0, 200)}...`).join('\n') || 'Ingen nyheder'}

VEDTÆGTER:
${bylaws.map(b => `§${b.section_number} ${b.title}: ${b.content.substring(0, 150)}...`).join('\n') || 'Ingen vedtægter'}

IDÉER FRA MEDLEMMER:
${ideas.map(i => `- ${i.title}: ${i.description.substring(0, 100)}...`).join('\n') || 'Ingen idéer'}

BESTYRELSESMØDER:
${boardMeetings.map(m => `- ${new Date(m.date).toLocaleDateString('da-DK')}: ${m.location}`).join('\n') || 'Ingen møder'}

Svar altid på dansk. Vær venlig og hjælpsom. Hvis du ikke har information om noget, sig det ærligt og foreslå at bruge kontaktformularen på hjemmesiden.`;

    console.log("Calling OpenAI API...");

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    console.log("OpenAI response status:", openaiResponse.status);

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text();
      console.error("OpenAI API error:", openaiResponse.status, error);
      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${openaiResponse.status} - ${error.substring(0, 100)}` }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const openaiData = await openaiResponse.json();
    console.log("OpenAI data received");
    
    if (!openaiData.choices || !openaiData.choices[0] || !openaiData.choices[0].message) {
      console.error("Invalid OpenAI response structure:", openaiData);
      return new Response(
        JSON.stringify({ error: "Invalid response from OpenAI" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const assistantMessage = openaiData.choices[0].message.content;
    console.log("Returning response");

    return new Response(
      JSON.stringify({ message: assistantMessage }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Unhandled error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Error stack:", errorStack);
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: errorStack ? errorStack.substring(0, 200) : undefined
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});