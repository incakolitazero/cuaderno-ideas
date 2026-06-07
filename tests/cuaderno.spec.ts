import { test, expect } from "@playwright/test";

test("una usuaria entra, guarda una idea y la borra", async ({ page }) => {
  // 1. El robot abre el login
  await page.goto("http://localhost:3000/login");

  // 2. Escribe el correo y la contraseña
  await page.getByPlaceholder("Tu correo").fill("danielamarotazowiese@gmail.com");
  await page.getByPlaceholder("Tu contraseña (mínimo 6 letras)").fill("12345678");

  // 3. Aprieta Entrar
  await page.getByRole("button", { name: "Entrar" }).click();

  // 4. Confirma que llegó al cuaderno
  await expect(page.getByText("Mis Ideas 💡")).toBeVisible({ timeout: 20000 });

  // 5. Escribe y guarda una idea ÚNICA
  const textoIdea = `Idea del robot ${Date.now()}`;
  await page.getByPlaceholder("Escribe tu idea aquí... ✨").fill(textoIdea);
  await page.getByRole("button", { name: "Guardar idea" }).click();

  // 6. Confirma que la idea aparece en la lista
  await expect(page.getByText(textoIdea)).toBeVisible();

  // 7. Encuentra LA TARJETA exacta (el div más interno) y SU basurerito
  const tarjeta = page.locator("div").filter({ hasText: textoIdea }).last();
  await tarjeta.getByRole("button", { name: "🗑️" }).click();

  // 8. Confirma que desapareció
  await expect(page.getByText(textoIdea)).not.toBeVisible({ timeout: 20000 });await expect(page.getByText(textoIdea)).not.toBeVisible();
});