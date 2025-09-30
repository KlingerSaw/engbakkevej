export interface RegistrationModalProps {
  eventName: string;
  eventDate: string;
  eventId: string;
  onClose: () => void;
  onRegistrationComplete?: () => void;
  existingRegistration?: {
    id: string;
    house_number: number;
    adults: number;
    children: number;
    device_id?: string;
    declined?: boolean;
    decline_reason?: string;
  };
}

export interface RegistrationFormProps extends RegistrationModalProps {}

export interface AddressStepProps {
  houseNumber: string;
  setHouseNumber: (value: string) => void;
  houseNumberError: string;
  eventId: string;
  existingRegistration?: {
    id: string;
    house_number: number;
    adults: number;
    children: number;
    device_id?: string;
    declined?: boolean;
    decline_reason?: string;
  };
}

export interface ParticipantsStepProps {
  houseNumber: string;
  adults: number;
  children: number;
  setAdults: (value: number) => void;
  setChildren: (value: number) => void;
}

export interface RegistrationButtonsProps {
  step: number;
  setStep: (step: number) => void;
  onClose: () => void;
  isSubmitting: boolean;
  houseNumberError: string;
  onVerifyHouse: () => void;
  existingRegistration?: {
    id: string;
    house_number: number;
    adults: number;
    children: number;
    device_id?: string;
    declined?: boolean;
    decline_reason?: string;
  };
}

export interface UseRegistrationProps {
  eventName: string;
  eventDate: string;
  eventId: string;
  existingRegistration?: {
    id: string;
    house_number: number;
    adults: number;
    children: number;
    device_id?: string;
    declined?: boolean;
    decline_reason?: string;
  };
  onClose: () => void;
  onRegistrationComplete?: () => void;
  isDeclined?: boolean;
  declineReason?: string;
}