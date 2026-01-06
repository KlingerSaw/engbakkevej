export function formatMeetingDate(dateString: string): string {
  const [datePart, timePart] = dateString.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart ? timePart.slice(0, 5).split(':').map(Number) : [0, 0];

  const date = new Date(year, month - 1, day, hour, minute);

  const weekdays = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
  const months = [
    'januar', 'februar', 'marts', 'april', 'maj', 'juni',
    'juli', 'august', 'september', 'oktober', 'november', 'december'
  ];

  const weekday = weekdays[date.getDay()];
  const monthName = months[date.getMonth()];
  const formattedHour = hour.toString().padStart(2, '0');
  const formattedMinute = minute.toString().padStart(2, '0');

  return `${weekday} den ${day}. ${monthName} ${year} kl. ${formattedHour}.${formattedMinute}`;
}

export function formatDateForPDF(dateString: string): string {
  const [datePart] = dateString.split('T');
  const [year, month, day] = datePart.split('-').map(Number);

  const months = [
    'januar', 'februar', 'marts', 'april', 'maj', 'juni',
    'juli', 'august', 'september', 'oktober', 'november', 'december'
  ];

  const monthName = months[month - 1];
  return `${day}. ${monthName} ${year}`;
}
