import type { OrderFormData, OrderFormErrors } from '../types/menu';

const VALID_BELARUS_OPERATOR_CODES = ['29', '33', '44', '25'];

/**
 * Formats user input into the Belarus phone mask: +375 (XX) XXX-XX-XX
 */
export function formatBelarusPhone(input: string): string {
  // Extract all digits
  let digits = input.replace(/\D/g, '');

  // If user typed 80... convert to 375...
  if (digits.startsWith('80') && digits.length >= 2) {
    digits = '375' + digits.slice(2);
  }

  // If starts with 375, strip prefix to format local 9 digits
  if (digits.startsWith('375')) {
    digits = digits.slice(3);
  } else if (digits.startsWith('7') || digits.startsWith('8')) {
    // If user started typing another code, just keep the tail
    digits = digits.slice(1);
  }

  // Max 9 digits for Belarus local number
  const localDigits = digits.slice(0, 9);

  let formatted = '+375';
  if (localDigits.length > 0) {
    formatted += ' (' + localDigits.slice(0, 2);
  }
  if (localDigits.length >= 2) {
    formatted += ') ';
  }
  if (localDigits.length > 2) {
    formatted += localDigits.slice(2, 5);
  }
  if (localDigits.length >= 5) {
    formatted += '-';
  }
  if (localDigits.length > 5) {
    formatted += localDigits.slice(5, 7);
  }
  if (localDigits.length >= 7) {
    formatted += '-';
  }
  if (localDigits.length > 7) {
    formatted += localDigits.slice(7, 9);
  }

  return formatted;
}

/**
 * Validates whether the formatted phone string matches +375 (XX) XXX-XX-XX
 * with valid Belarusian mobile operator codes (29, 33, 44, 25).
 */
export function validateBelarusPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  // Must be 375 + 9 digits = 12 digits total
  if (digits.length !== 12 || !digits.startsWith('375')) {
    return false;
  }
  const operatorCode = digits.slice(3, 5);
  return VALID_BELARUS_OPERATOR_CODES.includes(operatorCode);
}

/**
 * Validates customer name: at least 2 letters, not just whitespace or digits.
 */
export function validateCustomerName(name: string): boolean {
  const trimmed = name.trim();
  if (trimmed.length < 2) return false;
  // Must contain at least 2 letters (Cyrillic or Latin)
  const letters = trimmed.replace(/[^a-zA-Zа-яА-ЯёЁіІўЎ]/g, '');
  return letters.length >= 2;
}

/**
 * Validates delivery street and house number.
 */
export function validateStreetAddress(street: string): boolean {
  const trimmed = street.trim();
  if (trimmed.length < 4) return false;
  // Should ideally have some alphanumeric characters
  return trimmed.length >= 4;
}

/**
 * Validates full order form according to strict criteria
 */
export function validateOrderForm(formData: OrderFormData): {
  isValid: boolean;
  errors: OrderFormErrors;
  firstErrorField?: keyof OrderFormErrors;
} {
  const errors: OrderFormErrors = {};

  if (!validateCustomerName(formData.customerName)) {
    errors.customerName = 'Укажите ваше имя (минимум 2 символа)';
  }

  if (!validateBelarusPhone(formData.phone)) {
    errors.phone = 'Введите корректный номер телефона Беларуси: +375 (XX) XXX-XX-XX';
  }

  if (formData.orderType === 'delivery') {
    if (!validateStreetAddress(formData.street)) {
      errors.street = 'Укажите улицу и дом в Гродно для вызова курьера';
    }
  }

  if (formData.orderType === 'takeaway' && formData.takeawayTiming === 'custom') {
    if (!formData.customTime || formData.customTime.trim().length === 0) {
      errors.customTime = 'Укажите время готовности заказа';
    }
  }

  const isValid = Object.keys(errors).length === 0;
  const firstErrorField = (Object.keys(errors)[0] as keyof OrderFormErrors) || undefined;

  return { isValid, errors, firstErrorField };
}
