import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY is not configured. Please configure it in Supabase Edge Functions settings." }),
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

    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
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

    const [eventsResult, newsResult, bylawsResult, ideasResult, boardMeetingsResult] = await Promise.all([
      supabase.from("events").select("*").order("date", { ascending: true }),
      supabase.from("news").select("*").eq("published", true).order("created_at", { ascending: false }).limit(5),
      supabase.from("bylaws").select("*").order("section_number", { ascending: true }),
      supabase.from("ideas").select("*").order("created_at", { ascending: false }).limit(10),
      supabase.from("board_meetings").select("*").order("date", { ascending: false }).limit(5)
    ]);

    const events = eventsResult.data || [];
    const news = newsResult.data || [];
    const bylaws = bylawsResult.data || [];
    const ideas = ideasResult.data || [];
    const boardMeetings = boardMeetingsResult.data || [];

    const formatDate = (dateStr: string) => {
      try {
        return new Date(dateStr).toLocaleDateString('da-DK', { year: 'numeric', month: 'long', day: 'numeric' });
      } catch {
        return dateStr;
      }
    };

    const stripHtml = (html: string) => {
      return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    };

    const eventsText = events.length > 0
      ? events.map(e => `- ${e.name} den ${formatDate(e.date)}: ${e.description || ''}`).join('\n')
      : 'Ingen kommende events';

    const newsText = news.length > 0
      ? news.map(n => `- ${n.title}: ${n.content.substring(0, 200)}...`).join('\n')
      : 'Ingen nyheder';

    const bylawsText = bylaws.length > 0
      ? bylaws.map(b => `§${b.section_number} ${b.title}: ${b.content.substring(0, 150)}...`).join('\n')
      : 'Ingen vedtægter';

    const ideasText = ideas.length > 0
      ? ideas.map(i => `- ${i.title}: ${i.description.substring(0, 100)}...`).join('\n')
      : 'Ingen idéer';

    const boardMeetingsText = boardMeetings.length > 0
      ? boardMeetings.map(m => {
          const dateStr = formatDate(m.date);
          const location = m.location || 'Ukendt lokation';
          const minutes = m.minutes_text ? stripHtml(m.minutes_text).substring(0, 500) : 'Intet referat tilgængeligt';
          return `MØDE ${dateStr} - ${location}:\n${minutes}...`;
        }).join('\n\n')
      : 'Ingen mødereferater';

    const systemPrompt = `Du er en hjælpsom assistent for Grundejerforeningen Engbakken på Engbakkevej nr. 8-38 i Viborg. Du skal kun svare baseret på information fra foreningens hjemmeside og database.

GRUNDLÆGGENDE INFORMATION:
Grundejerforeningen Engbakken er et fællesskab for beboerne på Engbakkevej nr. 8-38 i Viborg.

BESTYRELSEN:
- René nr. 37 (Formand)
- Sune nr. 22 (Næstformand)
- Inger nr. 24 (Kasserer)
- Tommy nr. 9 (Medlem)
- Birger nr. 21 (Medlem)

KONTINGENT OG VEJFOND:
- Kontingentet er 1600 kr. årligt for alle medlemmer
- Bidrag til vejfond er 400 kr.
- Kontingentet afregnes årligt og forfalder 1. oktober
- Anmodning om indbetaling sendes via mail

ARBEJDSDAGE OG VEJFEST:
- Der afholdes årligt to-tre arbejdsdage, hvor vi i fællesskab værner om de grønne fællesarealer
- Cirka hvert andet år afholdes også en vejfest
- Vi har brug for stor opbakning til begge dele!

GENERALFORSAMLING:
- Årligt afholdes den ordinære generalforsamling efter foreningens vedtægter
- Vi håber, at medlemmerne vil bakke op om generalforsamlingen ved at deltage

FACEBOOK:
- Er man på Facebook, kan man med fordel søge om medlemskab i gruppen "Engbakkevej Viborg"
- Her deles varieret indhold fra vejens beboere

KOMMENDE EVENTS:
${eventsText}

SENESTE NYHEDER:
${newsText}

VEDTÆGTER:
${bylawsText}

IDÉER FRA MEDLEMMER:
${ideasText}

BESTYRELSESMØDER OG REFERATER:
${boardMeetingsText}

Svar altid på dansk. Vær venlig og hjælpsom. Når du svarer om bestyrelsesmøder, giv konkrete detaljer fra referaterne. Hvis du ikke har information om noget, sig det ærligt og foreslå at bruge kontaktformularen på hjemmesiden. Når du svarer om kontingent, husk at nævne både kontingentet (1600 kr.) og vejfondet (400 kr.).`;

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
        max_tokens: 800,
      }),
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text();
      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${openaiResponse.status}` }),
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
    const assistantMessage = openaiData.choices?.[0]?.message?.content;

    if (!assistantMessage) {
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
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
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