// =========================
// Scroll suave para enlaces internos
// =========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });

    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      new bootstrap.Collapse(navbarCollapse).toggle();
    }
  });
});

// =========================
// Validaciones
// =========================
function validarNombre(nombre) {
  return /^[a-zA-ZÀ-ÿ\s]{3,}$/.test(nombre.trim());
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validarFecha(fechaValor) {
  if (!fechaValor) return { valido: false, mensaje: 'Debes indicar tu fecha de nacimiento' };

  const today = new Date();
  const fechaNac = new Date(fechaValor);
  let edad = today.getFullYear() - fechaNac.getFullYear();
  const m = today.getMonth() - fechaNac.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < fechaNac.getDate())) edad--;

  if (edad < 18) return { valido: false, mensaje: 'Debes ser mayor de 18 años' };
  return { valido: true, mensaje: '' };
}

function validarGenero() {
  const generos = document.getElementsByName('genero');
  return Array.from(generos).some(g => g.checked);
}

// =========================
// Aplicar clases Bootstrap
// =========================
function aplicarClase(input, valido) {
  if (valido) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
  } else {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
  }
}

// =========================
// Validación en tiempo real y al enviar
// =========================
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const nombre = document.getElementById('nombre');
  const email = document.getElementById('email');
  const fecha = document.getElementById('fechaNacimiento');
  const fechaFeedback = fecha.nextElementSibling; // invalid-feedback debajo del input
  const generoFeedback = document.querySelector('input[name="genero"]').closest('.mb-3').querySelector('.invalid-feedback');

  let validacionTiempoReal = false;

  function validarEnTiempoReal() {
    if (!validacionTiempoReal) return;

    aplicarClase(nombre, validarNombre(nombre.value));
    aplicarClase(email, validarEmail(email.value));

    const resultadoFecha = validarFecha(fecha.value);
    aplicarClase(fecha, resultadoFecha.valido);
    fechaFeedback.textContent = resultadoFecha.mensaje;

    if (validarGenero()) {
      generoFeedback.style.display = 'none';
    } else {
      generoFeedback.style.display = 'block';
    }
  }

  // Escuchadores de input
  nombre.addEventListener('input', validarEnTiempoReal);
  email.addEventListener('input', validarEnTiempoReal);
  fecha.addEventListener('change', validarEnTiempoReal);
  document.getElementsByName('genero').forEach(g => g.addEventListener('change', validarEnTiempoReal));

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    event.stopPropagation();

    validacionTiempoReal = true;

    let isValid = true;

    if (!validarNombre(nombre.value)) { aplicarClase(nombre, false); isValid = false; }
    if (!validarEmail(email.value)) { aplicarClase(email, false); isValid = false; }

    const resultadoFecha = validarFecha(fecha.value);
    aplicarClase(fecha, resultadoFecha.valido);
    fechaFeedback.textContent = resultadoFecha.mensaje;
    if (!resultadoFecha.valido) isValid = false;

    if (!validarGenero()) { generoFeedback.style.display = 'block'; isValid = false; }
    else { generoFeedback.style.display = 'none'; }

    if (isValid) {
      // Abrir modal de éxito
      const successModal = new bootstrap.Modal(document.getElementById('successModal'));
      successModal.show();

      form.reset();
      [nombre, email, fecha].forEach(el => el.classList.remove('is-valid','is-invalid'));
      generoFeedback.style.display = 'none';
      validacionTiempoReal = false;
    }
  });
});