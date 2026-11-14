import { test, expect } from '@playwright/test';

test.describe('Djezva Desktop Layout & Interactions', () => {
  test.use({
    viewport: { width: 1280, height: 800 },
    isMobile: false,
  });

  test('Desktop layout: 2-col hero, multi-col grid, right-side cart drawer, centered modal, bottom-right floating cart', async ({
    page,
  }) => {
    // Mock Telegram Bot API
    await page.route('https://api.telegram.org/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, result: { message_id: 88888 } }),
      });
    });

    await page.goto('/');
    await expect(page).toHaveTitle(/Джезва/i);

    // 1. Verify Desktop Container width (max-w-5xl)
    const mainContainer = page.locator('main');
    await expect(mainContainer).toHaveClass(/max-w-5xl/);

    // 2. Verify Desktop Hero 2-column view
    const desktopHero = page.locator('section').locator('div.hidden.md\\:grid');
    await expect(desktopHero).toBeVisible();
    await expect(desktopHero.locator('video')).toBeVisible();
    await expect(desktopHero.getByRole('heading', { name: 'Кофе на песке и блинная во дворике' })).toBeVisible();
    await expect(desktopHero.getByText('Открыто · 08:00–23:00')).toBeVisible();
    await expect(desktopHero.getByText('Гродно, ул. Советская, 5')).toBeVisible();

    // 3. Verify Menu Grid
    // Photo cards container should have lg:grid-cols-3
    const photoGrid = page.locator('div.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
    await expect(photoGrid).toBeVisible();
    const photoCards = photoGrid.locator('article');
    const photoCardCount = await photoCards.count();
    expect(photoCardCount).toBeGreaterThan(0);

    // Compact items container should have md:grid-cols-2 gap-3
    const compactGrid = page.locator('div.grid.grid-cols-1.md\\:grid-cols-2.gap-3');
    await expect(compactGrid).toBeVisible();

    // 4. Test Add item & check Floating Cart button positioning
    const quickAddBtn = page.getByRole('button', { name: /добавить в заказ креп болоньезе/i }).first();
    await quickAddBtn.click();

    // Check floating cart button
    const floatingCartBtn = page.getByTestId('floating-cart-btn');
    await expect(floatingCartBtn).toBeVisible();

    // Parent motion div should have desktop bottom-right placement
    const floatingCartWrapper = floatingCartBtn.locator('..');
    await expect(floatingCartWrapper).toHaveClass(/md:right-8/);
    await expect(floatingCartWrapper).toHaveClass(/md:bottom-8/);

    // 5. Open Customizer modal on desktop & check centered dialog
    const customizeBtn = page.getByRole('button', { name: /настроить креп болоньезе/i }).first();
    await customizeBtn.click();

    const customizerModal = page.locator('div.fixed.z-50').filter({ hasText: 'Настройка позиции' });
    await expect(customizerModal).toBeVisible();
    const modalDialog = customizerModal.locator('div.relative.w-full');
    await expect(modalDialog).toHaveClass(/md:max-w-md/);

    // Close modal
    await customizerModal.getByRole('button', { name: /закрыть/i }).click();

    // 6. Open Cart drawer on desktop & check right-side panel
    await floatingCartBtn.click();
    const cartDrawer = page.locator('div.fixed.z-50').filter({ hasText: 'Корзина заказа' });
    await expect(cartDrawer).toBeVisible();
    const drawerPanel = cartDrawer.locator('div.relative.w-full');
    await expect(drawerPanel).toHaveClass(/md:w-\[420px\]/);

    // Close cart drawer
    await cartDrawer.getByRole('button', { name: /закрыть корзину/i }).click();
  });
});
