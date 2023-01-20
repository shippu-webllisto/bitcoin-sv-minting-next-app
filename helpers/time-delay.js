export const timeDelay = (_function, seconds) => {
  setTimeout(async () => {
    const data = await _function();
    return data;
  }, seconds * 1000);
};
