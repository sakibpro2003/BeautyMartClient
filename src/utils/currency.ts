export const formatBDT = (amount: number | undefined | null) => {
  const value = Number(amount || 0);
  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `BDT ${formatted}`;
};
