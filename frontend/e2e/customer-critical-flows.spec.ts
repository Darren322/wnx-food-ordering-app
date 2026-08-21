import { expect, test } from "@playwright/test";

const pickupStorageKey = "wnx-pickup-selection-v1";

test.beforeEach(async ({ page }) => {
  // Keep each flow deterministic and independent of a developer's local cart.
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
});

test("chooses a valid pickup slot, updates the menu banner, and persists it", async ({
  page,
}) => {
  await page.goto("/menu");

  const pickupRegion = page.locator(
    'section[aria-label="Current pickup time"]',
  );
  await expect(pickupRegion.getByText("Pickup time", { exact: true })).toBeVisible();
  const choosePickup = pickupRegion.getByRole("button", {
    name: "Choose pickup time",
  });
  await expect(choosePickup).toBeVisible();

  await choosePickup.click();

  const dialog = page.getByRole("dialog", { name: "Choose a time" });
  await expect(dialog).toBeVisible();
  const dateSelect = dialog.getByRole("combobox", { name: /^Date/ });
  const timeSelect = dialog.getByRole("combobox", { name: /^Time/ });
  await expect(dateSelect).toBeEnabled();
  await expect(timeSelect).toBeEnabled();

  const chosenDate = await dateSelect.inputValue();
  const chosenTime = await timeSelect.inputValue();
  expect(chosenDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(chosenTime).toMatch(/^\d{2}:\d{2}$/);

  const savePickup = dialog.getByRole("button", { name: /Save pickup/ });
  await expect(savePickup).toBeEnabled();
  await savePickup.click();

  await expect(
    pickupRegion.getByRole("button", { name: "Change pickup" }),
  ).toBeVisible();
  await expect(pickupRegion).toContainText(chosenTime);

  const storedSelection = await page.evaluate((key) => {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as { date?: string; time?: string }) : null;
  }, pickupStorageKey);
  expect(storedSelection).toMatchObject({ date: chosenDate, time: chosenTime });

  await page.reload();
  await expect(
    pickupRegion.getByRole("button", { name: "Change pickup" }),
  ).toBeVisible();
  await expect(pickupRegion).toContainText(chosenTime);
});

test("filters the menu by category and exposes the selected state", async ({
  page,
}) => {
  await page.goto("/menu");

  const categoryNav = page.getByRole("navigation", { name: "Menu categories" });
  const allDishes = categoryNav.getByRole("button", {
    name: "All dishes",
    exact: true,
  });
  const chickenRice = categoryNav.getByRole("button", {
    name: "Chicken Rice",
    exact: true,
  });
  const dryLaksa = categoryNav.getByRole("button", {
    name: "Dry Laksa",
    exact: true,
  });
  const menuList = page.locator('section[aria-labelledby="menu-list-heading"]');

  await expect(allDishes).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("heading", { name: "All dishes" })).toBeVisible();

  await dryLaksa.click();
  await expect(dryLaksa).toHaveAttribute("aria-pressed", "true");
  await expect(allDishes).toHaveAttribute("aria-pressed", "false");
  await expect(
    page.getByRole("heading", { name: "Dry Laksa", level: 2 }),
  ).toBeVisible();
  await expect(menuList.getByRole("listitem")).toHaveCount(1);

  await chickenRice.click();
  await expect(chickenRice).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("heading", { name: "Chicken Rice", level: 2 }),
  ).toBeVisible();
  await expect(menuList.getByRole("listitem")).toHaveCount(5);
});

test("adds, edits, checks out, and removes a cart item", async ({
  page,
}) => {
  await page.goto("/menu");

  const chickenRiceCard = page
    .locator("article")
    .filter({ hasText: "Chicken Rice" })
    .filter({ has: page.getByRole("heading", { name: /^Chicken Rice/ }) });
  await expect(chickenRiceCard).toHaveCount(1);

  await chickenRiceCard
    .getByRole("button", { name: "Add Chicken Rice to cart" })
    .click();
  await expect(
    page.getByRole("button", { name: "Chicken Rice added to cart" }),
  ).toBeVisible();
  await expect(
    page.locator('aside[aria-label="Cart summary"]').getByText("1 item", {
      exact: true,
    }),
  ).toBeVisible();

  await page.goto("/cart");
  await expect(page).toHaveURL(/\/cart$/);
  const cartSummary = page.locator('aside[aria-label="Cart summary"]');
  await expect(cartSummary).not.toContainText(/cutoff/i);
  await expect(
    cartSummary.getByRole("button", { name: "Choose pickup" }),
  ).toHaveClass(/btn-secondary/);
  let cartRow = page.locator("li").filter({ hasText: "Chicken Rice" });
  await expect(cartRow).toHaveCount(1);
  await expect(cartRow.getByText("1", { exact: true })).toBeVisible();

  const editHref = await cartRow
    .getByRole("link", { name: "Edit item" })
    .getAttribute("href");
  expect(editHref).toMatch(/^\/menu\/chicken-rice\?edit=/);
  await page.goto(editHref!);
  await expect(page).toHaveURL(/\/menu\/chicken-rice\?edit=/);
  await page.getByRole("button", { name: "Increase quantity" }).click();
  await page.getByRole("button", { name: /Save changes/ }).click();
  await expect(page).toHaveURL(/\/cart$/);

  cartRow = page.locator("li").filter({ hasText: "Chicken Rice" });
  await expect(cartRow.getByText("2", { exact: true })).toBeVisible();

  const checkoutHref = await page
    .getByRole("link", { name: "Checkout" })
    .getAttribute("href");
  expect(checkoutHref).toBe("/checkout");
  await page.goto(checkoutHref!);
  await expect(page).toHaveURL(/\/checkout$/);
  const checkoutPickup = page.locator(
    'section[aria-labelledby="pickup-details-heading"]',
  );
  await expect(checkoutPickup).not.toContainText(/cutoff/i);
  await expect(
    checkoutPickup.getByRole("button", { name: "Choose pickup" }),
  ).toHaveClass(/btn-secondary/);

  await page.goto("/cart");
  cartRow = page.locator("li").filter({ hasText: "Chicken Rice" });

  await cartRow.getByRole("button", { name: "Remove" }).click();
  await expect(page.getByText("Your cart is empty.", { exact: true })).toBeVisible();
});
