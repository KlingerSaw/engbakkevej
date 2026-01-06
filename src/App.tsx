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
import { YearProvider } from './contexts/YearContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GlobalYearSelector } from './components/GlobalYearSelector';
import LoginModal from './components/LoginModal';
import { LogIn, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

function AppContent() {
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logget ud');
    } catch (error) {
      toast.error('Kunne ikke logge ud');
    }
  };

  return (
    <YearProvider>
      <div className="min-h-screen bg-brand-blue-lighter p-8 pb-24">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex justify-between items-center mb-4">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-brand-blue mb-4">Grundejerforeningen Engbakken</h1>
            <p className="text-xl text-gray-600">Velkommen til vores fællesskab på Engbakkevej nr. 8-38 🏡</p>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  title="Log ud"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log ud</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                title="Log ind som formand"
              >
                <LogIn className="w-4 h-4" />
                <span>Formand Login</span>
              </button>
            )}
          </div>
        </div>
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

        {/* General Meeting Section */}
        <GeneralMeetingSection
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

        {/* Two Column Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <ActivitiesSection
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

      {/* Upload Toggle Button - Fixed bottom right (only for logged in users) */}
      {user && (
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="fixed bottom-24 right-8 bg-gray-700 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition z-40"
          title={showUpload ? 'Skjul upload' : 'Vis upload'}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </button>
      )}

      {/* Chatbot */}
      <Chatbot />

      {/* Global Year Selector */}
      <GlobalYearSelector />

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
    </YearProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;