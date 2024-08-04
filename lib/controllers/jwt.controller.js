export const verifyJWTController = async (token) => {
  return await fetch(`/api/jwt/${token}`).then((r) => r.json());
};
