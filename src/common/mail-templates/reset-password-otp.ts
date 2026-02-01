import { ConfigService } from '@nestjs/config';
export function resetPasswordOtpTemplate(
  otp: string,
  name?: string,
  appName = new ConfigService().get<string>('PROJECT_NAME') ?? 'Our Platform',
): string {
  const greeting = name ? `Hi ${name},` : 'Hi,';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Password Reset</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f4f4f7;font-family:Arial,Helvetica,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:40px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
              <!-- Header -->
              <tr>
                <td style="background-color:#1a1a2e;padding:30px;text-align:center;">
                  <h1 style="color:#ffffff;margin:0;font-size:24px;">${appName}</h1>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:40px 30px;">
                  <p style="color:#333333;font-size:16px;line-height:1.5;margin:0 0 20px;">
                    ${greeting}
                  </p>
                  <p style="color:#333333;font-size:16px;line-height:1.5;margin:0 0 20px;">
                    We received a request to reset your password. Use the code below to proceed:
                  </p>
                  <!-- OTP Code -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding:20px 0;">
                        <span style="display:inline-block;background-color:#f4f4f7;border:2px dashed #1a1a2e;border-radius:8px;padding:16px 32px;font-size:32px;font-weight:bold;letter-spacing:8px;color:#1a1a2e;">
                          ${otp}
                        </span>
                      </td>
                    </tr>
                  </table>
                  <p style="color:#666666;font-size:14px;line-height:1.5;margin:20px 0 0;">
                    This code will expire shortly. Do not share it with anyone.
                  </p>
                  <p style="color:#666666;font-size:14px;line-height:1.5;margin:16px 0 0;">
                    If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color:#f4f4f7;padding:20px 30px;text-align:center;">
                  <p style="color:#999999;font-size:12px;margin:0;">
                    &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
