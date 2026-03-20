import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

const OWNER_EMAIL = "kay.candlesin@gmail.com";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://kay-candles.vercel.app";

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: OWNER_EMAIL, pass: process.env.GMAIL_APP_PASSWORD },
  });
}

// ── Shared email wrapper ───────────────────────────────────────────
function emailWrapper(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Kay Candles and Craft</title>
</head>
<body style="margin:0;padding:0;background:#fff5f7;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#fff5f7;padding:32px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0"
      style="max-width:600px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #fce7ed;box-shadow:0 8px 40px rgba(255,107,138,0.08);">
      <!-- Logo bar -->
      <tr><td style="background:linear-gradient(135deg,#ffa0b4 0%,#ff6b8a 100%);padding:18px 32px;text-align:center;">
        <img src="https://xcqewrligvirqwcebcyc.supabase.co/storage/v1/object/public/kaycandlesproducts/logo.png" alt="Kay Candles and Craft" height="60"
          style="height:60px;width:auto;display:inline-block;" />
      </td></tr>
      ${content}
      <!-- Footer -->
      <tr><td style="background:#fce7ed;padding:20px 32px;text-align:center;border-top:1px solid #ffc9d5;">
        <img src="https://xcqewrligvirqwcebcyc.supabase.co/storage/v1/object/public/kaycandlesproducts/logo.png" alt="Kay Candles and Craft" height="36"
          style="height:36px;width:auto;display:inline-block;margin-bottom:10px;opacity:0.85;" />
        <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:12px;color:#a0687a;line-height:1.6;">
          Questions? WhatsApp: <a href="https://wa.me/919787174450" style="color:#ff6b8a;font-weight:700;text-decoration:none;">+91 97871 74450</a>
          &nbsp;·&nbsp;
          <a href="https://instagram.com/kay.candles.in" style="color:#ff6b8a;font-weight:700;text-decoration:none;">@kay.candles.in</a>
        </p>
        <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#c9a0aa;">Made with ❤️ by Preethi · Kay Candles and Craft</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// ── Item rows shared helper ────────────────────────────────────────
function buildItemRows(
  items: Array<{
    name: string;
    variant_name?: string;
    fragrance_name?: string;
    price: number;
    quantity: number;
    image_url: string;
  }>,
) {
  return items
    .map((item) => {
      const sub = [
        item.variant_name,
        item.fragrance_name ? `${item.fragrance_name} fragrance` : null,
      ]
        .filter(Boolean)
        .join(" · ");
      return `
      <tr>
        <td style="padding:14px 20px;border-bottom:1px solid #fce7ed;vertical-align:top;">
          <table cellpadding="0" cellspacing="0" width="100%"><tr>
            <td style="width:60px;padding-right:14px;vertical-align:top;">
              <img src="${item.image_url}" width="52" height="52"
                style="border-radius:12px;object-fit:cover;display:block;width:52px;height:52px;border:1px solid #fce7ed;" />
            </td>
            <td style="vertical-align:top;">
              <p style="margin:0;font-size:14px;font-weight:700;color:#2d1f26;line-height:1.3;">${item.name}</p>
              ${sub ? `<p style="margin:3px 0 0;font-size:12px;color:#c9828a;font-weight:500;">${sub}</p>` : ""}
              <p style="margin:4px 0 0;font-size:11px;color:#9ca3af;">Qty: ${item.quantity}</p>
            </td>
            <td style="text-align:right;vertical-align:top;white-space:nowrap;padding-left:10px;">
              <p style="margin:0;font-size:15px;font-weight:700;color:#c9828a;">&#8377;${item.price * item.quantity}</p>
            </td>
          </tr></table>
        </td>
      </tr>`;
    })
    .join("");
}

// ─────────────────────────────────────────────────────────────────
// EMAIL 1: Shipment booked — to customer
// ─────────────────────────────────────────────────────────────────
function buildShipmentEmail(order: {
  order_number: string;
  customer_name: string;
  courier_name: string;
  awb_number: string;
  tracking_url?: string;
  items: Array<{
    name: string;
    variant_name?: string;
    fragrance_name?: string;
    price: number;
    quantity: number;
    image_url: string;
  }>;
  total: number;
  address: string;
}): string {
  const trackBtn = order.tracking_url
    ? `<tr><td align="center" style="padding:0 0 28px;">
        <a href="${order.tracking_url}"
          style="display:inline-block;padding:15px 40px;background:linear-gradient(135deg,#ffa0b4 0%,#ff6b8a 100%);
                 color:#fff;font-size:15px;font-weight:700;text-decoration:none;border-radius:50px;
                 box-shadow:0 6px 20px rgba(255,107,138,0.35);">
          &#128230;&nbsp; Track My Package
        </a>
      </td></tr>`
    : "";

  const content = `
    <!-- Pink gradient header -->
    <tr><td style="background:linear-gradient(135deg,#ffa0b4 0%,#ff6b8a 100%);padding:40px 32px;text-align:center;">
      <div style="font-size:44px;margin-bottom:8px;">&#128666;</div>
      <p style="margin:0 0 8px;font-size:11px;color:rgba(255,255,255,0.7);letter-spacing:3px;text-transform:uppercase;">✦ Handmade with Love ✦</p>
      <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:400;color:#fff;line-height:1.3;">
        Your Order is on its Way!
      </h1>
      <p style="margin:10px 0 0;font-size:14px;color:rgba(255,255,255,0.9);">
        Great news, <strong>${order.customer_name}</strong>! 🎉
      </p>
    </td></tr>

    <!-- Shipment info bar -->
    <tr><td style="background:#fdf2f8;padding:0;border-bottom:1px solid #fce7ed;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:20px 16px;text-align:center;border-right:1px solid #fce7ed;">
            <p style="margin:0 0 4px;font-size:9px;font-weight:700;color:#b0789a;text-transform:uppercase;letter-spacing:2px;">Courier</p>
            <p style="margin:0;font-size:17px;font-weight:700;color:#c9828a;">${order.courier_name}</p>
          </td>
          <td style="padding:20px 16px;text-align:center;border-right:1px solid #fce7ed;">
            <p style="margin:0 0 4px;font-size:9px;font-weight:700;color:#b0789a;text-transform:uppercase;letter-spacing:2px;">AWB / Tracking ID</p>
            <p style="margin:0;font-size:17px;font-weight:700;color:#4f46e5;font-family:'Courier New',monospace;letter-spacing:2px;">${order.awb_number}</p>
          </td>
          <td style="padding:20px 16px;text-align:center;">
            <p style="margin:0 0 4px;font-size:9px;font-weight:700;color:#b0789a;text-transform:uppercase;letter-spacing:2px;">Order No.</p>
            <p style="margin:0;font-size:14px;font-weight:700;color:#c9828a;">${order.order_number}</p>
          </td>
        </tr>
      </table>
    </td></tr>

    <!-- AWB highlight box -->
    <tr><td style="padding:28px 32px 0;">
      <div style="background:linear-gradient(135deg,#eef2ff,#e0e7ff);border:1.5px solid #c7d2fe;border-radius:16px;padding:18px 20px;margin-bottom:24px;">
        <table width="100%"><tr>
          <td>
            <p style="margin:0 0 3px;font-size:9px;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:2px;">Your Tracking Number</p>
            <p style="margin:0;font-size:22px;font-weight:700;color:#4338ca;font-family:'Courier New',monospace;letter-spacing:4px;">${order.awb_number}</p>
            ${
              order.tracking_url
                ? `<p style="margin:6px 0 0;font-size:11px;color:#818cf8;">
                   <a href="${order.tracking_url}" style="color:#6366f1;font-weight:600;text-decoration:none;">
                     &#128279; ${order.tracking_url}
                   </a>
                 </p>`
                : `<p style="margin:6px 0 0;font-size:11px;color:#818cf8;">Use this number on <strong>${order.courier_name}</strong>'s website to track your package.</p>`
            }
          </td>
          <td style="text-align:right;padding-left:16px;white-space:nowrap;">
            <span style="font-size:32px;">&#128230;</span>
          </td>
        </tr></table>
      </div>
    </td></tr>

    <!-- Track button -->
    <tr><td style="padding:0 32px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0">${trackBtn}
        <tr><td align="center">
          <a href="${SITE_URL}/orders"
            style="display:inline-block;padding:12px 30px;border:2px solid #ff6b8a;color:#ff6b8a;
                   font-size:13px;font-weight:700;text-decoration:none;border-radius:50px;">
            View Order Status &#8594;
          </a>
        </td></tr>
      </table>
    </td></tr>

    <!-- Intro text -->
    <tr><td style="padding:0 32px 20px;">
      <p style="margin:0;font-size:14px;color:#5a3a43;line-height:1.8;">
        Your handmade goodies have been packed with love and handed over to <strong>${order.courier_name}</strong>.
        Estimated delivery: <strong>3–5 business days</strong>. 🕯️
      </p>
    </td></tr>

    <!-- Items -->
    <tr><td style="padding:0 32px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0"
        style="border:1.5px solid #fce7ed;border-radius:16px;overflow:hidden;">
        <tr><td style="background:#fce7ed;padding:12px 20px;">
          <p style="margin:0;font-size:10px;font-weight:700;color:#a0687a;text-transform:uppercase;letter-spacing:2px;">Items in this Shipment</p>
        </td></tr>
        ${buildItemRows(order.items)}
      </table>
    </td></tr>

    <!-- Delivery address -->
    <tr><td style="padding:0 32px 28px;">
      <div style="background:#fff5f7;border:1.5px solid #fce7ed;border-radius:16px;padding:16px 20px;">
        <p style="margin:0 0 6px;font-size:9px;font-weight:700;color:#a0687a;text-transform:uppercase;letter-spacing:2px;">Delivering To</p>
        <p style="margin:0;font-size:13px;color:#5a3a43;line-height:1.7;">${order.address.replace(/\n/g, "<br/>")}</p>
      </div>
    </td></tr>`;

  return emailWrapper(content);
}

// ─────────────────────────────────────────────────────────────────
// EMAIL 2: Delivered — thank you + review request
// ─────────────────────────────────────────────────────────────────
function buildDeliveredEmail(order: {
  order_number: string;
  customer_name: string;
  items: Array<{
    name: string;
    product_id: string;
    variant_name?: string;
    fragrance_name?: string;
    image_url: string;
  }>;
}): string {
  // Deduplicate products (multiple qty of same product = one review link)
  const seen = new Set<string>();
  const uniqueItems = order.items.filter((item) => {
    if (seen.has(item.product_id)) return false;
    seen.add(item.product_id);
    return true;
  });

  const reviewCards = uniqueItems
    .map((item) => {
      const reviewUrl = `${SITE_URL}/product/${item.product_id}#reviews`;
      const sub = [item.variant_name, item.fragrance_name]
        .filter(Boolean)
        .join(" · ");
      return `
      <tr>
        <td style="padding:14px 20px;border-bottom:1px solid #fce7ed;">
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="width:56px;padding-right:14px;vertical-align:middle;">
                <img src="${item.image_url}" width="48" height="48"
                  style="border-radius:12px;object-fit:cover;display:block;width:48px;height:48px;border:1px solid #fce7ed;" />
              </td>
              <td style="vertical-align:middle;">
                <p style="margin:0;font-size:13px;font-weight:700;color:#2d1f26;line-height:1.3;">${item.name}</p>
                ${sub ? `<p style="margin:2px 0 0;font-size:11px;color:#c9828a;">${sub}</p>` : ""}
              </td>
              <td style="text-align:right;vertical-align:middle;padding-left:12px;">
                <a href="${reviewUrl}"
                  style="display:inline-block;padding:8px 18px;background:#fff5f7;border:1.5px solid #ffc9d5;
                         color:#ff6b8a;font-size:12px;font-weight:700;text-decoration:none;border-radius:50px;
                         white-space:nowrap;">
                  &#11088; Write Review
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
    })
    .join("");

  // Star rating visual
  const stars = "&#11088;&#11088;&#11088;&#11088;&#11088;";

  const content = `
    <!-- Header -->
    <tr><td style="background:linear-gradient(135deg,#a78bfa 0%,#ec4899 100%);padding:44px 32px;text-align:center;">
      <div style="font-size:52px;margin-bottom:10px;">&#127873;</div>
      <p style="margin:0 0 8px;font-size:11px;color:rgba(255,255,255,0.7);letter-spacing:3px;text-transform:uppercase;">✦ Handmade with Love ✦</p>
      <h1 style="margin:0;font-family:Georgia,serif;font-size:30px;font-weight:400;color:#fff;line-height:1.3;">
        Your Order Arrived!
      </h1>
      <p style="margin:10px 0 0;font-size:14px;color:rgba(255,255,255,0.9);">
        We hope you love it, <strong>${order.customer_name}</strong> ✨
      </p>
    </td></tr>

    <!-- Thank you message -->
    <tr><td style="padding:32px 32px 24px;">
      <p style="margin:0 0 16px;font-size:15px;color:#5a3a43;line-height:1.8;text-align:center;">
        Thank you so much for your order <strong>${order.order_number}</strong>!
        Every piece was handcrafted with love by Preethi just for you. 🕯️🌸
      </p>
      <!-- Stars -->
      <div style="text-align:center;margin-bottom:24px;">
        <div style="display:inline-block;background:linear-gradient(135deg,#fff7ed,#fef3c7);
                    border:1.5px solid #fde68a;border-radius:50px;padding:12px 28px;">
          <p style="margin:0;font-size:10px;font-weight:700;color:#d97706;letter-spacing:2px;text-transform:uppercase;">How did we do?</p>
          <p style="margin:4px 0 0;font-size:24px;line-height:1;">${stars}</p>
        </div>
      </div>
      <p style="margin:0;font-size:14px;color:#5a3a43;line-height:1.8;text-align:center;">
        Your review means the world to us! It helps other customers discover our handmade products
        and helps us grow. It takes less than 30 seconds. ❤️
      </p>
    </td></tr>

    <!-- Review cards -->
    <tr><td style="padding:0 32px 28px;">
      <table width="100%" cellpadding="0" cellspacing="0"
        style="border:1.5px solid #fce7ed;border-radius:16px;overflow:hidden;">
        <tr><td style="background:linear-gradient(135deg,#fce7ed,#fdf2f8);padding:14px 20px;">
          <p style="margin:0;font-size:10px;font-weight:700;color:#a0687a;text-transform:uppercase;letter-spacing:2px;">
            &#11088; Leave a Review for Your Items
          </p>
        </td></tr>
        ${reviewCards}
      </table>
    </td></tr>

    <!-- Share on Instagram CTA -->
    <tr><td style="padding:0 32px 28px;">
      <div style="background:linear-gradient(135deg,#fdf4ff,#fce7f3);border:1.5px solid #f0abfc;border-radius:16px;padding:20px 24px;text-align:center;">
        <p style="margin:0 0 4px;font-size:20px;">&#128247;</p>
        <p style="margin:0 0 6px;font-family:Georgia,serif;font-size:17px;color:#a855f7;">Share the love!</p>
        <p style="margin:0 0 14px;font-size:12px;color:#9333ea;line-height:1.6;">
          Tag us on Instagram when your candle is lit or flowers are on display.<br/>
          We <em>love</em> seeing your photos! 🕯️✨
        </p>
        <a href="https://instagram.com/kay.candles.in"
          style="display:inline-block;padding:10px 28px;background:linear-gradient(135deg,#a855f7,#ec4899);
                 color:#fff;font-size:13px;font-weight:700;text-decoration:none;border-radius:50px;">
          @kay.candles.in
        </a>
      </div>
    </td></tr>

    <!-- Order again CTA -->
    <tr><td style="padding:0 32px 28px;text-align:center;">
      <p style="margin:0 0 14px;font-size:13px;color:#9ca3af;">Loved your order? Browse our latest drops!</p>
      <a href="${SITE_URL}"
        style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#ffa0b4,#ff6b8a);
               color:#fff;font-size:14px;font-weight:700;text-decoration:none;border-radius:50px;
               box-shadow:0 6px 20px rgba(255,107,138,0.30);">
        Shop Again &#8594;
      </a>
    </td></tr>`;

  return emailWrapper(content);
}

// ─────────────────────────────────────────────────────────────────
// EMAIL 3: Beautiful owner notification for shipment booked
// ─────────────────────────────────────────────────────────────────
function buildOwnerShipmentNotification(order: {
  order_number: string;
  customer_name: string;
  email?: string;
  phone: string;
  courier_name: string;
  awb_number: string;
  tracking_url?: string;
  total: number;
  address: string;
}): string {
  const content = `
    <!-- Header -->
    <tr><td style="background:linear-gradient(135deg,#1e293b,#334155);padding:32px;text-align:center;">
      <div style="font-size:36px;margin-bottom:8px;">&#128666;</div>
      <h2 style="margin:0;font-family:Georgia,serif;font-size:22px;font-weight:400;color:#f8fafc;">
        Shipment Booked Successfully
      </h2>
      <p style="margin:8px 0 0;font-size:13px;color:#94a3b8;">${order.order_number}</p>
    </td></tr>

    <tr><td style="padding:28px 32px;">

      <!-- Shipment details -->
      <table width="100%" cellpadding="0" cellspacing="0"
        style="background:#f0f4ff;border:1.5px solid #c7d2fe;border-radius:16px;margin-bottom:20px;overflow:hidden;">
        <tr><td style="background:#e0e7ff;padding:12px 20px;">
          <p style="margin:0;font-size:10px;font-weight:700;color:#4338ca;text-transform:uppercase;letter-spacing:2px;">Shipment Details</p>
        </td></tr>
        <tr><td style="padding:16px 20px;">
          <table width="100%">
            <tr>
              <td style="padding-bottom:10px;">
                <p style="margin:0;font-size:10px;color:#6366f1;text-transform:uppercase;font-weight:700;letter-spacing:1px;">Courier</p>
                <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#1e293b;">${order.courier_name}</p>
              </td>
              <td style="padding-bottom:10px;">
                <p style="margin:0;font-size:10px;color:#6366f1;text-transform:uppercase;font-weight:700;letter-spacing:1px;">AWB Number</p>
                <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#4338ca;font-family:'Courier New',monospace;letter-spacing:3px;">${order.awb_number}</p>
              </td>
            </tr>
            ${
              order.tracking_url
                ? `<tr><td colspan="2">
              <p style="margin:0;font-size:10px;color:#6366f1;text-transform:uppercase;font-weight:700;letter-spacing:1px;">Tracking Link</p>
              <a href="${order.tracking_url}" style="color:#4f46e5;font-size:13px;text-decoration:none;font-weight:600;">${order.tracking_url}</a>
            </td></tr>`
                : ""
            }
          </table>
        </td></tr>
      </table>

      <!-- Customer details -->
      <table width="100%" cellpadding="0" cellspacing="0"
        style="background:#fff5f7;border:1.5px solid #fce7ed;border-radius:16px;overflow:hidden;">
        <tr><td style="background:#fce7ed;padding:12px 20px;">
          <p style="margin:0;font-size:10px;font-weight:700;color:#a0687a;text-transform:uppercase;letter-spacing:2px;">Customer</p>
        </td></tr>
        <tr><td style="padding:16px 20px;">
          <p style="margin:0 0 6px;font-size:16px;font-weight:700;color:#2d1f26;">${order.customer_name}</p>
          <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">&#128222; ${order.phone}</p>
          ${order.email ? `<p style="margin:0 0 4px;font-size:13px;color:#6b7280;">&#9993; ${order.email}</p>` : ""}
          <p style="margin:8px 0 0;font-size:13px;color:#6b7280;line-height:1.6;">&#128205; ${order.address.replace(/\n/g, ", ")}</p>
          <p style="margin:8px 0 0;font-size:14px;font-weight:700;color:#c9828a;">Total: &#8377;${order.total}</p>
        </td></tr>
      </table>

    </td></tr>`;

  return emailWrapper(content);
}

// ─────────────────────────────────────────────────────────────────
// VALID STATUSES
// ─────────────────────────────────────────────────────────────────
const VALID_STATUSES = [
  "pending",
  "received",
  "making",
  "booked_shipment",
  "dispatched",
  "delivered",
  "cancelled",
  "confirmed",
  "shipped",
];

// ─────────────────────────────────────────────────────────────────
// GET — all orders
// ─────────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ orders: data ?? [] });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch orders", detail: String(err) },
      { status: 500 },
    );
  }
}

// ─────────────────────────────────────────────────────────────────
// PATCH — update status + AWB/courier/tracking + send emails
// ─────────────────────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_id, status, awb_number, courier_name, tracking_url } = body;

    if (!order_id || !status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid order_id or status" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    const updatePayload: Record<string, unknown> = { status };
    if (awb_number !== undefined) updatePayload.awb_number = awb_number || null;
    if (courier_name !== undefined)
      updatePayload.courier_name = courier_name || null;
    if (tracking_url !== undefined)
      updatePayload.tracking_url = tracking_url || null;

    const { data, error } = await supabase
      .from("orders")
      .update(updatePayload)
      .eq("id", order_id)
      .select()
      .single();

    if (error) {
      console.error("Status update DB error:", error);
      return NextResponse.json(
        {
          error: "Database rejected the update",
          detail: error.message,
          hint: error.hint ?? "Run definitive-status-fix.sql in Supabase",
        },
        { status: 500 },
      );
    }

    console.log(`✅ Order ${data.order_number}: → ${status}`);

    if (process.env.GMAIL_APP_PASSWORD) {
      const transporter = createTransporter();

      // ── SHIPMENT BOOKED EMAIL ──────────────────────────────────
      if (status === "booked_shipment" && awb_number && courier_name) {
        try {
          // Beautiful email to customer (if they have email)
          if (data.email) {
            await transporter.sendMail({
              from: `"Kay Candles and Craft" <${OWNER_EMAIL}>`,
              to: data.email,
              replyTo: OWNER_EMAIL,
              subject: `📦 Your order is on its way! ${data.order_number ?? ""} — Kay Candles and Craft`,
              html: buildShipmentEmail({
                order_number: data.order_number ?? data.id.slice(0, 8),
                customer_name: data.customer_name,
                courier_name,
                awb_number,
                tracking_url: tracking_url || undefined,
                items: data.items ?? [],
                total: data.total,
                address: data.address,
              }),
            });
            console.log(`✅ Shipment email sent to ${data.email}`);
          }

          // Beautiful HTML notification to owner
          await transporter.sendMail({
            from: `"Kay Candles and Craft" <${OWNER_EMAIL}>`,
            to: OWNER_EMAIL,
            subject: `📦 Shipment booked — ${data.order_number} · ${data.customer_name} · AWB: ${awb_number}`,
            html: buildOwnerShipmentNotification({
              order_number: data.order_number ?? data.id.slice(0, 8),
              customer_name: data.customer_name,
              email: data.email,
              phone: data.phone,
              courier_name,
              awb_number,
              tracking_url: tracking_url || undefined,
              total: data.total,
              address: data.address,
            }),
          });
          console.log(`✅ Owner notification sent`);
        } catch (emailErr) {
          console.error("Shipment email failed (non-fatal):", emailErr);
        }
      }

      // ── DELIVERED EMAIL ─────────────────────────────────────────
      if (status === "delivered" && data.email) {
        try {
          await transporter.sendMail({
            from: `"Kay Candles and Craft" <${OWNER_EMAIL}>`,
            to: data.email,
            replyTo: OWNER_EMAIL,
            subject: `🎉 Your Kay Candles order arrived! Leave us a review ⭐ — ${data.order_number ?? ""}`,
            html: buildDeliveredEmail({
              order_number: data.order_number ?? data.id.slice(0, 8),
              customer_name: data.customer_name,
              items: (data.items ?? []).map(
                (item: {
                  name: string;
                  product_id: string;
                  variant_name?: string;
                  fragrance_name?: string;
                  image_url: string;
                }) => ({
                  name: item.name,
                  product_id: item.product_id,
                  variant_name: item.variant_name,
                  fragrance_name: item.fragrance_name,
                  image_url: item.image_url,
                }),
              ),
            }),
          });
          console.log(`✅ Delivered + review email sent to ${data.email}`);
        } catch (emailErr) {
          console.error("Delivered email failed (non-fatal):", emailErr);
        }
      }
    }

    return NextResponse.json({ success: true, order: data });
  } catch (err) {
    console.error("PATCH /api/admin/orders exception:", err);
    return NextResponse.json(
      { error: "Server error", detail: String(err) },
      { status: 500 },
    );
  }
}
