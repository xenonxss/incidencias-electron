function getAll() {
    let get = localStorage.getItem('inc');
    function replaceAll(string, search, replace) {
        return string.split(search).join(replace);
    }

    incidencias_todas = replaceAll(get, ']', '');
    incidencias_todas = incidencias_todas.split('[');
    incidencias_todas.shift();

    return incidencias_todas;
}

function cargarIncidencias() {

    listaIncidencias = document.getElementById('incidencias-lista');
    listaIncidencias.innerHTML = "";

    incidencias = getAll();

    incidencias.forEach(element => {
        
        element = JSON.parse(element);

        listaIncidencias.innerHTML += `
        <tr class="incidencia" scope="col">
            ${element['empresa']} | ${element['averiadeequipo']}
            <a id="delete-inc" class="p-btn-icon" onclick="borrarIncidencia('${element['uid']}')"><img src="img/trash.svg"></a>
            <button class="p-btn" onclick="vistaDetalladaIncidencia('${element['uid']}')">Ver incidencia</button>
        </tr>`;
    });
}

if (localStorage.getItem('inc') == null) {
    console.log('[i]No hay ninguna incidencia almacenada')
} else {
    cargarIncidencias();
}

async function generarIncidencia(empresa, areadetrabajo, usuario, direccion, telefono, hogar, fechadeentrada, fechadesalida,
    equipo, modelo, serial, componentes,
    averiadeequipo,
    reparaciondelequipo) {

    function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

    incidencia = [{
        // datos generales
        "uid": makeid(32).toString(),
        "empresa": empresa,
        "areadetrabajo": areadetrabajo,
        "usuario": usuario,
        "direccion": direccion,
        "telefono": telefono,
        "hogar": hogar,
        "fechadeentrada": fechadeentrada,
        "fechadesalida": fechadesalida,

        //orden de trabajo
        "equipo": equipo,
        "modelo": modelo,
        "serial": serial,
        "componentes": componentes,

        //averia del equipo
        "averiadeequipo": averiadeequipo,
        "reparaciondelequipo": reparaciondelequipo
    }];

    old = localStorage.getItem('inc');
    if (old == null) { old = ""; }

    localStorage.removeItem('inc')
    localStorage.setItem('inc', old.concat(JSON.stringify(incidencia)));

    return console.log('[+]Incidencia registrada correctamente!')
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
    let averiadeequipo = document.getElementById('averiadelequipo').value;
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
$('#buscador').keyup(function () {
    var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
    inci.show().filter(function () {
        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
        return !~text.indexOf(val);
    }).hide();
});

async function vistaDetalladaIncidencia(numIncidencia) {

    place = document.getElementById('incidencia-detallada');
    incidencias = getAll();

    incidencias.forEach(element => {
        element = JSON.parse(element);

        if (element['uid'] == numIncidencia) {
            place.innerHTML = `
            <h2> ${element["empresa"]} « ${element["fecha"]} </h2>
            <hr>
            <p>
            Orden de avería: ${element["ordenAveria"]} <br>
            Recibo: ${element['recibo']} <br>
            Presupuesto: ${element["presupuesto"]}€ <br>
            Numero Puesto: ${element["numeropuesto"]} <br>
            </p>`;

            return console.log(`[+]Mostrando información de la incidencia ${element['uid']}`)
        } else {
            console.log(`[-]No se ha encontrado la incidencia ${numIncidencia}`)
        }
    });
}

async function borrarIncidencia(numIncidencia) {
    incidencias = getAll();
    rejoinFinal = "";
    incidencias.forEach(element => {
        element = JSON.parse(element);
        // console.log(element['uid'])
        if (element['uid'] == numIncidencia) {
            console.log(`[-]Usted desea eliminar la incidencia ${element['nombre']} de uid: ${element['uid']}`)
        } else {
            rejoin = "[" + JSON.stringify(element) + "]";
            rejoinFinal = rejoinFinal + rejoin;
        }
    });

    localStorage.removeItem('inc');
    localStorage.setItem('inc', rejoinFinal)
    cargarIncidencias();
}

$('#abrir-formulario').click(function (event) {
    document.getElementById('form-inc').removeAttribute("hidden");
    document.getElementById('main-section').setAttribute("hidden", true);
})