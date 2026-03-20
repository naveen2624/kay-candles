import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Order, OrderItem } from "@/lib/supabase";

type Props = { params: Promise<{ id: string }> };

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

function itemLabel(item: OrderItem): string {
  const parts = [item.name];
  if (item.variant_name) parts.push(item.variant_name);
  if (item.fragrance_name) parts.push(`${item.fragrance_name} Fragrance`);
  return parts.join(" — ");
}

async function getOrder(id: string): Promise<Order | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data as Order;
}

export async function GET(_req: NextRequest, { params }: Props) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const itemsList = order.items
    .map((item) => `<li>${itemLabel(item)} &times; ${item.quantity}</li>`)
    .join("");

  const dateStr = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Shipping Label &mdash; ${order.order_number}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      background: #f9fafb;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 16px 48px;
      color: #1a1a1a;
    }

    /* ── Print controls ── */
    .controls {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
      width: 100%;
      max-width: 420px;
    }
    .btn {
      flex: 1;
      padding: 11px 0;
      border: none;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      font-family: Arial, sans-serif;
      transition: opacity 0.15s;
    }
    .btn:hover { opacity: 0.88; }
    .btn-print { background: #ff6b8a; color: #fff; }
    .btn-close { background: #e5e7eb; color: #374151; }

    @media print {
      body { background: #fff; padding: 0; }
      .controls { display: none; }
      .label { margin: 0; box-shadow: none; border: 2px solid #1a1a1a; }
    }

    /* ── Label card ── */
    .label {
      width: 100%;
      max-width: 420px;
      background: #fff;
      border: 2px solid #1a1a1a;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }

    /* Header */
    .label-header {
      background: linear-gradient(135deg, #ffa0b4, #ff6b8a);
      padding: 12px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .label-header .logo {
      height: 44px;
      width: auto;
      display: block;
      filter: brightness(0) invert(1);
    }
    .label-header .order-num {
      font-size: 11px;
      color: rgba(255,255,255,0.85);
      font-weight: 600;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }

    /* Body */
    .label-body { padding: 18px; }

    .section-title {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: #9ca3af;
      margin-bottom: 6px;
    }

    /* FROM block */
    .from-block {
      background: #f9fafb;
      border: 1.5px solid #d1d5db;
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 14px;
    }
    .from-block .name {
      font-size: 13px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 3px;
    }
    .from-block .detail {
      font-size: 11px;
      color: #4b5563;
      line-height: 1.6;
    }

    /* Arrow */
    .arrow {
      text-align: center;
      font-size: 22px;
      color: #ffa0b4;
      margin: 2px 0 12px;
      line-height: 1;
    }

    /* TO block */
    .to-block {
      border: 2.5px solid #1a1a1a;
      border-radius: 10px;
      padding: 14px 16px;
      margin-bottom: 14px;
      background: #fff;
    }
    .to-block .name {
      font-size: 18px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 4px;
    }
    .to-block .phone {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 5px;
    }
    .to-block .address {
      font-size: 12px;
      color: #4b5563;
      line-height: 1.65;
    }

    /* Order code bar */
    .order-code {
      text-align: center;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 3px;
      color: #374151;
      padding: 8px 0;
      border-top: 1.5px dashed #d1d5db;
      border-bottom: 1.5px dashed #d1d5db;
      margin-bottom: 14px;
      background: #fdf2f8;
    }

    /* Order details strip */
    .order-strip {
      border: 1px solid #fce7ed;
      border-radius: 8px;
      padding: 10px 13px;
      margin-bottom: 18px;
      background: #fff5f7;
    }
    .order-strip .row {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #6b7280;
      margin-bottom: 3px;
    }
    .order-strip .row:last-child { margin-bottom: 0; }
    .order-strip .row strong { color: #374151; }
    .order-strip .items-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #9ca3af;
      margin: 6px 0 4px;
    }
    .order-strip ul {
      padding-left: 14px;
      font-size: 11px;
      color: #374151;
      line-height: 1.6;
    }

    /* ── Thank you card ── */
    .thankyou {
      border-top: 2px dashed #ffc9d5;
      padding-top: 16px;
      text-align: center;
    }
    .scissors-line {
      font-size: 9px;
      color: #d1d5db;
      letter-spacing: 1.5px;
      margin-bottom: 14px;
    }
    .thankyou-icon { font-size: 24px; margin-bottom: 4px; }
    .thankyou h3 {
      font-family: Georgia, serif;
      font-size: 17px;
      font-weight: 400;
      color: #ff6b8a;
      margin-bottom: 8px;
    }
    .thankyou p {
      font-size: 11px;
      color: #6b7280;
      line-height: 1.7;
      max-width: 280px;
      margin: 0 auto 6px;
    }
    .thankyou .social {
      margin-top: 10px;
      font-size: 11px;
      color: #9ca3af;
    }
    .thankyou .social strong { color: #ff6b8a; }

    .tagline {
      margin-top: 12px;
      font-size: 9px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #d1d5db;
    }
  </style>
</head>
<body>

  <div class="controls">
    <button class="btn btn-close" onclick="window.close()">&#8592; Close</button>
    <button class="btn btn-print" onclick="window.print()">&#128438; Print / Save PDF</button>
  </div>

  <div class="label">

    <!-- Header -->
    <div class="label-header">
      <img src="https://xcqewrligvirqwcebcyc.supabase.co/storage/v1/object/public/kaycandlesproducts/logo.png" alt="Kay Candles and Craft" class="logo" />
      <span class="order-num">${order.order_number}</span>
    </div>

    <div class="label-body">

      <!-- FROM -->
      <p class="section-title">From</p>
      <div class="from-block">
        <p class="name">Kay Candles and Craft</p>
        <p class="detail">
          +91 97871 74450<br>
          Saifun Manzil, Narayanapuram<br>
          Guduvancherry &mdash; 603202<br>
          Tamil Nadu, India
        </p>
      </div>

      <!-- Arrow -->
      <div class="arrow">&#8595;</div>

      <!-- TO -->
      <p class="section-title">To</p>
      <div class="to-block">
        <p class="name">${order.customer_name}</p>
        <p class="phone">+91 ${order.phone}</p>
        <p class="address">${order.address.replace(/\n/g, "<br>")}</p>
      </div>

      <!-- Order number barcode-style -->
      <div class="order-code">${order.order_number}</div>

      <!-- Order summary -->
      <div class="order-strip">
        <div class="row">
          <span>Date</span>
          <strong>${dateStr}</strong>
        </div>
        <div class="row">
          <span>Payment</span>
          <strong>${order.payment_method}${order.payment_method === "COD" ? " (Collect on Delivery)" : " (Paid Online)"}</strong>
        </div>
        <div class="row">
          <span>Order Total</span>
          <strong>&#8377;${order.total}</strong>
        </div>
        <p class="items-label">Items</p>
        <ul>${itemsList}</ul>
      </div>

      <!-- Thank you card -->
      <div class="thankyou">
        <p class="scissors-line">&#9988; &mdash; &mdash; &mdash; cut here &mdash; &mdash; &mdash;</p>
        <div class="thankyou-icon">&#x1F56F;&#xFE0F;</div>
        <h3>Thank You, ${order.customer_name.split(" ")[0]}!</h3>
        <p>
          Every piece in your order was handcrafted with love
          by Preethi. We hope it brings warmth
          and joy to your space. &#x2728;
        </p>
        <p>
          We&rsquo;d love to see it in your home &mdash; share a photo
          and tag us on Instagram!
        </p>
        <div class="social">
          <strong>@kay.candles.in</strong>
          &nbsp;&bull;&nbsp;
          WhatsApp: <strong>+91 97871 74450</strong>
        </div>
        <p class="tagline">Handmade with love &hearts;</p>
      </div>

    </div>
  </div>

</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
