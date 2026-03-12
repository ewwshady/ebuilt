// Email service using Resend API
// Requires RESEND_API_KEY in .env.local

interface EmailOptions {
  to: string
  subject: string
  text: string
  html: string
}

async function sendEmailViaResend(options: EmailOptions): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.error("[Email Service] RESEND_API_KEY is not configured")
    throw new Error("Email service is not configured")
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("[Email Service Error]", data)
      throw new Error(data.message || "Failed to send email via Resend")
    }

    console.log("[Email Service]", {
      to: options.to,
      subject: options.subject,
      messageId: data.id,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Email Service Error]", error)
    throw new Error("Failed to send email")
  }
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  // Use Resend API
  await sendEmailViaResend(options)
}

export async function sendOTPEmail(email: string, otp: string, purpose: "email_verification" | "password_reset"): Promise<void> {
  const subject = purpose === "email_verification" ? "Verify Your Email - eBuilt" : "Reset Your Password - eBuilt"
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">eBuilt</h1>
      </div>
      <div style="padding: 40px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">
          ${purpose === "email_verification" ? "Verify Your Email Address" : "Reset Your Password"}
        </h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          ${purpose === "email_verification" 
            ? "Thank you for signing up! Please use the code below to verify your email address." 
            : "We received a request to reset your password. Use the code below to proceed."}
        </p>
        <div style="background: white; padding: 30px; border-radius: 8px; text-align: center; margin: 30px 0; border: 2px solid #667eea;">
          <p style="margin: 0; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 2px;">Your verification code</p>
          <p style="margin: 15px 0 0 0; font-size: 48px; font-weight: bold; color: #667eea; letter-spacing: 8px;">${otp}</p>
        </div>
        <p style="color: #666; font-size: 14px;">
          This code will expire in 10 minutes. If you didn't request this, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} eBuilt. All rights reserved.
        </p>
      </div>
    </div>
  `

  await sendEmail({
    to: email,
    subject,
    text: `Your OTP is: ${otp}. This code will expire in 10 minutes.`,
    html,
  })
}

export async function sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">eBuilt</h1>
      </div>
      <div style="padding: 40px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          We received a request to reset your password. Click the button below to create a new password.
        </p>
        <a href="${resetLink}" style="display: inline-block; margin: 30px 0; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Reset Password
        </a>
        <p style="color: #666; font-size: 14px;">
          If the button above doesn't work, copy and paste this link into your browser:<br/>
          <code style="background: #f0f0f0; padding: 5px 10px; border-radius: 3px;">${resetLink}</code>
        </p>
        <p style="color: #666; font-size: 14px;">
          This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} eBuilt. All rights reserved.
        </p>
      </div>
    </div>
  `

  await sendEmail({
    to: email,
    subject: "Reset Your Password - eBuilt",
    text: `Click this link to reset your password: ${resetLink}`,
    html,
  })
}

export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">eBuilt</h1>
      </div>
      <div style="padding: 40px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Welcome to eBuilt, ${name || "Friend"}!</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          We're thrilled to have you on board. Your account has been successfully created and verified.
        </p>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          You can now start exploring and enjoying all the features eBuilt has to offer.
        </p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} eBuilt. All rights reserved.
        </p>
      </div>
    </div>
  `

  await sendEmail({
    to: email,
    subject: "Welcome to eBuilt!",
    text: `Welcome to eBuilt, ${name || "Friend"}!`,
    html,
  })
}
