import React, { useState } from 'react';
import { WelcomeSection } from './components/sections/Welcome';
import { NewsSection } from './components/sections/News';
import { ActivitiesSection } from './components/sections/Activities';
import { GeneralMeetingSection } from './components/sections/GeneralMeeting';
import { FeesSection } from './components/sections/Fees';
import { FacebookSection } from './components/sections/Facebook';
import { CalendarSection } from './components/sections/Calendar';
import { IdeasSection } from './components/sections/Ideas';
import { BoardSection } from './components/sections/Board';
import { BoardMeetingsSection } from './components/sections/BoardMeetings';
import { BylawsSection } from './components/sections/Bylaws';
import { ContactForm } from './components/ContactForm';
import { Chatbot } from './components/Chatbot';
import MinutesUpload from './components/MinutesUpload';

function App() {
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="min-h-screen bg-brand-blue-lighter p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold text-brand-blue mb-4">Grundejerforeningen Engbakken</h1>
        <p className="text-xl text-gray-600">Velkommen til vores fællesskab på Engbakkevej nr. 8-38 🏡</p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid gap-8">
        {/* Top Row - Full Width Welcome */}
        <WelcomeSection 
          hoveredSection={hoveredSection}
          setHoveredSection={setHoveredSection}
        />

        {/* News Section */}
        <NewsSection 
          hoveredSection={hoveredSection}
          setHoveredSection={setHoveredSection}
        />

        {/* Calendar Section */}
        <CalendarSection 
          hoveredSection={hoveredSection}
          setHoveredSection={setHoveredSection}
        />

        {/* Ideas Section */}
        <IdeasSection 
          hoveredSection={hoveredSection}
          setHoveredSection={setHoveredSection}
        />

        {/* Board Meetings Section */}
        <BoardMeetingsSection 
          hoveredSection={hoveredSection}
          setHoveredSection={setHoveredSection}
        />

        {/* Facebook Section */}
        <FacebookSection 
          hoveredSection={hoveredSection}
          setHoveredSection={setHoveredSection}
        />

        {/* Three Column Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <ActivitiesSection 
            hoveredSection={hoveredSection}
            setHoveredSection={setHoveredSection}
          />
          <GeneralMeetingSection 
            hoveredSection={hoveredSection}
            setHoveredSection={setHoveredSection}
          />
          <FeesSection 
            hoveredSection={hoveredSection}
            setHoveredSection={setHoveredSection}
          />
        </div>

        {/* Bylaws Section */}
        <BylawsSection 
          hoveredSection={hoveredSection}
          setHoveredSection={setHoveredSection}
        />

        {/* Board Section */}
        <BoardSection
          hoveredSection={hoveredSection}
          setHoveredSection={setHoveredSection}
        />

        {/* Upload Section - Hidden by default */}
        {showUpload && (
          <div className="mt-12">
            <MinutesUpload />
          </div>
        )}

        {/* Contact Form */}
        <div className="mt-12">
          <ContactForm />
        </div>
      </div>

      {/* Upload Toggle Button - Fixed bottom right */}
      <button
        onClick={() => setShowUpload(!showUpload)}
        className="fixed bottom-24 right-8 bg-gray-700 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition z-40"
        title={showUpload ? 'Skjul upload' : 'Vis upload (kun formand)'}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      </button>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}

export default App;