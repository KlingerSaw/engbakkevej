import { supabase } from '../lib/supabase';
import { getDeviceId } from '../lib/deviceId';
import toast from 'react-hot-toast';
import { UseRegistrationSubmitProps } from '../types/registration';

interface UseRegistrationSubmitProps extends UseRegistrationSubmitProps {
  houseNumber: string;
  adults: number;
  children: number;
  setIsSubmitting: (value: boolean) => void;
  isDeclined?: boolean;
  declineReason?: string;
}

export function useRegistrationSubmit({
  eventId,
  eventName,
  eventDate,
  existingRegistration,
  houseNumber,
  adults,
  children,
  onClose,
  onRegistrationComplete,
  setIsSubmitting,
  isDeclined = false,
  declineReason = ''
}: UseRegistrationSubmitProps) {
  const deviceId = getDeviceId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventId) {
      toast.error('Kunne ikke finde arrangementet');
      return;
    }

    setIsSubmitting(true);

    try {
      // Check for existing registration for this house number
      const { data: existingRegistrations, error: checkError } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', eventId)
        .eq('house_number', parseInt(houseNumber));

      if (checkError) throw checkError;

      // If there's an existing registration and it's not the one being edited
      if (existingRegistrations?.length > 0 && 
          (!existingRegistration || existingRegistrations[0].id !== existingRegistration.id)) {
        // Set the existing registration for editing
        const existingReg = existingRegistrations[0];
        if (existingReg.device_id === deviceId) {
          setIsSubmitting(false);
          onClose();
          // Re-open with the existing registration
          onRegistrationComplete?.();
          return;
        } else {
          toast.error('Dette husnummer er allerede tilmeldt arrangementet');
          setIsSubmitting(false);
          return;
        }
      }

      if (existingRegistration) {
        const { error } = await supabase
          .from('event_registrations')
          .update({
            adults: isDeclined ? 0 : adults,
            children: isDeclined ? 0 : children,
            device_id: deviceId,
            event_id: eventId,
            declined: isDeclined,
            decline_reason: isDeclined ? declineReason : null
          })
          .eq('id', existingRegistration.id);

        if (error) throw error;
        toast.success(isDeclined ? 'Afbud er registreret!' : 'Tilmelding er opdateret!');
      } else {
        const { error } = await supabase
          .from('event_registrations')
          .insert([{
            event_id: eventId,
            event_name: eventName,
            event_date: eventDate,
            house_number: parseInt(houseNumber),
            adults: isDeclined ? 0 : adults,
            children: isDeclined ? 0 : children,
            device_id: deviceId,
            declined: isDeclined,
            decline_reason: isDeclined ? declineReason : null
          }]);

        if (error) throw error;
        toast.success(isDeclined ? 'Tak for dit afbud!' : 'Tak for din tilmelding!');
      }

      if (onRegistrationComplete) {
        onRegistrationComplete();
      }
      
      onClose();
    } catch (error) {
      console.error('Error registering:', error);
      toast.error('Der opstod en fejl. Prøv igen senere.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit };
}