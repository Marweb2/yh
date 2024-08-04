/** @format */

// Register validation
export const validateName = (name) => {
  const error = { minNameRegisterError: false, maxNameRegisterError: false };
  if (name?.trim()?.length < 3) {
    Object.keys(error).forEach((key) => {
      error[key] = false;
    });
    error.minNameRegisterError = true;
  } else if (name?.trim()?.length > 50) {
    Object.keys(error).forEach((key) => {
      error[key] = false;
    });
    error.maxNameRegisterError = true;
  }
  return error;
};
export const validateUsername = (username) => {
  const error = {
    minUsernameRegisterError: false,
    maxUsernameRegisterError: false,
  };
  if (username?.trim()?.length < 3) {
    Object.keys(error).forEach((key) => {
      error[key] = false;
    });
    error.minUsernameRegisterError = true;
  } else if (username?.trim()?.length > 50) {
    Object.keys(error).forEach((key) => {
      error[key] = false;
    });
    error.maxUsernameRegisterError = true;
  }
  return error;
};
export const validatePassword = (password) => {
  const error = { minPasswordRegisterError: false };
  if (password?.length < 6) {
    error.minPasswordRegisterError = true;
  }
  return error;
};

// login
export const loginController = async ({
  email,
  password,
  userType,
  remember,
}) => {
  return await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, userType, remember }),
  }).then((r) => r.json());
};
// register
export const registerController = async ({
  name,
  username,
  email,
  password,
  userType,
}) => {
  return await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      username,
      email,
      password,
      userType,
    }),
  }).then((r) => r.json());
};

// logout
export const logoutController = async (token) => {
  await fetch(`/api/auth/logout/${token}`).then((r) => r.json());
};

// fetchToken
export const fetchTokenController = async () => {
  return await fetch("/api/jwt").then((r) => r.json());
};

// removeToken
export const removeTokenController = async () => {
  return await fetch("/api/jwt/remove").then((r) => r.json());
};
