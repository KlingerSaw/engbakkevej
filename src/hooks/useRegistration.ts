import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getDeviceId } from '../lib/deviceId';
import toast from 'react-hot-toast';
import { UseRegistrationProps } from '../types/registration';
import { useRegistrationSubmit } from './useRegistrationSubmit';
import { useHouseNumberValidation } from './useHouseNumberValidation';

export function useRegistration(props: UseRegistrationProps) {
  const [houseNumber, setHouseNumber] = useState(
    props.existingRegistration?.house_number.toString() || ''
  );
  const [adults, setAdults] = useState(props.existingRegistration?.adults || 1);
  const [children, setChildren] = useState(props.existingRegistration?.children || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { houseNumberError, validateHouseNumber } = useHouseNumberValidation(props);
  const { handleSubmit } = useRegistrationSubmit({
    ...props,
    houseNumber,
    adults,
    children,
    setIsSubmitting
  });

  useEffect(() => {
    if (props.eventId && houseNumber) {
      validateHouseNumber(houseNumber);
    }
  }, [houseNumber, validateHouseNumber, props.eventId]);

  return {
    handleSubmit,
    isSubmitting,
    houseNumber,
    setHouseNumber,
    houseNumberError,
    adults,
    setAdults,
    children,
    setChildren
  };
}