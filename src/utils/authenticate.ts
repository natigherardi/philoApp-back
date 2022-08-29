import bcrypt from "bcrypt";

const hashCreator = (password: string) => {
  const salt = 10;
  return bcrypt.hash(password, salt);
};

export default hashCreator;
