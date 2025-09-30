import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ChevronDown, ChevronUp, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { EventRegistration } from './EventRegistration';
import toast from 'react-hot-toast';
import { getDeviceId } from '../lib/deviceId';
import { HouseVerification } from './shared/HouseVerification';

interface Registration {
  id: string;
  house_number: number;
  adults: number;
  children: number;
  device_id?: string;
  declined: boolean;
  decline_reason?: string;
}

interface EventRegistrationsProps {
  eventName: string;
  eventDate: string;
  eventId: string;
}

interface DeleteConfirmationModalProps {
  registration: Registration;
  onConfirm: () => void;
  onCancel: () => void;
}

export function EventRegistrations({ eventName, eventDate, eventId }: EventRegistrationsProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showList, setShowList] = useState(true);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [registrationToDelete, setRegistrationToDelete] = useState<Registration | null>(null);
  const [showHouseVerification, setShowHouseVerification] = useState(false);
  const [actionType, setActionType] = useState<'edit' | 'delete' | null>(null);
  const [pendingRegistration, setPendingRegistration] = useState<Registration | null>(null);
  const [showDeclined, setShowDeclined] = useState(false);
  const deviceId = getDeviceId();

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', eventId)
        .order('house_number');

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast.error('Kunne ikke hente tilmeldinger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();

    const channel = supabase
      .channel('event_registrations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_registrations',
          filter: `event_id=eq.${eventId}`
        },
        () => {
          fetchRegistrations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  const handleDelete = async (registration: Registration) => {
    try {
      await supabase.rpc('app_set_config_value', {
        param_key: 'app.device_id',
        param_value: deviceId
      });

      const { data, error } = await supabase.rpc('delete_event_registration', {
        registration_id: registration.id,
        device_identifier: deviceId
      });

      if (error) throw error;

      if (data) {
        toast.success('Tilmelding er blevet slettet');
        setRegistrationToDelete(null);
        await fetchRegistrations();
      } else {
        toast.error('Kunne ikke slette - du har ikke rettigheder til at slette denne tilmelding');
      }
    } catch (error) {
      console.error('Error deleting registration:', error);
      toast.error('Der opstod en fejl ved sletning');
    }
  };

  const handleHouseVerified = async (houseNumber: number) => {
    if (!pendingRegistration) return;

    if (pendingRegistration.house_number !== houseNumber) {
      toast.error('Det valgte husnummer matcher ikke tilmeldingen');
      return;
    }

    if (actionType === 'edit') {
      setSelectedRegistration(pendingRegistration);
    } else if (actionType === 'delete') {
      await handleDelete(pendingRegistration);
    }

    setShowHouseVerification(false);
    setPendingRegistration(null);
    setActionType(null);
  };

  const handleEditClick = (registration: Registration) => {
    setActionType('edit');
    setPendingRegistration(registration);
    setShowHouseVerification(true);
  };

  const handleDeleteClick = (registration: Registration) => {
    setActionType('delete');
    setPendingRegistration(registration);
    setShowHouseVerification(true);
  };

  const acceptedRegistrations = registrations.filter(reg => !reg.declined);
  const declinedRegistrations = registrations.filter(reg => reg.declined);
  const totalAdults = acceptedRegistrations.reduce((sum, reg) => sum + reg.adults, 0);
  const totalChildren = acceptedRegistrations.reduce((sum, reg) => sum + reg.children, 0);

  const canModifyRegistration = (registration: Registration) => {
    return new Date(eventDate) > new Date();
  };

  if (loading) {
    return (
      <div className="mt-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div 
        className="mt-4"
        layout
      >
        <div className="flex items-center gap-2 text-sm text-brand-blue mb-2">
          <Users className="w-4 h-4" />
          <span>Tilmeldte: {totalAdults} voksne, {totalChildren} børn</span>
        </div>
        
        {registrations.length > 0 && (
          <motion.button
            onClick={() => setShowList(!showList)}
            className="flex items-center gap-2 text-sm text-brand-blue mt-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {showList ? (
              <>
                <ChevronUp className="w-4 h-4 text-brand-blue" />
                <span className="text-brand-blue">Skjul deltagerliste</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 text-brand-blue" />
                <span className="text-brand-blue">Se hvem der kommer</span>
              </>
            )}
          </motion.button>
        )}

        <AnimatePresence>
          {showList && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 mt-3">
                {/* Accepted registrations */}
                <div className="pl-4 border-l-2 border-brand-blue/10">
                  {acceptedRegistrations.map((reg) => (
                    <motion.div
                      key={reg.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex items-center justify-between text-sm text-brand-blue"
                      layout
                    >
                      <span>Nr. {reg.house_number}: {reg.adults} voksne, {reg.children} børn</span>
                      {canModifyRegistration(reg) && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditClick(reg)}
                            className="p-1 hover:bg-brand-blue/10 rounded-full transition-colors"
                            title="Rediger tilmelding"
                          >
                            <Edit2 className="w-4 h-4 text-brand-blue" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(reg)}
                            className="p-1 hover:bg-red-100 rounded-full transition-colors"
                            title="Afmeld"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Declined registrations */}
                {declinedRegistrations.length > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={() => setShowDeclined(!showDeclined)}
                      className="flex items-center gap-2 text-sm text-red-500"
                    >
                      {showDeclined ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                      <span>{declinedRegistrations.length} kan ikke deltage</span>
                    </button>

                    <AnimatePresence>
                      {showDeclined && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pl-4 mt-2 border-l-2 border-red-200"
                        >
                          {declinedRegistrations.map((reg) => (
                            <motion.div
                              key={reg.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="text-sm text-red-500 mb-2"
                            >
                              <div className="flex items-center justify-between">
                                <span>Nr. {reg.house_number}</span>
                                {canModifyRegistration(reg) && (
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleEditClick(reg)}
                                      className="p-1 hover:bg-red-100 rounded-full transition-colors"
                                      title="Rediger"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteClick(reg)}
                                      className="p-1 hover:bg-red-100 rounded-full transition-colors"
                                      title="Slet"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                              {reg.decline_reason && (
                                <p className="text-gray-500 text-xs mt-1">{reg.decline_reason}</p>
                              )}
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {selectedRegistration && new Date(eventDate) > new Date() && (
        <EventRegistration
          eventName={eventName}
          eventDate={eventDate}
          eventId={eventId}
          onClose={() => {
            setSelectedRegistration(null);
            fetchRegistrations();
          }}
          onRegistrationComplete={fetchRegistrations}
          existingRegistration={selectedRegistration}
        />
      )}

      {showHouseVerification && (
        <HouseVerification
          onVerified={handleHouseVerified}
          onCancel={() => {
            setShowHouseVerification(false);
            setPendingRegistration(null);
            setActionType(null);
          }}
          title={`Bekræft husnummer for at ${actionType === 'edit' ? 'redigere' : 'slette'}`}
        />
      )}
    </>
  );
}