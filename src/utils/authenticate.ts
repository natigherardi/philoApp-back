import bcrypt from "bcrypt";

export const hashCreator = (password: string) => {
  const salt = 10;
  return bcrypt.hash(password, salt);
};

export const hashCompare = (
  passwordEntered: string,
  passwordDBHashed: string
) => bcrypt.compare(passwordEntered, passwordDBHashed);
