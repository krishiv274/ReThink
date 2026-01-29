import { Request, Response } from "express";
import crypto from "crypto";
import User from "../models/User";
import { sendEmail } from "../services/emailService";

/**
 * Generate a cryptographically secure reset token
 * Returns both the raw token (for email) and hashed token (for storage)
 */
const generateResetToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  return { rawToken, hashedToken };
};

/**
 * Hash a token for comparison
 */
const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

/**
 * POST /auth/forgot-password
 * Generates reset token and sends email
 * Always returns success to prevent email enumeration
 */
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    // Always respond with success to prevent email enumeration
    const successMessage = "If an account exists with this email, a password reset link has been sent";

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // If no user found or user signed up with Google, still return success
    if (!user) {
      res.status(200).json({ message: successMessage });
      return;
    }

    // Check if user signed up with Google (no password to reset)
    if (user.authProvider === "google" && !user.password) {
      res.status(200).json({ message: successMessage });
      return;
    }

    // Generate token
    const { rawToken, hashedToken } = generateResetToken();

    // Store hashed token and expiry (15 minutes)
    user.resetToken = hashedToken;
    user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    // Create reset URL
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetUrl = `${frontendUrl}/reset/${rawToken}`;

    // Send email
    const emailHtml = getPasswordResetTemplate(resetUrl);
    
    try {
      await sendEmail({
        to: user.email,
        subject: "Reset Your ReTh!nk Password",
        html: emailHtml,
      });
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      // Clear the token if email fails
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();
      res.status(500).json({ message: "Failed to send reset email. Please try again." });
      return;
    }

    res.status(200).json({ message: successMessage });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
};

/**
 * POST /auth/reset-password/:token
 * Validates token and resets password
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token) {
      res.status(400).json({ message: "Reset token is required" });
      return;
    }

    if (!newPassword) {
      res.status(400).json({ message: "New password is required" });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ message: "Password must be at least 6 characters long" });
      return;
    }

    // Hash the provided token
    const hashedToken = hashToken(token);

    // Find user with matching hash and non-expired token
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ message: "Invalid or expired reset token" });
      return;
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    
    // Invalidate the token (single-use)
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    
    await user.save();

    res.status(200).json({ message: "Password reset successful. You can now log in with your new password." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
};

/**
 * Generate HTML email template for password reset
 */
const getPasswordResetTemplate = (resetUrl: string): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8faf8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, #22c55e 0%, #10b981 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
        <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">ReTh!nk</h1>
        <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Sustainable Living Made Simple</p>
      </td>
    </tr>
    <tr>
      <td style="background: white; padding: 40px 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <h2 style="margin: 0 0 16px; color: #1f2937; font-size: 24px; font-weight: 600;">Reset Your Password</h2>
        <p style="margin: 0 0 24px; color: #6b7280; font-size: 16px; line-height: 1.6;">
          We received a request to reset your password. Click the button below to create a new password:
        </p>
        <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #10b981 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(34,197,94,0.4);">
          Reset Password
        </a>
        <div style="margin-top: 32px; padding: 16px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 500;">
            ⚠️ This link expires in 15 minutes
          </p>
          <p style="margin: 8px 0 0; color: #92400e; font-size: 13px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
        <p style="margin: 32px 0 0; color: #9ca3af; font-size: 13px;">
          If the button doesn't work, copy and paste this link:<br>
          <a href="${resetUrl}" style="color: #22c55e; word-break: break-all;">${resetUrl}</a>
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px; text-align: center;">
        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
          © ${new Date().getFullYear()} ReTh!nk. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};
