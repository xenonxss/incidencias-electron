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
    listaIncidencias.innerHTML = `
    <tr class="inc-header">
        <th>Nombre Empresa y descripción:<th>
        <th></th>
        <th></th>
    <tr>`;

    incidencias = getAll();

    incidencias.forEach(element => {
        console.log(element)
        element = JSON.parse(element);


        listaIncidencias.innerHTML += `
        
        <tr class="incidencia" scope="col">
            <th>${element['empresa']}</th>
            <th>${element['averiadeequipo']}</th>
            <th><a id="delete-inc" class="p-btn-icon" onclick="borrarIncidencia('${element['uid']}')"><img src="img/trash.svg"></a></th>
            <th><button class="p-btn" onclick="vistaDetalladaIncidencia('${element['uid']}')">Ver incidencia</button></th>
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
        "reparaciondelequipo": reparaciondelequipo,

        //material de reparacion
        // "componentes": [componentes],
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
        empresa, areadetrabajo, usuario, direccion, telefono, hogar, fechadeentrada, fechadesalida,
        equipo, modelo, serial, componentes,
        averiadeequipo,
        reparacion
    ).then(() => {
        form = document.getElementById('form-inc')
        form.classList.remove('aparecer');
        form.classList.add('desaparecer');
        setTimeout(() => {
            form.setAttribute('hidden', true);
            location.reload();

        }, 800);
    })
});

let inci = $('#incidencias-lista tr');
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
            <h2><strong> ${element["empresa"]} ›› ${element["areadetrabajo"]}</strong> </h2>
            <hr>
            <p>
            Orden de avería: ${element["averiadeequipo"]} <br>
            Usuario: ${element['usuario']} <br>
            Dirección: ${element['direccion']} <br>
            Teléfono: ${element['telefono']} <br>
            Hogar: ${element['hogar']} <br>
            Fecha de Entrada: ${element['fechadeentrada']} <br>
            Fecha de Salida: ${element['fechadesalida']} <br>
            </p>
            <hr>
            <p>
            Componente:  <br>
            Empresa:    <br>
            Fecha   <br>
            Precio: <br>
            Unidad: <br>
            </p>
            `;

            return console.log(`[+]Mostrando información de la incidencia ${JSON.stringify(element)}`)
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
        if (element['uid'] == 'MY3ytXkq7ztjlcbj4tOiP7sSEdUOu2Pk') {
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
    form = document.getElementById('form-inc')
    console.log(form)
    form.removeAttribute("hidden");
    console.log(form)
    form.classList.remove('desaparecer');
    form.classList.add('aparecer');
    console.log(form)
    // document.getElementById('main-section').setAttribute("hidden", true);
})

$('#limpiarCampos').click(function (event) {
    $('#form-inc')[0].reset();
})

$('#cancelarForm').click(function (event) {
    form = document.getElementById('form-inc')
    form.classList.add('desaparecer');
    setTimeout(() => {
        form.setAttribute('hidden', true);
    }, 800);

    form.classList.add('desaparecer');
});


listaIncidencias = document.getElementById('incidencia-detallada')
listaIncidencias.innerHTML += `
        
<h2> Selecciona una incidencia! </h2>
<hr>
<p>
<img src="img/linux.png" style="width: 100%;">
</p><hr>`;

function validate() {
    var errorDiv = document.getElementById("errorDiv"),
        regex = /^[a-z0-9]+$/,
        str = document.getElementById("inputString").value;

    if ((str.length > 4) && (str.length < 10) && regex.test(str)) {
        errorDiv.innerHTML = "Fine string";
        return true;
    }
    else {
        errorDiv.innerHTML = "4 to 10 alphanumerical characters only";
        return false;
    }
}

function showTime() {
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds(); // 0 - 59
    var session = "AM";

    if (h == 0) {
        h = 12;
    }

    if (h > 12) {
        h = h - 12;
        session = "PM";
    }

    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;

    var time = h + ":" + m + ":" + s + " " + session;
    document.getElementById("MyClockDisplay").innerText = time;
    document.getElementById("MyClockDisplay").textContent = time;

    setTimeout(showTime, 1000);

}

// showTime();