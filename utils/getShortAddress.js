export const getShortAddress = (dataAddress) => {
  const address = `${dataAddress?.substring(0, 5)}...${dataAddress?.substring(dataAddress.length - 6)}`;
  return address;
};
