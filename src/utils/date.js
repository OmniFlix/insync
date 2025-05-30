export const fixDateString = (input) => {
    return input.replace(/T(\d{2}:\d{2}:\d)Z/, 'T$10Z'); // Ensure two digits for seconds
};

export const getPendingTime = (timestamp) => {
  const now = Date.now(); // current time in ms
  const futureTime = timestamp * 1000; // convert seconds to ms
  let diffInMs = futureTime - now;

  if (diffInMs <= 0) return '0 Seconds';

  const seconds = Math.floor(diffInMs / 1000);
  const days = Math.floor(seconds / (24 * 3600));
  const hours = Math.floor((seconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (days > 0) return days > 1 ? `${days} Days` : `${days} Day`;
  if (hours > 0) return hours > 1 ? `${hours} Hours` : `${hours} Hour`;
  if (minutes > 0) return minutes > 1 ? `${minutes} Minutes` : `${minutes} Minute`;
  if (secs > 0) return secs > 1 ? `${secs} Seconds` : `${secs} Second`;

  return '0s';
}
