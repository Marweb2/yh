// reset password
export const sendMailResetPasswordController = async (email) => {
  return await fetch(`/api/nodemailer/${email}/reset`).then((r) => r.json());
};
export const sendMailActivateUserCompteController = async (email) => {
  return await fetch(`/api/nodemailer/${email}/activate`).then((r) => r.json());
};
export const resetPasswordController = async ({ token, password, id }) => {
  return await fetch(`/api/auth/${id}/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      password,
      token,
    }),
  }).then((r) => r.json());
};
