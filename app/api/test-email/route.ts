import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ── GET /api/test-email ─────────────────────────────
// Tests Gmail email sending
// Visit: http://localhost:3000/api/test-email
//

export async function GET(req: NextRequest) {
  const gmailUser = "kay.candlesin@gmail.com";
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailPass) {
    return NextResponse.json(
      {
        success: false,
        error: "GMAIL_APP_PASSWORD is not set",
        fix: "Add GMAIL_APP_PASSWORD in .env.local and Vercel environment variables",
      },
      { status: 500 },
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const info = await transporter.sendMail({
      from: `Kay Candles <${gmailUser}>`,
      to: "naveenudai26@gmail.com",
      subject: "✅ Test Email — Kay Candles",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;
        padding:32px;background:#fff5f7;border-radius:16px;border:1px solid #fce7ed;">
        
          <h2 style="color:#c9828a;font-family:Georgia,serif;">
          🕯 Kay Candles Email Test
          </h2>

          <p style="font-size:15px;color:#5a3a43;">
          Your Gmail email system is working correctly.
          </p>

          <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:14px;border-radius:10px;">
          <p style="margin:0;color:#166534;font-size:14px;">
          ✅ Email successfully sent using Gmail + Nodemailer
          </p>
          </div>

          <hr style="margin:20px 0;border:none;border-top:1px solid #fce7ed"/>

          <p style="font-size:12px;color:#a0687a;">
          Sent from: <strong>${gmailUser}</strong>
          </p>

        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      email: gmailUser,
      id: info?.messageId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: String(error),
        tip: "Check if GMAIL_APP_PASSWORD is correct and Gmail 2FA is enabled.",
      },
      { status: 500 },
    );
  }
}
