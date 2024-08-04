import nodemailer from "nodemailer";
import { isEmpty } from "../../lib/utils/isEmpty";
const service = process.env.SERVICE;
const emailUser = process.env.EMAIL;
const passwordUser = process.env.PASSWORD;
const sender = process.env.SENDER;

export const nodeMailer = async ({ to, subject, text, html }) => {
  if (!service) {
    return { error: "Service required" };
  } else if (!emailUser) {
    return { error: "Email required" };
  } else if (!passwordUser) {
    return { error: "Password is required" };
  } else if (!sender) {
    return { error: "Sender is required" };
  } else {
    const transporter = nodemailer.createTransport({
      service,
      auth: { user: emailUser, pass: passwordUser },
    });

    const message = {
      from: `${sender} <${emailUser}>`,
      to,
      text,
      subject,
      html,
    };

    const res = await transporter.sendMail(message);

    if (!isEmpty(res?.error)) {
      return { error: res.error };
    } else {
      return { message: "Email sent" };
    }
  }
};
