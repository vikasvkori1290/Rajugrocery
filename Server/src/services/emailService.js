import nodemailer from 'nodemailer';

let transporter = null;
let isEthereal = false;

// Create transporter dynamically
const getTransporter = async () => {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    console.log('[Nodemailer] Using custom SMTP settings from environment variables.');
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT || '587'),
      secure: SMTP_PORT === '465',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
    isEthereal = false;
  } else {
    console.log('[Nodemailer] No SMTP environment variables found. Initializing Ethereal test account...');
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      isEthereal = true;
      console.log(`[Nodemailer] Ethereal test account registered: ${testAccount.user}`);
    } catch (err) {
      console.error('[Nodemailer] Failed to create Ethereal test account. Falling back to console-only mode.', err);
      transporter = null;
    }
  }

  return transporter;
};

export const sendOtpEmail = async (email, otp) => {
  try {
    const client = await getTransporter();

    const fromAddress = process.env.SMTP_FROM || '"Raj Groceries" <noreply@rajgroceries.com>';

    const htmlBody = `
      <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; padding: 40px 20px; color: #1f2937;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-top: 6px solid #2d5a27;">
          
          <!-- Logo & Header -->
          <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-bottom: 1px solid #e5e7eb;">
            <div style="display: inline-block; width: 40px; height: 40px; line-height: 40px; border-radius: 50%; background-color: #2d5a27; color: #ffffff; font-size: 20px; font-weight: 800; text-align: center; margin-bottom: 8px;">R</div>
            <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #2d5a27; letter-spacing: 0.5px;">Raj Groceries</h1>
          </div>

          <!-- Email Content -->
          <div style="padding: 32px 24px; text-align: center;">
            <h2 style="margin-top: 0; margin-bottom: 12px; font-size: 22px; font-weight: 700; color: #111827;">Verify Your Email</h2>
            <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.5; color: #4b5563;">
              Thank you for choosing Raj Groceries! Please use the following 6-digit verification code to complete your registration or log in securely:
            </p>

            <!-- OTP Display Badge -->
            <div style="display: inline-block; background-color: #f0fdf4; border: 2px dashed #2d5a27; border-radius: 8px; padding: 12px 24px; margin-bottom: 24px;">
              <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #2d5a27; font-family: monospace;">${otp}</span>
            </div>

            <p style="margin: 0; font-size: 13px; color: #6b7280;">
              This code will expire in <strong>10 minutes</strong>. If you did not request this, please disregard this email.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 4px 0;">&copy; ${new Date().getFullYear()} Raj Groceries. All Rights Reserved.</p>
            <p style="margin: 0;">Your Fresh Household Partner</p>
          </div>

        </div>
      </div>
    `;

    if (!client) {
      console.log(`\n[Nodemailer Fallback] Sending verification email to ${email} failed. Displaying OTP: ${otp}\n`);
      return;
    }

    const mailOptions = {
      from: fromAddress,
      to: email,
      subject: `[Raj Groceries] ${otp} is your Email Verification Code`,
      html: htmlBody,
    };

    const info = await client.sendMail(mailOptions);

    console.log(`[Nodemailer] Verification email successfully sent to: ${email}`);

    if (isEthereal) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`\n======================================================================`);
      console.log(`[Nodemailer Dev Preview] Click link below to view sent HTML verification email:`);
      console.log(`👉 ${previewUrl}`);
      console.log(`======================================================================\n`);
    }
  } catch (err) {
    console.error(`[Nodemailer Error] Failed to send OTP email to ${email}:`, err);
  }
};

