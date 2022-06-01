
function cargarIncidencias() {

    listaIncidencias = document.getElementById('incidencias-lista');

    listaIncidencias.innerHTML = "";

    for (let index = 0; index < localStorage.length; index++) {
        inc = localStorage.getItem(`inc-${index}`);
        inc = JSON.parse(inc)[0];
        listaIncidencias.innerHTML += `
            <tr class="incidencia" scope="col">
                ${inc["empresa"]} | ${inc['descripcion']} | Fecha: ${inc['fecha']}
                <button class="p-btn" onclick="vistaDetalladaIncidencia(${index})">Ver incidencia</button>
                <a href="#" class="p-btn-icon"><img src="img/trash.svg"></a>
            </tr>
        `;
    }

}

cargarIncidencias();

async function generarIncidencia(
    empresa, areadetrabajo, usuario, direccion, telefono, hogar, fechadeentrada, fechadesalida,
    
    equipo, modelo, serial, componentes,
    
    averiadeequipo,
    
    reparaciondelequipo) {

    incidencia = [{
        // datos generales
        empresa: empresa,
        areadetrabajo: areadetrabajo,
        usuario: usuario,
        direccion: direccion,
        telefono: telefono,
        hogar: hogar,
        fechadeentrada: fechadeentrada,
        fechadesalida: fechadesalida,

        //orden de trabajo
        equipo: equipo,
        modelo: modelo,
        serial: serial,
        componentes: componentes,

        //averia del equipo
        averiadeequipo: averiadeequipo,
        reparaciondelequipo: reparaciondelequipo,
    }];

    localStorage.setItem('inc-' + localStorage.length, JSON.stringify(incidencia));

    return console.log('[+]Incidencia Agregada!')
}


$('#subirIncidencia').click(function (event) {

    event.preventDefault();

    /* Datos generales */
    let empresa = document.getElementById('empresa').value;
    let areadetrabajo = document.getElementById('areadetrabajo').value;
    let usuario = document.getElementById('usuario').value;
    let direccion = document.getElementById('direccion').value;
    let telefono = document.getElementById('telefono').value;
    let hogar = document.getElementById('hogar').value;
    let fechadeentrada = document.getElementById('fechadeentrada').value;
    let fechadesalida = document.getElementById('fechadesalida').value;

    /** Orden de trabajo */
    let equipo = document.getElementById('equipo').value;
    let modelo = document.getElementById('modelo').value;
    let serial = document.getElementById('serial').value;
    let componentes = document.getElementById('componentes').value;

    /** Averia de equipo */
    let  averiadeequipo = document.getElementById('averiadelequipo').value;

    /** Reparacion del equipo */
    let reparacion = document.getElementById('reparaciondelequipo').value;

    generarIncidencia(
        empresa, areadetrabajo, usuario, direccion, telefono, hogar, fechadeentrada, fechadesalida, averiadeequipo, reparacion, equipo, modelo, serial, componentes
    ).then(() => {
        document.getElementById('form-inc').setAttribute('hidden', true);
        document.getElementById('main-section').removeAttribute('hidden');
        cargarIncidencias();
    })

});

let inci = $('#incidencias div');
$('#buscador').keyup(function() {
    var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
    
    inci.show().filter(function() {
        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
        return !~text.indexOf(val);
    }).hide();
});

async function vistaDetalladaIncidencia(numIncidencia){
    
    place = document.getElementById('incidencia-detallada');

    let inc = localStorage.getItem(`inc-${numIncidencia}`);
    inc = JSON.parse(inc)[0];

    place.innerHTML = `
   
        <h2> ${inc["nombre"]} « ${inc["fecha"]} </h2>
        <hr>
        <p>
        ${inc["descripcion"]} <br>
        Orden de avería: ${inc["ordenAveria"]} <br>
        Recibo: ${inc['recibo']} <br>
        Presupuesto: ${inc["presupuesto"]}€ <br>
        Numero Puesto: ${inc["numeropuesto"]} <br>

        </p>

    `;
}

$('#abrir-formulario').click(function(event){
    document.getElementById('form-inc').removeAttribute("hidden");
    document.getElementById('main-section').setAttribute("hidden", true);
})