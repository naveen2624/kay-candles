import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// ─── Gmail transporter ─────────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "kay.candlesin@gmail.com",
      pass: process.env.GMAIL_APP_PASSWORD, // 16-char app password, no spaces
    },
  });
}

// ─── Email HTML builder ────────────────────────────────────────────
function buildOrderEmailHtml(order: {
  order_number: string;
  customer_name: string;
  items: Array<{
    name: string;
    variant_name?: string;
    fragrance_name?: string;
    price: number;
    quantity: number;
    image_url: string;
  }>;
  subtotal: number;
  delivery_fee: number;
  discount_amt: number;
  coupon_code?: string;
  total: number;
  payment_method: string;
  address: string;
  customer_email?: string | null;
  customer_phone?: string;
}): string {
  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:14px 16px;border-bottom:1px solid #fce7ed;vertical-align:top;">
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="width:64px;vertical-align:top;padding-right:14px;">
                <img
                  src="${item.image_url}"
                  alt="${item.name}"
                  width="56" height="56"
                  style="border-radius:10px;object-fit:cover;display:block;width:56px;height:56px;"
                />
              </td>
              <td style="vertical-align:top;">
                <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;font-weight:600;color:#2d1f26;">
                  ${item.name}
                </p>
                ${
                  item.variant_name
                    ? `<p style="margin:3px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#c9828a;">Variant: ${item.variant_name}</p>`
                    : ""
                }
                ${
                  item.fragrance_name
                    ? `<p style="margin:3px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#c9828a;">Fragrance: ${item.fragrance_name}</p>`
                    : ""
                }
                <p style="margin:4px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#a0687a;">
                  Qty: ${item.quantity}
                </p>
              </td>
              <td style="text-align:right;vertical-align:top;white-space:nowrap;">
                <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;font-weight:700;color:#c9828a;">
                  &#8377;${item.price * item.quantity}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>`,
    )
    .join("");

  const discountRow =
    order.discount_amt > 0
      ? `<tr>
          <td style="padding:10px 16px;border-bottom:1px solid #fce7ed;">
            <table width="100%"><tr>
              <td style="font-family:Arial,sans-serif;font-size:13px;color:#16a34a;">
                Coupon (${order.coupon_code ?? ""})
              </td>
              <td style="text-align:right;font-family:Arial,sans-serif;font-size:13px;color:#16a34a;font-weight:600;">
                -&#8377;${order.discount_amt}
              </td>
            </tr></table>
          </td>
        </tr>`
      : "";

  const contactRow =
    order.customer_email || order.customer_phone
      ? `<table width="100%" cellpadding="0" cellspacing="0"
            style="background:#fdf4ff;border:1px solid #e9d5ff;border-radius:12px;margin-bottom:24px;">
            <tr>
              <td style="padding:14px 16px;">
                <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;
                          color:#7e22ce;text-transform:uppercase;letter-spacing:2px;">
                  Customer Contact
                </p>
                ${order.customer_phone ? `<p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:13px;color:#5a3a43;">&#128222; ${order.customer_phone}</p>` : ""}
                ${order.customer_email ? `<p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#5a3a43;">&#9993; ${order.customer_email}</p>` : ""}
              </td>
            </tr>
          </table>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>Order Confirmed</title>
