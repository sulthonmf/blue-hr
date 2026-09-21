import nodemailer from 'nodemailer';

export interface DemoRequestPayload {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  employeeCount: string;
  preferredDate?: string;
  notes?: string;
  refCode: string;
}

export class EmailService {
  private static getEmailConfig() {
    const user = process.env.GOOGLE_USER || process.env.GMAIL_USER || process.env.EMAIL_USER;
    const pass = process.env.GOOGLE_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD;
    return { user, pass };
  }

  private static getTransporter() {
    const { user, pass } = this.getEmailConfig();

    if (!user || !pass) {
      console.warn('[EmailService] GOOGLE_USER/GMAIL_USER or GOOGLE_APP_PASSWORD/GMAIL_APP_PASSWORD not set! Emails will run in mock mode.');
      return null;
    }

    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });
  }

  static async sendDemoRequestNotification(data: DemoRequestPayload) {
    const { user } = this.getEmailConfig();
    const transporter = this.getTransporter();
    const notificationTarget = process.env.DEMO_NOTIFICATION_EMAIL || user || 'admin@bluehr.id';

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; background-color: #ffffff; color: #1e293b;">
        <div style="border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="color: #2563eb; margin: 0; font-size: 22px; display: flex; align-items: center; gap: 8px;">
            🏢 Permohonan Demo Baru - BlueHR Enterprise
          </h2>
          <p style="color: #64748b; font-size: 13px; margin-top: 4px; margin-bottom: 0;">
            Permohonan demo diajukan melalui Landing Page pada ${new Date().toLocaleString('id-ID')}
          </p>
        </div>

        <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 12px 16px; border-radius: 4px; margin-bottom: 20px;">
          <span style="font-size: 12px; font-weight: bold; color: #1d4ed8; text-transform: uppercase; tracking-wider: 1px;">Kode Referensi:</span>
          <div style="font-family: monospace; font-size: 20px; font-weight: bold; color: #1e40af; margin-top: 2px;">
            ${data.refCode}
          </div>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
          <tr style="background-color: #f8fafc;">
            <td style="padding: 12px; font-weight: bold; width: 35%; color: #475569; border-bottom: 1px solid #f1f5f9;">Nama Pendaftar:</td>
            <td style="padding: 12px; font-weight: 600; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${data.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold; color: #475569; border-bottom: 1px solid #f1f5f9;">Email Perusahaan:</td>
            <td style="padding: 12px; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${data.email}" style="color: #2563eb; font-weight: 600; text-decoration: none;">${data.email}</a></td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 12px; font-weight: bold; color: #475569; border-bottom: 1px solid #f1f5f9;">No. WhatsApp / Telp:</td>
            <td style="padding: 12px; font-weight: 600; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${data.phone}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold; color: #475569; border-bottom: 1px solid #f1f5f9;">Nama Perusahaan:</td>
            <td style="padding: 12px; font-weight: 600; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${data.companyName}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 12px; font-weight: bold; color: #475569; border-bottom: 1px solid #f1f5f9;">Jumlah Karyawan:</td>
            <td style="padding: 12px; font-weight: 600; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${data.employeeCount} Karyawan</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold; color: #475569; border-bottom: 1px solid #f1f5f9;">Tanggal Demo Diinginkan:</td>
            <td style="padding: 12px; font-weight: 600; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${data.preferredDate || 'Segera'}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 12px; font-weight: bold; color: #475569; border-bottom: 1px solid #f1f5f9;">Catatan / Kebutuhan:</td>
            <td style="padding: 12px; color: #334155; border-bottom: 1px solid #f1f5f9;">${data.notes || 'Tidak ada catatan khusus'}</td>
          </tr>
        </table>

        <div style="background-color: #f1f5f9; padding: 14px; border-radius: 10px; font-size: 12px; color: #475569; text-align: center;">
          💡 Silakan hubungi calon klien dalam 1x24 jam kerja untuk sesi konsultasi demo.
        </div>
      </div>
    `;

    if (!transporter) {
      console.log('=== [GMAIL MOCK MODE - EMAIL SIMULATION] ===');
      console.log('Target Inbox:', notificationTarget);
      console.log('Subject:', `[Demo Request] ${data.companyName} - ${data.fullName}`);
      console.log('Payload:', data);
      return { success: true, mode: 'mock', message: 'Logged to console (GMAIL_USER / GMAIL_APP_PASSWORD not set)' };
    }

    const mailOptions = {
      from: `"BlueHR Enterprise" <${user}>`,
      to: notificationTarget,
      replyTo: data.email,
      subject: `[Demo Request] ${data.companyName} (${data.fullName}) - ${data.refCode}`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[EmailService] Email successfully delivered to Gmail SMTP:', info.messageId);
    return { success: true, mode: 'smtp', messageId: info.messageId };
  }
}
