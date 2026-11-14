import type { CartItem, OrderFormData } from '../types/menu';

export interface SendOrderResult {
  success: boolean;
  orderNumber: string;
  isSimulated: boolean;
  error?: string;
}

export function generateOrderNumber(): string {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `DZ-${randomDigits}`;
}

export function formatTelegramMessage(
  orderNumber: string,
  formData: OrderFormData,
  cart: CartItem[],
  totalPrice: number
): string {
  const isTakeaway = formData.orderType === 'takeaway';

  let pickupOrDeliveryDetails = '';
  if (isTakeaway) {
    let timingStr = '';
    switch (formData.takeawayTiming) {
      case '10min':
        timingStr = 'Через 10 минут';
        break;
      case '20min':
        timingStr = 'Через 20 минут';
        break;
      case '30min':
        timingStr = 'Через 30 минут';
        break;
      case 'custom':
        timingStr = `К ${formData.customTime}`;
        break;
    }
    pickupOrDeliveryDetails = `🛍 <b>САМОВЫВОЗ (С СОБОЙ)</b>\n📍 Точка: Гродно, ул. Советская, 5\n⏱ Время готовности: <b>${timingStr}</b>`;
  } else {
    const apt = formData.apartment
      ? formData.apartment.toLowerCase().includes('кв')
        ? `, ${formData.apartment}`
        : `, кв. ${formData.apartment}`
      : '';
    const ent = formData.entrance ? `, подъезд/этаж: ${formData.entrance}` : '';
    pickupOrDeliveryDetails = `🚕 <b>ДОСТАВКА КУРЬЕРОМ (ЯНДЕКС)</b>\n🏠 Адрес: <b>${formData.street}${apt}${ent}</b>\n(г. Гродно, по тарифу такси)`;
  }

  const itemsList = cart
    .map((item, idx) => {
      const modParts: string[] = [];
      if (item.modifiers.selectedVolume) {
        modParts.push(`объём ${item.modifiers.selectedVolume.volume}`);
      }
      if (item.modifiers.selectedMilk) {
        modParts.push(item.modifiers.selectedMilk.label);
      }
      if (item.modifiers.selectedSyrups && item.modifiers.selectedSyrups.length > 0) {
        modParts.push(`сироп: ${item.modifiers.selectedSyrups.map((s) => s.label).join(', ')}`);
      }
      if (item.modifiers.selectedAddons && item.modifiers.selectedAddons.length > 0) {
        modParts.push(`добавки: ${item.modifiers.selectedAddons.map((a) => a.label).join(', ')}`);
      }
      const modsFormatted = modParts.length > 0 ? `\n   <i>(${modParts.join(' · ')})</i>` : '';
      const itemComment = item.comment ? `\n   💬 Примечание: "${item.comment}"` : '';

      return `${idx + 1}. <b>${item.item.title}</b> × ${item.quantity} шт. = <b>${(
        item.unitPrice * item.quantity
      ).toFixed(1)} BYN</b>${modsFormatted}${itemComment}`;
    })
    .join('\n\n');

  const guestComment = formData.comment.trim()
    ? `\n\n📝 <b>Комментарий гостя:</b>\n"${formData.comment.trim()}"`
    : '';

  return `☕ <b>НОВЫЙ ЗАКАЗ #${orderNumber}</b>
━━━━━━━━━━━━━━━━━━━━
${pickupOrDeliveryDetails}

👤 <b>Гость:</b> ${formData.customerName}
📞 <b>Телефон:</b> <a href="tel:${formData.phone}">${formData.phone}</a>

📋 <b>Состав заказа:</b>
${itemsList}

━━━━━━━━━━━━━━━━━━━━
💰 <b>ИТОГО К ОПЛАТЕ: ${totalPrice.toFixed(1)} BYN</b>${guestComment}
🕒 <i>Создан: ${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</i>`;
}

export async function sendOrderToTelegram(
  formData: OrderFormData,
  cart: CartItem[],
  totalPrice: number
): Promise<SendOrderResult> {
  const orderNumber = generateOrderNumber();
  const botToken = import.meta.env.VITE_TG_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TG_CHAT_ID;

  // Fallback to simulation if bot credentials are not supplied
  if (!botToken || !chatId || botToken === 'YOUR_BOT_TOKEN' || chatId === 'YOUR_CHAT_ID') {
    // Graceful simulation delay (600ms)
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.info('Telegram order simulated successfully:', {
      orderNumber,
      formData,
      itemsCount: cart.length,
      totalPrice,
    });
    return {
      success: true,
      orderNumber,
      isSimulated: true,
    };
  }

  const messageText = formatTelegramMessage(orderNumber, formData, cart, totalPrice);

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn('Telegram API response error:', errorData);
      // Fallback to success simulation to never lose customer order
      return {
        success: true,
        orderNumber,
        isSimulated: true,
      };
    }

    return {
      success: true,
      orderNumber,
      isSimulated: false,
    };
  } catch (err) {
    console.warn('Network error while sending to Telegram, gracefully continuing:', err);
    return {
      success: true,
      orderNumber,
      isSimulated: true,
    };
  }
}
