import nodemailer from 'nodemailer';

const getMailerConfiguration = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASSWORD, EMAIL_FROM } = process.env;
  const port = Number(SMTP_PORT || 587);

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD || !EMAIL_FROM) {
    return { error: 'SMTP email settings are missing on the backend.' };
  }
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return { error: 'SMTP_PORT must be a valid port number.' };
  }

  return {
    host: SMTP_HOST,
    port,
    secure: SMTP_SECURE === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    from: EMAIL_FROM
  };
};

const sendEmail = async ({ to, subject, text }) => {
  const configuration = getMailerConfiguration();
  if (configuration.error) return { sent: false, message: configuration.error };

  try {
    const transporter = nodemailer.createTransport({
      host: configuration.host,
      port: configuration.port,
      secure: configuration.secure,
      auth: configuration.auth,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000
    });
    await transporter.sendMail({
      from: configuration.from,
      to,
      subject: String(subject).replace(/[\r\n]+/g, ' ').slice(0, 180),
      text
    });
    return { sent: true };
  } catch (error) {
    console.error('[Moderation Email Error]:', error);
    return { sent: false, message: 'SMTP could not deliver the notification email.' };
  }
};

export const sendAdminDecisionEmail = async (supabase, { userId, subject, text }) => {
  try {
    const { data, error } = await supabase.rpc('admin_notification_recipient', {
      user_id_param: userId
    });

    if (error) {
      console.error('[Notification Recipient Lookup Error]:', error);
      return { sent: false, message: 'Could not retrieve the recipient email.' };
    }

    const recipient = Array.isArray(data) ? data[0] : data;
    if (!recipient?.email) {
      return { sent: false, message: 'The recipient account has no email address.' };
    }

    return await sendEmail({
      to: recipient.email,
      subject,
      text: `Hello ${recipient.full_name || 'Student'},\n\n${text}`
    });
  } catch (error) {
    console.error('[Moderation Notification Error]:', error);
    return { sent: false, message: 'The notification email could not be sent.' };
  }
};
