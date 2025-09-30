import { createEvent } from 'ics';

interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  start: [number, number, number, number, number];
  duration: { hours: number; minutes: number };
}

export const generateCalendarFile = (event: CalendarEvent) => {
  const { error, value } = createEvent({
    title: event.title,
    description: event.description,
    location: event.location,
    start: event.start,
    duration: event.duration,
  });

  if (error) {
    console.error(error);
    return null;
  }

  // Create a blob with the calendar data
  const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);
  
  // Check if the user is on iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  if (isIOS) {
    // For iOS, use the webcal:// protocol
    const webcalUrl = `webcal://${window.location.host}${window.location.pathname}?calendar=${encodeURIComponent(btoa(value))}`;
    window.location.href = webcalUrl;
  } else {
    // For other platforms, download the .ics file
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${event.title.toLowerCase().replace(/\s+/g, '-')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  // Clean up the blob URL after a short delay
  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 1000);
};