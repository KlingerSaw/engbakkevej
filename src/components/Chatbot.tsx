import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hej! Jeg er din assistent for Grundejerforeningen Engbakken. Jeg kan hjælpe dig med information om foreningen, events, vedtægter og meget mere. Hvad kan jeg hjælpe dig med?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const userInput = input.toLowerCase();
    setInput('');
    setIsLoading(true);

    try {
      const { data: boardMeetings } = await supabase
        .from('board_meetings')
        .select('*')
        .order('date', { ascending: false })
        .limit(5);

      const { data: events } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      const { data: bylaws } = await supabase
        .from('bylaws')
        .select('*')
        .order('section_number', { ascending: true });

      let responseText = '';

      if (userInput.includes('bestyrelse') && !userInput.includes('møde')) {
        responseText = `Bestyrelsen består af:\n\n- René nr. 37 (Formand)\n- Sune nr. 22 (Næstformand)\n- Inger nr. 24 (Kasserer)\n- Tommy nr. 9 (Medlem)\n- Birger nr. 21 (Medlem)`;
      } else if (userInput.includes('kontingent') || userInput.includes('pris') || userInput.includes('koster')) {
        responseText = 'Kontingentet er 500 kr. årligt for alle medlemmer.';
      } else if (userInput.includes('møde') || userInput.includes('referat') || userInput.includes('drøftet')) {
        if (boardMeetings && boardMeetings.length > 0) {
          const latestMeeting = boardMeetings[0];
          const stripHtml = (html: string) => {
            return html
              .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
              .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
              .replace(/<!DOCTYPE[^>]*>/gi, '')
              .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
              .replace(/<\/?html[^>]*>/gi, '')
              .replace(/<\/?body[^>]*>/gi, '')
              .replace(/<br\s*\/?>/gi, '\n')
              .replace(/<\/?(p|div|h[1-6]|li)[^>]*>/gi, '\n')
              .replace(/<[^>]*>/g, '')
              .replace(/&nbsp;/g, ' ')
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/\n\s*\n/g, '\n\n')
              .replace(/[ \t]+/g, ' ')
              .trim();
          };

          const meetingDate = new Date(latestMeeting.date).toLocaleDateString('da-DK', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          const cleanText = latestMeeting.minutes_text
            ? stripHtml(latestMeeting.minutes_text)
            : 'Intet referat tilgængeligt endnu.';

          const minutesPreview = cleanText.length > 800
            ? cleanText.substring(0, 800) + '...'
            : cleanText;

          responseText = `Seneste bestyrelsesmøde var den ${meetingDate} hos ${latestMeeting.location}.\n\n${minutesPreview}`;
        } else {
          responseText = 'Der er ingen bestyrelsesmødereferater tilgængelige endnu.';
        }
      } else if (userInput.includes('event') || userInput.includes('arrangement')) {
        if (events && events.length > 0) {
          responseText = 'Kommende events:\n\n' + events.map(e => {
            const date = new Date(e.date).toLocaleDateString('da-DK', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            return `- ${e.name} den ${date}${e.description ? ': ' + e.description : ''}`;
          }).join('\n');
        } else {
          responseText = 'Der er ingen kommende events planlagt i øjeblikket.';
        }
      } else if (userInput.includes('vedtægt')) {
        if (bylaws && bylaws.length > 0) {
          responseText = 'Foreningens vedtægter:\n\n' + bylaws.slice(0, 5).map(b =>
            `§${b.section_number} ${b.title}`
          ).join('\n') + '\n\nDu kan se alle vedtægter i afsnittet "Vedtægter" på hjemmesiden.';
        } else {
          responseText = 'Vedtægterne er ikke tilgængelige i øjeblikket.';
        }
      } else {
        responseText = 'Jeg kan hjælpe dig med:\n\n- Information om bestyrelsen\n- Kontingent og priser\n- Kommende events og arrangementer\n- Bestyrelsesmøder og referater\n- Foreningens vedtægter\n\nHvad vil du gerne vide mere om?';
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: responseText
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Beklager, der opstod en fejl. Prøv venligst igen.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 z-50"
          aria-label="Åbn chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
          <div className="bg-green-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-semibold">Engbakken Assistent</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-green-700 rounded p-1 transition-colors"
              aria-label="Luk chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Skriv din besked..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send besked"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
