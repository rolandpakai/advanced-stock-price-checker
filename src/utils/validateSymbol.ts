export const validateSymbol = (symbol: string): string => {
  if (!symbol || symbol.trim() === "") {
    throw new Error(`No symbol provided: '${symbol}'`);
  }

  const clearedSymbol = symbol.trim().toUpperCase();

  return clearedSymbol;
};
