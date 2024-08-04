import jwt from "jsonwebtoken";

export function createToken(infos, max) {
  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    return { jwtSecretKeyNotFound: true };
  }
  if (!max || typeof max !== "number") {
    return { invalidMaxAge: true };
  }

  return jwt.sign({ infos }, secretKey, { expiresIn: max });
}
export function verifyToken(token) {
  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      return { error: "JWT_SCECRET not found" };
    }
    return jwt.verify(token, secretKey);
  } catch (error) {
    return error;
  }
}

export function decodeToken(token) {
  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      return { error: "JWT_SCECRET not found" };
    }
    return jwt.decode(token, secretKey);
  } catch (error) {
    return error;
  }
}
