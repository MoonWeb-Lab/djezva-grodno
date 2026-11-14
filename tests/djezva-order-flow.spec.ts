import { test, expect } from '@playwright/test';

test.describe('Djezva Mobile SPA - End to End Order Flow & Validation', () => {
  test('Complete flow: browsing, customizer, cart drawer, validation & order submission', async ({ page }) => {
    // 1. Console error monitor
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // 2. Open App in mobile viewport (390x844)
    await page.goto('/');
    await expect(page).toHaveTitle(/Джезва/i);

    // Verify Brand Header & Hero
    await expect(page.getByText('ДЖЕЗВА').first()).toBeVisible();
    await expect(page.getByText('Гродно, ул. Советская, 5').first()).toBeVisible();
    await expect(page.getByText('Кофе на песке и блинная во дворике')).toBeVisible();

    // Verify background video
    const video = page.locator('video');
    await expect(video).toBeVisible();

    // 3. Category Switching
    const coffeeCategoryTab = page.getByRole('button', { name: 'Кофе на песке' });
    await coffeeCategoryTab.click();
    await expect(page.getByRole('heading', { name: 'Джезва Классика', exact: false })).toBeVisible();

    const pancakesCategoryTab = page.getByRole('button', { name: 'Блинная во дворике' });
    await pancakesCategoryTab.click();
    await expect(page.getByRole('heading', { name: 'Креп Болоньезе', exact: false })).toBeVisible();

    const allCategoryTab = page.getByRole('button', { name: 'Всё меню' });
    await allCategoryTab.click();

    // 4. Customizer Modal: Configure Cappuccino (exact heading)
    const cappuccinoCard = page
      .locator('article')
      .filter({ has: page.getByRole('heading', { name: 'Капучино', exact: true }) });
    const customizeCappuccinoBtn = cappuccinoCard.getByRole('button', { name: /настроить/i });
    await customizeCappuccinoBtn.click();

    // Verify customizer modal opened
    const customizerModal = page.locator('div[role="dialog"], div.fixed.z-50').filter({ hasText: 'Настройка позиции' });
    await expect(customizerModal).toBeVisible();
    await expect(customizerModal.getByText('Капучино', { exact: true })).toBeVisible();

    // Choose 300 ml volume option (8 BYN)
    const largeVolBtn = customizerModal.getByRole('button', { name: /300 мл/i });
    await largeVolBtn.click();

    // Choose Oat milk (+1.5 BYN)
    const oatMilkBtn = customizerModal.getByRole('button', { name: /овсяное молоко/i });
    await oatMilkBtn.click();

    // Choose Salted caramel syrup (+1.5 BYN)
    const caramelSyrupBtn = customizerModal.getByRole('button', { name: /солёная карамель/i });
    await caramelSyrupBtn.click();

    // Total should be 8 + 1.5 + 1.5 = 11.0 BYN
    await expect(customizerModal.getByText('11.0 BYN')).toBeVisible();

    // Click "Добавить"
    const addCustomizedBtn = customizerModal.getByRole('button', { name: /добавить/i });
    await addCustomizedBtn.click();
    await expect(customizerModal).not.toBeVisible();

    // 5. Quick Add: Add Crepe Bolognese (25 BYN)
    const crepeCard = page
      .locator('article')
      .filter({ has: page.getByRole('heading', { name: /Креп Болоньезе/i }) });
    const quickAddCrepeBtn = crepeCard.getByRole('button', { name: /в заказ/i });
    await quickAddCrepeBtn.click();

    // 6. Floating Cart Button
    const floatingCartBtn = page.getByTestId('floating-cart-btn');
    await expect(floatingCartBtn).toBeVisible();
    await expect(floatingCartBtn).toContainText('2 поз.');
    await expect(floatingCartBtn).toContainText('36.0 BYN');

    // Click to open Cart Drawer
    await floatingCartBtn.click();

    // Verify Cart Drawer is opened
    const cartDrawer = page.locator('div.fixed.z-50').filter({ hasText: 'Корзина заказа' });
    await expect(cartDrawer).toBeVisible();
    await expect(cartDrawer.getByText('Креп Болоньезе')).toBeVisible();
    await expect(cartDrawer.getByText('Капучино')).toBeVisible();

    // 7. Test Strict Validation on empty submit
    const submitOrderBtn = cartDrawer.getByRole('button', { name: /оформить заказ/i });
    await submitOrderBtn.click();

    // Errors must appear
    await expect(cartDrawer.getByText('Укажите ваше имя (минимум 2 символа)')).toBeVisible();
    await expect(cartDrawer.getByText('Введите корректный номер телефона Беларуси: +375 (XX) XXX-XX-XX')).toBeVisible();

    // Test invalid phone number with wrong operator code
    const phoneInput = cartDrawer.locator('#customer-phone');
    await phoneInput.fill('111111111');
    await submitOrderBtn.click();
    await expect(cartDrawer.getByText('Введите корректный номер телефона Беларуси: +375 (XX) XXX-XX-XX')).toBeVisible();

    // Switch to Delivery Mode
    const deliveryTab = cartDrawer.getByRole('button', { name: /доставка/i });
    await deliveryTab.click();
    await expect(cartDrawer.getByText('Доставка выполняется курьером Яндекс Доставки')).toBeVisible();

    // Click submit with empty delivery street
    await submitOrderBtn.click();
    await expect(cartDrawer.getByText('Укажите улицу и дом в Гродно для вызова курьера')).toBeVisible();

    // 8. Fill Valid Form Data
    const nameInput = cartDrawer.locator('#customer-name');
    await nameInput.fill('Анастасия');

    // Valid Belarus phone: operator 29
    await phoneInput.fill('291234567');
    await expect(phoneInput).toHaveValue('+375 (29) 123-45-67');

    const streetInput = cartDrawer.locator('#delivery-street');
    await streetInput.fill('ул. Советская, 5');

    const apartmentInput = cartDrawer.locator('#delivery-apartment');
    await apartmentInput.fill('кв. 7');

    // Submit valid order
    await submitOrderBtn.click();

    // 9. Verify Confirmation Screen
    const confirmationModal = page.locator('div.fixed.z-50').filter({ hasText: 'ЗАКАЗ УСПЕШНО ПРИНЯТ' });
    await expect(confirmationModal).toBeVisible();
    await expect(confirmationModal.getByText(/Заказ #DZ-\d+/)).toBeVisible();
    await expect(confirmationModal.getByText(/ул\. Советская, 5/)).toBeVisible();
    await expect(confirmationModal.getByText('36.0 BYN')).toBeVisible();

    // Click "Вернуться в меню"
    const returnBtn = confirmationModal.getByRole('button', { name: /вернуться в меню/i });
    await returnBtn.click();
    await expect(confirmationModal).not.toBeVisible();

    // Cart should now be empty and floating cart button hidden
    await expect(floatingCartBtn).not.toBeVisible();

    // Check console errors
    const seriousErrors = consoleErrors.filter(
      (err) => !err.includes('favicon') && !err.includes('Download the React DevTools')
    );
    expect(seriousErrors).toEqual([]);
  });
});
