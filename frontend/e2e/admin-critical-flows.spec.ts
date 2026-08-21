import { expect, test } from "@playwright/test";

const ownerEntryPath = "/owner/counter";
const demoUsername = "owner";
const demoPassword = "demo1234";

test.beforeEach(async ({ page }) => {
  // Keep the prototype auth flag and catalogue overlay independent per test.
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
});

test("conceals the direct admin route and exposes the owner entry redirect", async ({
  page,
}) => {
  const directAdminResponse = await page.request.get("/admin");
  expect(directAdminResponse.status()).toBe(404);

  await page.goto(ownerEntryPath);
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(
    page.getByRole("heading", { name: "Owner sign in" }),
  ).toBeVisible();
});

test("rejects invalid owner credentials and accepts the prototype login", async ({
  page,
}) => {
  await page.goto(ownerEntryPath);

  await page.getByLabel("Username").fill("not-the-owner");
  await page.getByLabel("Password").fill("wrong-password");
  await page.getByRole("button", { name: "Open owner dashboard" }).click();

  await expect(
    page.getByText("Incorrect username or password.", { exact: true }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/admin\/login$/);

  await page.getByLabel("Username").fill(demoUsername);
  await page.getByLabel("Password").fill(demoPassword);
  await page.getByRole("button", { name: "Open owner dashboard" }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(
    page.getByRole("heading", { name: "Dashboard" }),
  ).toBeVisible();
});

test("edits a product in the owner workspace and shows it in the customer menu", async ({
  page,
}) => {
  await page.goto(ownerEntryPath);
  await page.getByLabel("Username").fill(demoUsername);
  await page.getByLabel("Password").fill(demoPassword);
  await page.getByRole("button", { name: "Open owner dashboard" }).click();
  await expect(page).toHaveURL(/\/admin$/);

  await page.goto("/admin/products");
  const productRow = page
    .locator("li")
    .filter({ has: page.getByRole("button", { name: "Edit Chicken Rice" }) });
  await expect(productRow).toHaveCount(1);

  await productRow
    .getByRole("button", { name: "Edit Chicken Rice" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Edit: Chicken Rice" }),
  ).toBeVisible();

  const editedName = "Chicken Rice · E2E edited";
  await page.getByLabel("Name", { exact: true }).fill(editedName);
  await page.getByRole("button", { name: "Save product" }).click();
  await expect(page.getByRole("status")).toContainText(
    `Saved "${editedName}".`,
  );

  await page.goto("/menu");
  await expect(
    page.getByRole("heading", { level: 3, name: new RegExp(editedName) }),
  ).toBeVisible();
});

test("keeps the order queue compact and reveals item lines on demand", async ({
  page,
}) => {
  await page.goto(ownerEntryPath);
  await page.getByLabel("Username").fill(demoUsername);
  await page.getByLabel("Password").fill(demoPassword);
  await page.getByRole("button", { name: "Open owner dashboard" }).click();

  await page.goto("/admin/orders");
  const firstOrder = page.locator("article").first();
  const itemDetails = firstOrder.locator("details");
  await expect(itemDetails).toBeVisible();
  await expect(itemDetails).not.toHaveAttribute("open", "");

  await itemDetails.locator("summary").click();
  await expect(itemDetails).toHaveAttribute("open", "");
  await expect(itemDetails.getByRole("list")).toBeVisible();
});
