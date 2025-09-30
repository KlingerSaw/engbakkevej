import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { UseRegistrationProps } from '../types/registration';

export function useHouseNumberValidation({ 
  eventId, 
  existingRegistration 
}: UseRegistrationProps) {
  const [houseNumberError, setHouseNumberError] = useState('');

  const validateHouseNumber = useCallback(async (number: string) => {
    if (!number) {
      setHouseNumberError('');
      return;
    }

    const houseNum = parseInt(number);
    if (isNaN(houseNum) || houseNum < 8 || houseNum > 38) {
      setHouseNumberError('Ugyldigt husnummer. Vælg mellem 8-38');
      return;
    }

    // Skip validation if eventId is not provided
    if (!eventId) {
      setHouseNumberError('');
      return;
    }

    try {
      const { data: existingRegistrations, error } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('event_id', eventId)
        .eq('house_number', houseNum);

      if (error) {
        console.error('Error validating house number:', error);
        return;
      }

      if (existingRegistrations?.length && !existingRegistration) {
        setHouseNumberError('Dette husnummer er allerede tilmeldt');
      } else {
        setHouseNumberError('');
      }
    } catch (error) {
      console.error('Error checking house number:', error);
    }
  }, [eventId, existingRegistration]);

  return { houseNumberError, validateHouseNumber };
}