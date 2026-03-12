import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendConsultationBookingEmailToDoctor(
  doctorEmail: string,
  doctorName: string,
  consultationId: string,
  patientName: string,
  patientEmail: string,
  patientPhone: string,
  symptoms: string
): Promise<void> {
  const adminUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const consultationUrl = `${adminUrl}/admin/dashboard?tab=consultations&id=${consultationId}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: doctorEmail,
    subject: `New Consultation Request - ${patientName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; border-bottom: 2px solid #E6A57E; padding-bottom: 10px;">New Consultation Request</h2>
        
        <p>Dear Dr. ${doctorName},</p>
        
        <p>A new consultation request has been received and payment has been completed.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #E6A57E; margin-top: 0;">Patient Details:</h3>
          <p><strong>Name:</strong> ${patientName}</p>
          <p><strong>Email:</strong> ${patientEmail}</p>
          <p><strong>Phone:</strong> ${patientPhone}</p>
          <p><strong>Symptoms:</strong> ${symptoms}</p>
        </div>
        
        <p style="margin-top: 30px;">
          <a href="${consultationUrl}" 
             style="background-color: #E6A57E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Review & Schedule Consultation
          </a>
        </p>
        
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          Consultation ID: ${consultationId}
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendConsultationScheduledEmailToUser(
  userEmail: string,
  userName: string,
  doctorName: string,
  scheduledDate: string,
  scheduledTimeIST: string,
  consultationType: string
): Promise<void> {
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: userEmail,
    subject: `Consultation Scheduled - ${doctorName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; border-bottom: 2px solid #E6A57E; padding-bottom: 10px;">Consultation Scheduled</h2>
        
        <p>Dear ${userName},</p>
        
        <p>Your consultation has been confirmed by Dr. ${doctorName}.</p>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #E6A57E;">
          <h3 style="color: #E6A57E; margin-top: 0;">Consultation Details:</h3>
          <p><strong>Doctor:</strong> Dr. ${doctorName}</p>
          <p><strong>Date:</strong> ${scheduledDate}</p>
          <p><strong>Time (IST):</strong> ${scheduledTimeIST}</p>
          <p><strong>Type:</strong> ${consultationType}</p>
        </div>
        
        <p style="margin-top: 20px;">
          <strong>Please be available 5 minutes before the scheduled time.</strong> The doctor will connect with you via your registered email or phone number.
        </p>
        
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          If you need to reschedule, please contact us at your earliest convenience.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
