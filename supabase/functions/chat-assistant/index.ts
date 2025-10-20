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
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { messages }: RequestBody = await req.json();

    const { data: events } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    const { data: news } = await supabase
      .from("news")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(5);

    const { data: bylaws } = await supabase
      .from("bylaws")
      .select("*")
      .order("section_number", { ascending: true });

    const { data: ideas } = await supabase
      .from("ideas")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    const { data: boardMeetings } = await supabase
      .from("board_meetings")
      .select("*")
      .order("date", { ascending: false })
      .limit(5);

    const systemPrompt = `Du er en hjælpsom assistent for Præstemarken Grundejerforening. Du skal kun svare baseret på information fra foreningens hjemmeside og database.

BESTYRELSEN:
- René nr. 37 (Formand)
- Sune nr. 22 (Næstformand)
- Inger nr. 24 (Kasserer)
- Tommy nr. 9 (Medlem)
- Birger nr. 21 (Medlem)

KONTINGENT:
Kontingentet er 500 kr. årligt for alle medlemmer.

KOMMENDE EVENTS:
${events?.map(e => `- ${e.name} den ${new Date(e.date).toLocaleDateString('da-DK', { year: 'numeric', month: 'long', day: 'numeric' })}: ${e.description || ''}`).join('\n') || 'Ingen kommende events'}

SENESTE NYHEDER:
${news?.map(n => `- ${n.title}: ${n.content.substring(0, 200)}...`).join('\n') || 'Ingen nyheder'}

VEDTÆGTER:
${bylaws?.map(b => `§${b.section_number} ${b.title}: ${b.content.substring(0, 150)}...`).join('\n') || 'Ingen vedtægter'}

IDÉER FRA MEDLEMMER:
${ideas?.map(i => `- ${i.title}: ${i.description.substring(0, 100)}...`).join('\n') || 'Ingen idéer'}

BESTYRELSESMØDER:
${boardMeetings?.map(m => `- ${new Date(m.date).toLocaleDateString('da-DK')}: ${m.location}`).join('\n') || 'Ingen møder'}

Svar altid på dansk. Vær venlig og hjælpsom. Hvis du ikke har information om noget, sig det ærligt og foreslå at bruge kontaktformularen på hjemmesiden.`;

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

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text();
      console.error("OpenAI API error:", error);
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    const assistantMessage = openaiData.choices[0].message.content;

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
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
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