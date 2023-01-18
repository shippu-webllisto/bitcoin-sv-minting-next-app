export const satoshiToBsvConversion = (satoshiAmount) => {
  const bsvAmount = Number(satoshiAmount / 100000000);
  return bsvAmount;
};

export const bsvToSatoshiConversion = (bsvAmount) => {
  const satoshiAmount = Number(bsvAmount * 100000000);
  return satoshiAmount;
};