export const sendOrderConfirmationEmail = async (order, user) => {
  try {
    const client = await getTransporter();
    const fromAddress = process.env.SMTP_FROM || '"Raj Groceries" <noreply@rajgroceries.com>';

    const customerEmail = user ? user.email : 'guest@example.com';
    const customerName = user ? user.name : 'Valued Customer';
    const customerPhone = user ? user.phone : 'N/A';

    // Construct order items list HTML
    const itemsHtml = order.orderItems.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px;">${item.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; text-align: center;">${item.qty}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; text-align: right;">₹${item.price.toFixed(2)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; text-align: right; font-weight: 600;">₹${(item.price * item.qty).toFixed(2)}</td>
      </tr>
    `).join('');

    const htmlBody = `
      <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; padding: 40px 20px; color: #1f2937;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-top: 6px solid #2d5a27;">
          
          <!-- Header -->
          <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-bottom: 1px solid #e5e7eb;">
            <div style="display: inline-block; width: 40px; height: 40px; line-height: 40px; border-radius: 50%; background-color: #2d5a27; color: #ffffff; font-size: 20px; font-weight: 800; text-align: center; margin-bottom: 8px;">R</div>
            <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #2d5a27;">New Order Received!</h1>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #6b7280;">Order ID: #${order._id}</p>
          </div>

          <!-- Body Content -->
          <div style="padding: 32px 24px;">
            <h2 style="margin-top: 0; margin-bottom: 16px; font-size: 18px; font-weight: 700; color: #111827;">Customer Information</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px; line-height: 1.5;">
              <tr>
                <td style="padding: 6px 0; color: #6b7280; width: 120px; font-weight: 600;">Name:</td>
                <td style="padding: 6px 0; color: #111827;">${customerName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280; font-weight: 600;">Email:</td>
                <td style="padding: 6px 0; color: #111827;">${customerEmail}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280; font-weight: 600;">Phone:</td>
                <td style="padding: 6px 0; color: #111827;">${customerPhone}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280; font-weight: 600; vertical-align: top;">Delivery Address:</td>
                <td style="padding: 6px 0; color: #111827;">
                  ${order.shippingAddress.address}, ${order.shippingAddress.city},<br/>
                  Postal Code: ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}
                </td>
              </tr>
            </table>

            <h2 style="margin-bottom: 16px; font-size: 18px; font-weight: 700; color: #111827;">Order Items</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <thead>
                <tr style="background-color: #f9fafb;">
                  <th style="padding: 10px; text-align: left; font-size: 12px; font-weight: 700; color: #4b5563; border-bottom: 2px solid #e5e7eb;">Product</th>
                  <th style="padding: 10px; text-align: center; font-size: 12px; font-weight: 700; color: #4b5563; border-bottom: 2px solid #e5e7eb;">Qty</th>
                  <th style="padding: 10px; text-align: right; font-size: 12px; font-weight: 700; color: #4b5563; border-bottom: 2px solid #e5e7eb;">Unit Price</th>
                  <th style="padding: 10px; text-align: right; font-size: 12px; font-weight: 700; color: #4b5563; border-bottom: 2px solid #e5e7eb;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <!-- Pricing breakdown -->
            <div style="border-top: 2px solid #e5e7eb; padding-top: 16px; margin-bottom: 24px;">
              <table style="width: 100%; font-size: 14px; line-height: 1.6;">
                <tr>
                  <td style="color: #6b7280;">Items Subtotal:</td>
                  <td style="text-align: right; color: #111827; font-weight: 600;">₹${order.itemsPrice.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280;">Delivery & Service Charges:</td>
                  <td style="text-align: right; color: #111827; font-weight: 600;">₹${order.shippingPrice.toFixed(2)}</td>
                </tr>
                <tr style="font-size: 16px; font-weight: 700;">
                  <td style="color: #2d5a27; padding-top: 8px;">Grand Total:</td>
                  <td style="text-align: right; color: #2d5a27; padding-top: 8px;">₹${order.totalPrice.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; font-size: 12px;">Payment Method:</td>
                  <td style="text-align: right; color: #111827; font-size: 12px; font-weight: 600;">${order.paymentMethod}</td>
                </tr>
              </table>
            </div>

            <p style="margin: 0; font-size: 13px; color: #4b5563; line-height: 1.5; text-align: center;">
              This notification was generated automatically because a purchase was completed at Raj Groceries.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0;">Raj Groceries - Your Fresh Household Partner</p>
          </div>

        </div>
      </div>
    `;

    if (!client) {
      console.log(`\n[Nodemailer Fallback] Failed to send order confirmation email. Displaying Order:\n`, JSON.stringify(order, null, 2));
      return;
    }

    const mailOptions = {
      from: fromAddress,
      to: 'vishalbawge12@gmail.com',
      cc: customerEmail !== 'guest@example.com' ? customerEmail : undefined,
      subject: `[Raj Groceries] Order Confirmation #${order._id} - ₹${order.totalPrice.toFixed(2)}`,
      html: htmlBody,
    };

    const info = await client.sendMail(mailOptions);
    console.log(`[Nodemailer] Order confirmation email successfully sent to vishalbawge12@gmail.com`);

    if (isEthereal) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`\n======================================================================`);
      console.log(`[Nodemailer Dev Preview] Click link below to view sent Order Confirmation email:`);
      console.log(`👉 ${previewUrl}`);
      console.log(`======================================================================\n`);
    }
  } catch (err) {
    console.error('[Nodemailer Error] Failed to send order confirmation email:', err);
  }
};
