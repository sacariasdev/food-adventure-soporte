const MAX_FILE_SIZE_MB = 5;

const form = document.getElementById("supportForm");
const submitBtn = document.getElementById("submitBtn");
const submitLabel = document.getElementById("submitLabel");
const errorState = document.getElementById("errorState");

const ticketNumberEl = document.getElementById("ticketNumber");
const subjectField = document.getElementById("subjectField");
const nextField = document.getElementById("nextField");

const description = document.getElementById("description");
const charCount = document.getElementById("charCount");

const photoInput = document.getElementById("photo");
const fileName = document.getElementById("fileName");
const preview = document.getElementById("preview");

// --- Número de pedido, generado al cargar la página ---
// Se usa para: mostrarlo en pantalla, hacer único el asunto del correo
// (así Gmail no agrupa varios reportes distintos en un mismo hilo)
// y pasarlo a la página de agradecimiento.
function generateTicketNumber() {
  const timePart = Date.now().toString().slice(-5);
  return timePart;
}

const ticketNumber = generateTicketNumber();

if (ticketNumberEl) {
  ticketNumberEl.textContent = `Pedido #${ticketNumber}`;
}

if (subjectField) {
  subjectField.value = `[Food Adventure] Soporte #${ticketNumber}`;
}

if (nextField) {
  const thanksUrl = new URL("gracias.html", window.location.href);
  thanksUrl.searchParams.set("pedido", ticketNumber);
  nextField.value = thanksUrl.href;
}

// --- Contador de caracteres ---
if (description) {
  description.addEventListener("input", () => {
    charCount.textContent = `${description.value.length} / 800`;
  });
}

// --- Vista previa de la foto ---
if (photoInput) {
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
}

// --- Envío del formulario ---
// Ojo: aquí NO se usa fetch/AJAX ni preventDefault sobre envíos válidos.
// El formulario se envía de forma nativa (multipart real) para que
// el archivo adjunto llegue correctamente a FormSubmit.
if (form) {
  form.addEventListener("submit", (event) => {
    const file = photoInput && photoInput.files[0];

    if (file && file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      event.preventDefault();
      showError(`La imagen pesa demasiado. El límite es ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    hideError();
    submitBtn.disabled = true;
    submitLabel.textContent = "Enviando...";
    // No se llama a event.preventDefault(): el navegador continúa
    // el envío normal del formulario hacia FormSubmit.
  });
}

function showError(message) {
  errorState.textContent = message;
  errorState.hidden = false;
}

function hideError() {
  errorState.hidden = true;
}