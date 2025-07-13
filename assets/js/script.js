// reservas.js - Script completo para el sistema de reservas de CineFlash

document.addEventListener('DOMContentLoaded', function() {
  
  const modalReserva = document.getElementById('modalReserva');
  const modalConfirmacion = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
  const formReserva = document.getElementById('formReserva');
  const tarjetaInput = document.getElementById('tarjeta');
  const cvvInput = document.getElementById('cvv');

  //Configuración inicial de eventos
  function inicializarEventos() {
    // Evento para mostrar el modal de reserva
    modalReserva.addEventListener('show.bs.modal', manejarAperturaModalReserva);
    
    // Evento para enviar el formulario
    formReserva.addEventListener('submit', manejarEnvioFormulario);
    
    // Eventos para formatos especiales
    tarjetaInput.addEventListener('input', formatearNumeroTarjeta);
    cvvInput.addEventListener('input', validarCVV);
  }

  //Manejar apertura del modal de reserva
  function manejarAperturaModalReserva(event) {
    const button = event.relatedTarget;
    if (button && button.hasAttribute('data-pelicula')) {
      const peliculaSeleccionada = button.getAttribute('data-pelicula');
      seleccionarPeliculaEnDropdown(peliculaSeleccionada);
    }
  }

  //Seleccionar película automáticamente 
  function seleccionarPeliculaEnDropdown(pelicula) {
    const selectPelicula = document.getElementById('pelicula');
    for (let i = 0; i < selectPelicula.options.length; i++) {
      if (selectPelicula.options[i].value === pelicula) {
        selectPelicula.selectedIndex = i;
        break;
      }
    }
  }

  //envío del formulario
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

  //muestra resumen de la reserva
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
      <div class="alert alert-info">
        Presenta este código en taquilla: <strong>${generarCodigoReserva()}</strong>
      </div>
    `;
    
    document.getElementById('resumenReserva').innerHTML = resumenHTML;
    modalConfirmacion.show();
  }

  //Generar código de reserva aleatorio
  function generarCodigoReserva() {
    const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let codigo = '';
    for (let i = 0; i < 8; i++) {
      codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
  }

  //Cerrar modal y resetear formulario
  function cerrarModalYResetearFormulario() {
    bootstrap.Modal.getInstance(modalReserva).hide();
    formReserva.reset();
    formReserva.classList.remove('was-validated');
  }

  //Formatear número de tarjeta (espacios cada 4 dígitos)
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

  //Validar CVV (3 o 4 dígitos)
  function validarCVV(e) {
    this.value = this.value.replace(/\D/g, '').substring(0, 4);
  }

 
  inicializarEventos();
});