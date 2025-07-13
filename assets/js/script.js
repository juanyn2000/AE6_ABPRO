document.addEventListener('DOMContentLoaded', function() {
  const modalReserva = document.getElementById('modalReserva');
  const modalConfirmacion = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
  const formReserva = document.getElementById('formReserva');
  const tarjetaInput = document.getElementById('tarjeta');
  const cvvInput = document.getElementById('cvv');

  function inicializarEventos() {
    modalReserva.addEventListener('show.bs.modal', manejarAperturaModalReserva);
    formReserva.addEventListener('submit', manejarEnvioFormulario);
    tarjetaInput.addEventListener('input', formatearNumeroTarjeta);
    cvvInput.addEventListener('input', validarCVV);
    
    // Nuevo evento para limpiar al cerrar confirmación
    document.getElementById('modalConfirmacion').addEventListener('hidden.bs.modal', function() {
      document.getElementById('resumenReserva').innerHTML = '';
    });
  }

  function manejarAperturaModalReserva(event) {
    const button = event.relatedTarget;
    if (button && button.hasAttribute('data-pelicula')) {
      const peliculaSeleccionada = button.getAttribute('data-pelicula');
      document.getElementById('pelicula').value = peliculaSeleccionada;
    }
  }

  function manejarEnvioFormulario(event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (formReserva.checkValidity()) {
      mostrarResumenReserva();
      cerrarModalYResetearFormulario();
    } else {
      formReserva.classList.add('was-validated');
    }
  }

  function mostrarResumenReserva() {
    const pelicula = document.getElementById('pelicula').value;
    const horario = document.getElementById('horario').value;
    const cantidad = document.getElementById('cantidad').value;
    const titular = document.getElementById('titular').value;
    const tarjeta = tarjetaInput.value;
    const ultimosDigitos = tarjeta.slice(-4).replace(/\s/g, '');

    const resumenHTML = `
      <div class="mb-3">
        <h6 class="fw-bold">Detalles de la Reserva</h6>
        <p><strong>Película:</strong> ${pelicula}</p>
        <p><strong>Horario:</strong> ${horario}</p>
        <p><strong>Asientos:</strong> ${cantidad}</p>
      </div>
      <div class="mb-3">
        <h6 class="fw-bold">Información de Pago</h6>
        <p><strong>Titular:</strong> ${titular}</p>
        <p><strong>Tarjeta:</strong> **** **** **** ${ultimosDigitos}</p>
      </div>
      <div class="alert alert-success">
        <i class="bi bi-check-circle-fill"></i> ¡Reserva confirmada correctamente!
      </div>
    `;
    
    document.getElementById('resumenReserva').innerHTML = resumenHTML;
    modalConfirmacion.show();
  }

  function cerrarModalYResetearFormulario() {
    bootstrap.Modal.getInstance(modalReserva).hide();
    formReserva.reset();
    formReserva.classList.remove('was-validated');
  }

  function formatearNumeroTarjeta(e) {
    let valor = this.value.replace(/\D/g, '');
    let valorFormateado = '';
    
    for (let i = 0; i < valor.length; i++) {
      if (i > 0 && i % 4 === 0) {
        valorFormateado += ' ';
      }
      valorFormateado += valor[i];
    }
    
    this.value = valorFormateado.substring(0, 19);
  }

  function validarCVV(e) {
    this.value = this.value.replace(/\D/g, '').substring(0, 4);
  }

  inicializarEventos();
});