</head>
<body style="margin:0;padding:0;background:#fff5f7;">
<table width="100%" cellpadding="0" cellspacing="0"
  style="background:#fff5f7;padding:32px 16px;font-family:Arial,sans-serif;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
        style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;
               overflow:hidden;border:1px solid #fce7ed;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#ffa0b4 0%,#ff6b8a 100%);
                     padding:40px 32px;text-align:center;">
            <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:11px;
                      color:rgba(255,255,255,0.8);letter-spacing:3px;text-transform:uppercase;">
              Kay Candles and Craft
            </p>
            <h1 style="margin:0;font-family:Georgia,serif;font-size:30px;
                       font-weight:400;color:#ffffff;line-height:1.25;">
              Order Confirmed! &#x1F56F;
            </h1>
            <p style="margin:10px 0 0;font-family:Arial,sans-serif;font-size:14px;
                      color:rgba(255,255,255,0.88);">
              Thank you, <strong>${order.customer_name}</strong>!
            </p>
          </td>
        </tr>

        <!-- Order number -->
        <tr>
          <td style="background:#fce7ed;padding:16px 32px;text-align:center;
                     border-bottom:1px solid #ffc9d5;">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#a0687a;
                      text-transform:uppercase;letter-spacing:2px;">Your Order Number</p>
            <p style="margin:6px 0 0;font-family:Georgia,serif;font-size:22px;
                      font-weight:700;color:#c9828a;letter-spacing:1px;">
              ${order.order_number}
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">

            <p style="margin:0 0 28px;font-family:Arial,sans-serif;font-size:15px;
                      color:#5a3a43;line-height:1.7;">
              Hi <strong>${order.customer_name}</strong> &#x1F44B;<br/>
              We&#39;ve received your order and we&#39;re so excited to get it ready for you!
              Your handmade goodies will be dispatched within
              <strong>2&#8211;3 business days</strong>.
            </p>

            <!-- Items -->
            <table width="100%" cellpadding="0" cellspacing="0"
              style="border:1px solid #fce7ed;border-radius:12px;overflow:hidden;margin-bottom:24px;">
              <tr>
                <td style="background:#fce7ed;padding:12px 16px;">
                  <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;font-weight:700;
                            color:#a0687a;text-transform:uppercase;letter-spacing:2px;">
                    Your Items
                  </p>
                </td>
              </tr>
              ${itemRows}
            </table>

            <!-- Price summary -->
            <table width="100%" cellpadding="0" cellspacing="0"
              style="border:1px solid #fce7ed;border-radius:12px;overflow:hidden;margin-bottom:24px;">
              <tr>
                <td style="background:#fce7ed;padding:12px 16px;">
                  <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;font-weight:700;
                            color:#a0687a;text-transform:uppercase;letter-spacing:2px;">
                    Order Summary
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 16px;border-bottom:1px solid #fce7ed;">
                  <table width="100%"><tr>
                    <td style="font-family:Arial,sans-serif;font-size:13px;color:#a0687a;">Subtotal</td>
                    <td style="text-align:right;font-family:Arial,sans-serif;font-size:13px;color:#5a3a43;">
                      &#8377;${order.subtotal}
                    </td>
                  </tr></table>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 16px;border-bottom:1px solid #fce7ed;">
                  <table width="100%"><tr>
                    <td style="font-family:Arial,sans-serif;font-size:13px;color:#a0687a;">Delivery</td>
                    <td style="text-align:right;font-family:Arial,sans-serif;font-size:13px;color:#5a3a43;">
                      ${order.delivery_fee === 0 ? "FREE &#x1F389;" : `&#8377;${order.delivery_fee}`}
                    </td>
                  </tr></table>
                </td>
              </tr>
              ${discountRow}
              <tr>
                <td style="padding:14px 16px;background:#fff5f7;">
                  <table width="100%"><tr>
                    <td style="font-family:Georgia,serif;font-size:16px;font-weight:700;color:#5a3a43;">
                      Total
                    </td>
                    <td style="text-align:right;font-family:Georgia,serif;font-size:22px;
                               font-weight:700;color:#c9828a;">
                      &#8377;${order.total}
                    </td>
                  </tr></table>
                </td>
              </tr>
            </table>

            <!-- Address -->
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#fff5f7;border:1px solid #fce7ed;border-radius:12px;margin-bottom:24px;">
              <tr>
                <td style="padding:14px 16px;">
                  <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;
                            color:#a0687a;text-transform:uppercase;letter-spacing:2px;">
                    Delivering To
                  </p>
                  <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;
                            color:#5a3a43;line-height:1.6;">
                    ${order.address.replace(/\n/g, "<br/>")}
                  </p>
                </td>
              </tr>
            </table>

            <!-- Customer contact (shown in owner copy) -->
            ${contactRow}

            <!-- What happens next -->
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;margin-bottom:28px;">
              <tr>
                <td style="padding:16px;">
                  <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:12px;
                            font-weight:700;color:#16a34a;">
                    What happens next?
                  </p>
                  <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;
                            color:#166534;line-height:1.7;">
                    We&#39;ll pack your order with love and dispatch it within 2&#8211;3 business days.
                    Keep your order number handy: <strong>${order.order_number}</strong>
                  </p>
                </td>
              </tr>
            </table>

            <!-- Track order button -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td align="center">
                  <a href="https://kaycandles.in/orders"
                    style="display:inline-block;padding:14px 32px;
                           background:linear-gradient(135deg,#ffa0b4,#ff6b8a);
                           color:#ffffff;font-family:Arial,sans-serif;font-size:14px;
                           font-weight:700;text-decoration:none;border-radius:50px;">
                    Track Your Order
                  </a>
                </td>
              </tr>
            </table>

            <!-- Contact -->
            <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;
                      color:#a0687a;text-align:center;line-height:1.8;">
              Questions? WhatsApp us at
              <a href="https://wa.me/919787174450"
                style="color:#c9828a;font-weight:700;text-decoration:none;">+91 97871 74450</a><br/>
              Instagram:
              <a href="https://instagram.com/kay.candles.in"
                style="color:#c9828a;font-weight:700;text-decoration:none;">@kay.candles.in</a>
            </p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#fce7ed;padding:18px 32px;text-align:center;
                     border-top:1px solid #ffc9d5;">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#a0687a;">
              Made with &#10084;&#65039; by Preethi &amp; Naveen &middot; Kay Candles and Craft
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

// ─── POST /api/orders ──────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer_name,
      phone,
      email,
      address,
      items,
      subtotal,
      delivery_fee,
      discount_amt = 0,
      coupon_code,
      total,
      payment_method = "COD",
      payment_id,
      razorpay_order_id,
    } = body;

    if (!customer_name || !phone || !address || !items?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // ── 1. Save order to Supabase ──────────────────────────────────
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          customer_name,
          phone,
          email: email || null,
          address,
          items,
          subtotal,
          delivery_fee,
          discount_amt,
          coupon_code: coupon_code || null,
          total,
          payment_method,
          payment_id: payment_id || null,
          razorpay_order_id: razorpay_order_id || null,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    // ── 2. Increment coupon usage ──────────────────────────────────
    if (coupon_code) {
      try {
        await supabase.rpc("increment_coupon_uses", { p_code: coupon_code });
      } catch (e) {
        console.error("Coupon increment failed:", e);
      }
    }

    // ── 3. Send emails via Gmail + nodemailer ──────────────────────
    const appPassword = process.env.GMAIL_APP_PASSWORD;
    const ownerEmail = "kay.candlesin@gmail.com";

    if (!appPassword) {
      console.error(
        "❌ GMAIL_APP_PASSWORD is not set in environment variables.",
      );
    } else {
      try {
        const transporter = createTransporter();

        const emailHtml = buildOrderEmailHtml({
          order_number: data.order_number,
          customer_name,
          items,
          subtotal,
          delivery_fee,
          discount_amt,
          coupon_code,
          total,
          payment_method,
          address,
          customer_email: email || null,
          customer_phone: phone,
        });

        // ── Always: notify the shop owner ─────────────────────────
        await transporter.sendMail({
          from: `"Kay Candles and Craft" <${ownerEmail}>`,
          to: ownerEmail,
          subject: `🛍️ New Order ${data.order_number} from ${customer_name}`,
          html: emailHtml,
        });
        console.log("✅ Owner notification sent.");

        // ── Also: send confirmation to customer if they gave email ─
        if (email) {
          await transporter.sendMail({
            from: `"Kay Candles and Craft" <${ownerEmail}>`,
            to: email,
            replyTo: ownerEmail,
            subject: `Order Confirmed! 🕯️ ${data.order_number} — Kay Candles and Craft`,
            html: emailHtml,
          });
          console.log(`✅ Customer confirmation sent to ${email}.`);
        }
      } catch (emailErr) {
        // Email failure is non-fatal — order is already saved
        console.error("❌ Email send failed:", emailErr);
      }
    }

    return NextResponse.json({ success: true, order: data });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 },
    );
  }
}
