import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function ContactForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('webmaster_requests')
        .insert([{ 
          name, 
          message 
        }]);

      if (error) throw error;

      toast.success('Tak for din besked! Vi vender tilbage hurtigst muligt.');
      setName('');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Der opstod en fejl. Prøv igen senere.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Mail className="w-6 h-6 text-brand-blue" />
        <h2 className="text-xl font-semibold text-brand-blue">Kontakt webmaster</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Navn
          </label>
          <input
            type="text"
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-brand-blue focus:border-brand-blue"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Besked
          </label>
          <textarea
            id="message"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border rounded-md focus:ring-brand-blue focus:border-brand-blue"
          />
        </div>
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-md hover:bg-brand-blue-dark disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Sender...' : 'Send besked'}</span>
        </motion.button>
      </form>
    </div>
  );
}