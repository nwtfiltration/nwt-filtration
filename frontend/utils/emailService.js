import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  await mailer.sendMail({
    from: `"NWT Filtration" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
};
