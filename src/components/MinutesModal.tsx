import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Printer, Download } from 'lucide-react';

interface MinutesModalProps {
  minutes: string;
  onClose: () => void;
  meetingDate: string;
  location: string;
}

export function MinutesModal({ minutes, onClose, meetingDate, location }: MinutesModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const date = new Date(meetingDate).toLocaleDateString('da-DK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Referat - ${date}</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              line-height: 1.5;
              max-width: 800px;
              margin: 2rem auto;
              padding: 0 1rem;
            }
            h1, h2, h3 { color: #424874; }
            hr { margin: 2rem 0; }
            ul { padding-left: 1.5rem; }
            li { margin: 0.5rem 0; }
            strong { color: #424874; }
          </style>
        </head>
        <body>
          ${minutes}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    const date = new Date(meetingDate).toLocaleDateString('da-DK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Create a clean text version by removing HTML tags
    const textContent = minutes.replace(/<[^>]+>/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Referat-${date}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center" style={{ zIndex: 9999 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full my-8 mx-4 flex flex-col max-h-[calc(100vh-4rem)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b flex justify-between items-center bg-brand-blue text-white sticky top-0">
          <h2 className="text-xl font-semibold">
            Referat - {new Date(meetingDate).toLocaleDateString('da-DK', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 hover:text-brand-cream transition-colors"
            >
              <Printer className="w-5 h-5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 hover:text-brand-cream transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="hover:text-brand-cream transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <div 
            className="prose prose-brand max-w-none"
            dangerouslySetInnerHTML={{ __html: minutes }}
          />
        </div>
      </motion.div>
    </div>
  );
}