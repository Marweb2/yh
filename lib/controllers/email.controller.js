import validator from "validator";
export const emailController = (email) => {
  return validator.isEmail(email?.trim());
};
