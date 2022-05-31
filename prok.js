function cargarIncidencias() {

    listaIncidencias = document.getElementById('incidencias');

    listaIncidencias.innerHTML = '';

    for (let index = 0; index < localStorage.length; index++) {
        inc = localStorage.getItem(`inc-${index}`);
        inc = JSON.parse(inc)[0];
        listaIncidencias.innerHTML += `
            <div class="incidencia">
                ${inc["nombre"]} | ${inc['descripcion']} | Fecha: ${inc['fecha']}
            </div>
        `;
    }

}

cargarIncidencias();


async function generarIncidencia(
    nombre = null,
    descripcion = null,
    ordenAveria = null,
    recibo = null,
    presupuesto = 0,
    factura = null,
    fecha = null,
    numeropuesto = null) {

    incidencia = [{
        nombre: nombre,
        descripcion: descripcion,
        ordenAveria: ordenAveria,
        recibo: recibo,
        presupuesto: presupuesto,
        factura: factura,
        fecha: fecha,
        numeropuesto: numeropuesto
    }];

    localStorage.setItem('inc-' + localStorage.length, JSON.stringify(incidencia));

    return console.log('[+]Incidencia Agregada!')
}


$('#subirIncidencia').click(function (event) {

    event.preventDefault();

    let nombre = document.getElementById('nombreIncidencia').value;
    let descripcion = document.getElementById('descripcionIncidencia').value;
    let ordenaveria = document.getElementById('ordenaveriaIncidencia').value;
    let recibo = document.getElementById('reciboIncidencia').value;
    let presupuesto = document.getElementById('presupuestoIncidencia').value;
    let factura = document.getElementById('facturaIncidencia').value;
    let fecha = document.getElementById('fechaIncidencia').value;
    let numpuesto = document.getElementById('numpuestoIncidencia').value;

    generarIncidencia(
        nombre, descripcion, ordenaveria, recibo, presupuesto, factura, fecha, numpuesto
    ).then(() => {
        cargarIncidencias();
    })

});

// console.log($('.incidencia'))

let inci = $('#incidencias div');
$('#buscador').keyup(function() {
    var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
    
    inci.show().filter(function() {
        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
        return !~text.indexOf(val);
    }).hide();
});