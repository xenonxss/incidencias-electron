
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
    listaIncidencias.innerHTML = '';

    incidencias = getAll();

    incidencias.forEach(element => {
        element = JSON.parse(element);
        listaIncidencias.innerHTML += `
        <tr class="incidencia" scope="col">
            <td class="t">${element['empresa']}</td>
            <td class="t"><strong>${element['equipo']}</strong> → ${element['averiadeequipo']}</td>
            <td colspan="3" class="b">
                <a id="delete-inc" class="p-btn" onclick="borrarIncidencia('${element['uid']}', this.parentElement.parentElement)"><img src="img/trash.svg"></a>
                <button class="p-btn" onclick="imprimirInc('${element['uid']}')"><img src="img/printer.svg">
                <button class="p-btn" onclick="vistaDetalladaIncidencia('${element['uid']}')"><img src="img/eye.svg"></button>
                <button class="p-btn" onclick="editarIncidencia('${element['uid']}')"><img src="img/edit-3.svg"></button>
            </td>
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
        }, 800);

        cargarIncidencias();

    })
});

let inci = $('#incidencias-lista tr');
$('#buscador').keyup(function () {
    var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
    inci.show().filter(function () {
        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
        console.log(document.getElementById('incidencias-lista').innerHTML)
        return !~text.indexOf(val);
    }).hide();
});

async function vistaDetalladaIncidencia(numIncidencia) {

    let place = document.getElementById('incidencia-detallada');
    let incidencias = getAll();

    incidencias.forEach(element => {
        element = JSON.parse(element);
        if (element['uid'] == numIncidencia) {
            place.innerHTML = `
            <h2><strong> ${element["empresa"]}  / ${element["areadetrabajo"]}</strong> </h2>
            <p>
            <strong>Datos Generales</strong><br>
            Orden de avería: ${element["averiadeequipo"]} <br>
            Usuario: ${element['usuario']} <br>
            Dirección: ${element['direccion']} <br>
            Teléfono: ${element['telefono']} <br>
            Hogar: ${element['hogar']} <br>
            Fecha Entrada y Salida: ${element['fechadeentrada']} - ${element['fechadesalida']} <br>
            Equipo: ${element['equipo']}<br>
            Modelo: ${element['modelo']}<br>
            Serial: ${element['serial']}<br>
            Componentes: ${element['componentes']}
            </p>`;

            localStorage.setItem("current-inc", JSON.stringify(element));
        }
    });

    return console.log(`[+]Informacion detallada cargada`);
}

async function borrarIncidencia(numIncidencia, htmlelement) {
    incidencias = getAll();
    rejoinFinal = "";
    incidencias.forEach(element => {
        element = JSON.parse(element);

        if (element['uid'] == numIncidencia) {
            console.log(`[-]Usted desea eliminar la incidencia ${element['nombre']} de uid: ${element['uid']}`)
        } else {
            rejoin = "[" + JSON.stringify(element) + "]";
            rejoinFinal = rejoinFinal + rejoin;
        }
    });

    localStorage.removeItem('inc');
    localStorage.setItem('inc', rejoinFinal);

    console.log(htmlelement)
    htmlelement.classList.add('slide-paladerecha');

    setTimeout(() => {
        cargarIncidencias();
    }, 800);
}

$('#abrir-formulario').click(function (event) {
    form = document.getElementById('form-inc')
    console.log(form)
    form.removeAttribute("hidden");
    console.log(form)
    form.classList.remove('desaparecer');
    form.classList.add('aparecer');
    console.log(form)
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

<p>
<img src="img/linux.png" style="width: 100%;">
</p>`;

function imprimirInc(inc) {

    let allInc = getAll()

    allInc.forEach(element => {
        element = JSON.parse(element);
        console.log(element)
        if (element['uid'] == inc) {
            localStorage.setItem('current-inc', JSON.stringify(element));
            window.location.replace('printincidencia.html');
        } else {
            console.log('a')
        }
    });

}
