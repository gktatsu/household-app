export const formatCurrency = (
  amount: number,
  currency: string
): string => {
  const symbol = currency === 'JPY' ? '¥' : currency === 'USD' ? '$' : '€';
  const decimals = currency === 'JPY' ? 0 : 2;
  
  return `${symbol}${Math.abs(amount).toLocaleString('ja-JP', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
};

export const getCurrencySymbol = (currency: string): string => {
  switch (currency) {
    case 'JPY':
      return '¥';
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    default:
      return '';
  }
};