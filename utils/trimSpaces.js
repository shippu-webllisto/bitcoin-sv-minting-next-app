export const trimSpaces = (text) => {
  const Text = text.trim();
  const result = Text.replace(/\s+/g, ' ');
  return result;
};
