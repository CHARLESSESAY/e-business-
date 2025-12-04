
// Simple simulation of a SHA-256 like hex string generation
export const generateHash = (input: string): string => {
  let hash = 0;
  if (input.length === 0) return '0x00000000';
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  // Make it look like a blockchain hash
  return '0x' + Math.abs(hash).toString(16).padStart(64, '0').substring(0, 64);
};

export const formatCurrency = (amount: number, locale: string = 'en-SL') => {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'SLE' }).format(amount);
};

export const formatDate = (dateString: string, locale: string = 'en-GB') => {
  return new Date(dateString).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};
