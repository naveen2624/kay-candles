// utils/whatsappOrder.ts
import { CartItem } from "@/lib/cartStore";

const WHATSAPP_NUMBER = "919787174450";

type OrderDetails = {
  name: string;
  phone: string;
  address: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
};

export function formatWhatsAppMessage(order: OrderDetails): string {
  const itemLines = order.items
    .map((item) => {
      const label = item.variantName
        ? `${item.name} (${item.variantName})`
        : item.name;
      return `• ${label} x${item.quantity} — ₹${item.price * item.quantity}`;
    })
    .join("\n");

  const deliveryText =
    order.deliveryFee === 0 ? "₹0 (FREE 🎉)" : `₹${order.deliveryFee}`;

  return `🕯️ *New Order — Kay Candles and Craft*

*Name:* ${order.name}
*Phone:* ${order.phone}
*Address:* ${order.address}

*Items:*
${itemLines}

*Subtotal:* ₹${order.subtotal}
*Delivery:* ${deliveryText}
*Total:* ₹${order.total}

_Payment: Cash on Delivery_`;
}

export function buildWhatsAppUrl(order: OrderDetails): string {
  const message = formatWhatsAppMessage(order);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
