import { CartItem } from '@/lib/cartStore';

const WHATSAPP_NUMBER = '919787174450';

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
    .map((item) => `• ${item.name} x${item.quantity} - ₹${item.price * item.quantity}`)
    .join('\n');

  const deliveryText =
    order.deliveryFee === 0 ? '₹0 (FREE 🎉)' : `₹${order.deliveryFee}`;

  const message = `🕯️ *New Order - Kay Candles and Craft*

*Name:* ${order.name}
*Phone:* ${order.phone}
*Address:* ${order.address}

*Items:*
${itemLines}

*Subtotal:* ₹${order.subtotal}
*Delivery:* ${deliveryText}
*Total:* ₹${order.total}

_Payment Method: Cash on Delivery_`;

  return message;
}

export function buildWhatsAppUrl(order: OrderDetails): string {
  const message = formatWhatsAppMessage(order);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}
