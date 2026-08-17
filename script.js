// Cambia este correo si en algún momento quieres redirigir los reportes a otra dirección.
const SUPPORT_EMAIL = "sacariasdev@gmail.com";
const MAX_FILE_SIZE_MB = 5;

const form = document.getElementById("supportForm");
const submitBtn = document.getElementById("submitBtn");
const submitLabel = document.getElementById("submitLabel");
const errorState = document.getElementById("errorState");
const successState = document.getElementById("successState");
const resetButton = document.getElementById("resetButton");

const ticketNumberEl = document.getElementById("ticketNumber");
const successNumberEl = document.getElementById("successNumber");

const description = document.getElementById("description");
const charCount = document.getElementById("charCount");

const photoInput = document.getElementById("photo");
const fileName = document.getElementById("fileName");
const preview = document.getElementById("preview");

// --- Número de pedido, generado al cargar la página ---
function generateTicketNumber() {
  return String(Math.floor(Math.random() * 9000) + 1000);
}

const ticketNumber = generateTicketNumber();
ticketNumberEl.textContent = `Pedido #${ticketNumber}`;
successNumberEl.textContent = `#${ticketNumber}`;

// --- Contador de caracteres ---
description.addEventListener("input", () => {
  charCount.textContent = `${description.value.length} / 800`;
});

// --- Vista previa de la foto ---
photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];

  if (!file) {
    fileName.textContent = "Ningún archivo seleccionado";
    preview.hidden = true;
    preview.removeAttribute("src");
    return;
  }

  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    showError(`La imagen pesa demasiado. El límite es ${MAX_FILE_SIZE_MB} MB.`);
    photoInput.value = "";
    fileName.textContent = "Ningún archivo seleccionado";
    preview.hidden = true;
    return;
  }

  hideError();
  fileName.textContent = file.name;

  const reader = new FileReader();
  reader.onload = (e) => {
    preview.src = e.target.result;
    preview.hidden = false;
  };
  reader.readAsDataURL(file);
});

// --- Envío del formulario ---
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideError();

  submitBtn.disabled = true;
  submitLabel.textContent = "Enviando...";

  const formData = new FormData(form);

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${SUPPORT_EMAIL}`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Respuesta no válida del servidor");
    }

    form.hidden = true;
    successState.hidden = false;
  } catch (err) {
    showError("No pudimos enviar tu pedido. Revisa tu conexión e inténtalo de nuevo.");
    submitBtn.disabled = false;
    submitLabel.textContent = "Enviar pedido a cocina";
  }
});

resetButton.addEventListener("click", () => {
  form.reset();
  fileName.textContent = "Ningún archivo seleccionado";
  preview.hidden = true;
  charCount.textContent = "0 / 800";
  submitBtn.disabled = false;
  submitLabel.textContent = "Enviar pedido a cocina";

  const newNumber = generateTicketNumber();
  ticketNumberEl.textContent = `Pedido #${newNumber}`;
  successNumberEl.textContent = `#${newNumber}`;

  successState.hidden = true;
  form.hidden = false;
});

function showError(message) {
  errorState.textContent = message;
  errorState.hidden = false;
}

function hideError() {
  errorState.hidden = true;
}
