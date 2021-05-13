var General = General || {};
General.Enums = General.Enums || {};
General.Enums.TipoDatoBasico = {
    TipoRegistro: { ID: 1 },
    CalidadEntidad: { ID: 2 },
    AccionProceso: { ID: 3 },
    EstadoProceso: { ID: 4 },
    ActuacionJuridica: {
        ID:5,
        Alegato: { ID: 24 },
        Audiencia: { ID: 25 },
        Contestacion: { ID: 26 },
        Recurso: { ID: 27 },
        Sentencia: { ID: 28 },
        Seguimiento: { ID: 29 }
    },
    TipoActuacionJuridica: { ID: 6}
}

//Método que agrega las clases de datatable a una tabla
function buildDatatable(selector) {

    $(selector).each(function () {
        $(this).DataTable({
            destroy: true,
            "bDestroy": true,
            "ordering": false,
            "language": {
                "sProcessing": "Procesando...",
                "sLengthMenu": "Mostrar _MENU_ registros",
                "sZeroRecords": "No se encontraron resultados",
                "sEmptyTable": "Ningún dato disponible en esta tabla",
                "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                "sInfoPostFix": "",
                "sSearch": "Buscar:",
                "sUrl": "",
                "sInfoThousands": ",",
                "sLoadingRecords": "Cargando...",
                "oPaginate": {
                    "sFirst": "Primero",
                    "sLast": "Último",
                    "sNext": "Siguiente",
                    "sPrevious": "Anterior"
                },
                "oAria": {
                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                }
            }
        });
    });
}

//Método que agrega las clases de datatable a una tabla
function buildServerSideDatatable(selector, obj) {

    $(selector).DataTable({
        destroy: true,
        "bDestroy": true,
        "processing": true,
        "serverSide": true,
        "ajax": {
            url: "http://dc1:8111/procesosjuridico/_layouts/15/ProcesosJuridicos/ProcesosJuridicosServices.aspx/",
            type: 'POST',
            data: { QueryList: JSON.stringify(obj) },
            dataSrc: "data"
        },
        "columns": [
               { "data": "Notificacion", "name": "Notificacion" },
               { "data": "NumeroProceso", "name": "NumeroProceso" },
               { "data": "Demandantes", "name": "Demandantes" },
               { "data": "Accion", "name": "Accion" },
               { "data": "DepartamentoMunicipio", "name": "DepartamentoMunicipio" },
               { "data": "Estado", "name": "Estado" }
        ]
    });
}

//Limpia los registros de un Datatable
function limpiarDatatable(selector) {
    $(selector).each(function () {
        var table = $(this).DataTable();
        table.rows().remove().draw();
    });
}

//Método que permite quitar las clases del datatable
function EliminarTabla(Selector) {
    var a = $(Selector).dataTable()
    a.fnDestroy();
}

//Abre y cierra el contenido de los tabs
function showTab(tab, selector) {

    if (!$(tab).parent().hasClass('disabled')) {
        $('.tab-pane').removeClass('in active');
        $(tab).tab('show');
        $(selector).addClass('in active');
    }
}

//Crea el datepicker en los controles especificados
function datePicker(selectores) {
    $(selectores).each(function () {
        $(this).datepicker({
            format: "dd/mm/yyyy",
            language: "es",
            autoclose: true,
            todayHighlight: true
        });
    });
}
