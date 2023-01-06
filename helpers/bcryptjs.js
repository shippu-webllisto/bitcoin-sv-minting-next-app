import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
const salt = genSaltSync(10);

export const HashPassword = (password) => {
  return hashSync(password, salt);
};

export const ComparingPassword = (password, comparePassword) => {
  return compareSync(password, comparePassword);
};
