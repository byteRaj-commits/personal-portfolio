import nodemailer from "nodemailer";
import ApiError from "./ApiError.js";

const requiredEnvVars = ["SMTP_EMAIL", "SMTP_APP_PASSWORD"];

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (char) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[char];
  });

const validateMailConfig = () => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new ApiError(
      500,
      `Email service is not configured. Missing: ${missing.join(", ")}`
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(process.env.SMTP_EMAIL)) {
    throw new ApiError(500, "SMTP_EMAIL must be a valid Gmail address.");
  }
};

const createTransporter = () => {
  validateMailConfig();

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_APP_PASSWORD,
    },
  });
};

export const sendContactEmails = async ({ name, email, subject, message, type }) => {
  try {
    const transporter = createTransporter();
    const destinationEmail = process.env.CONTACT_EMAIL || process.env.SMTP_EMAIL;
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeType = escapeHtml(type);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${process.env.SMTP_EMAIL}>`,
      to: destinationEmail,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      text: [
        "You received a new portfolio contact form submission.",
        `Name: ${name}`,
        `Email: ${email}`,
        `Type: ${type}`,
        `Subject: ${subject}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html: `
        <h2>New Portfolio Contact</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Type:</strong> ${safeType}</p>
        <p><strong>Subject:</strong> ${safeSubject}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
    });

    await transporter.sendMail({
      from: `"Raj Portfolio" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Thanks for reaching out",
      text: [
        `Hi ${name},`,
        "",
        "Thanks for reaching out through my portfolio. I received your message and will get back to you soon.",
        "",
        `Subject: ${subject}`,
        "",
        "Best regards,",
        "Raj",
      ].join("\n"),
    });
  } catch (error) {
    if (error?.code === "EAUTH" || error?.responseCode === 535) {
      throw new ApiError(
        500,
        "Gmail authentication failed. Use your Gmail address in SMTP_EMAIL and a Google App Password in SMTP_APP_PASSWORD."
      );
    }

    throw new ApiError(500, error.message || "Failed to send email");
  }
};
