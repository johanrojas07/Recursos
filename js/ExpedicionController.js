var ExpedicionController = {
    onReady: function () {
        Utils.Operations.InitializeDatePicker(".datepicker");
        Utils.Operations.InicializeDataTable(".table", null);
        $("#btnBorrarFiltros").click(ExpedicionController._EliminarFiltros);
        $("#btnBuscarSolicitudes").click(ExpedicionController.BuscarSolicitud);
        ExpedicionController.CargarDatosBasicos();
    },

    _EliminarFiltros: function () {
        $("input[name = txtDocumento]").val('');
        $('input:radio[name=tipoVinculacion]').prop('checked', false);
        $('select[name = lstDependencias]').prop('selectedIndex', 0);
        $('#txtSolicitudFechaInicio').val('');
        $('#txtSolicitudFechaFin').val('');
    },

    CargarDatosBasicos: function () {
        var obj = Utils.Operations.GetBasicObject('ConsultarDatosBasicos');
        Bext.Servicios.Ejecutar(obj, true, function (data) {

            if (data.Data.length > 0) {
                var lstDatosBasicos = data.Data;
                var lstDependencias = Utils.Operations.GetListFromArray(lstDatosBasicos, "IdTipoDatoBasico", Enums.TipoDatoBasico.Dependencia);
                Utils.Operations.PopulateSelect("#lstDependencias", lstDependencias, "IdDatoBasico", "Descripcion");
            }

            Modal.BootstrapDialog.Close();
        });
    },
    BuscarSolicitud: function () {

        var NumeroDocumento = ($("#txtDocumento").val() !== "") ? $("#txtDocumento").val() : null;
        var TipoVinculacion = null;
        if ($('input[name="tipoVinculacion"]').is(':checked')) {
            TipoVinculacion = parseInt($('input[name="tipoVinculacion"]:checked').val());
        }
        var Dependencia = ($("#lstDependencias").val() !== "") ? parseInt($("#lstDependencias").val()) : null;
        var FechaInicio = ($("#txtSolicitudFechaInicio").val() !== "") ? $("#txtSolicitudFechaInicio").val() : null;
        var FechaFin = ($("#txtSolicitudFechaFin").val() !== "") ? $("#txtSolicitudFechaFin").val() : null;

        var obj = Utils.Operations.GetBasicObject('ConsultarSolicitudesRutaAerea');

        obj.Item = {
            NumeroDocumento: NumeroDocumento,
            TipoVinculacion: TipoVinculacion,
            Dependencia: Dependencia,
            FechaInicio: FechaInicio,
            FechaFin: FechaFin,
        };

        Bext.Servicios.Ejecutar(obj, true, function (data) {
            debugger;
            if (data.Data.length > 0) {
                ExpedicionController.CargarTablaSolicitudes(data.Data);
                ExpedicionController._EliminarFiltros();
            } else {
                Utils.Operations.ClearDataTable("#tblGastosTerrestres");
            }
            Modal.BootstrapDialog.Close();
        });
    },

    CargarTablaSolicitudes: function(lista) {
        Utils.Operations.ClearDataTable("#tblGastosTerrestres");
        var table = $("#tblGastosTerrestres").DataTable();
        $.each(lista, function (index, item) {
            table.row.add([
                item.NombreCompleto,
                item.FechaInicio,
                item.FechaFinalizacion,
                item.ObjetoComision,
                '<button type="button" class="btn btn-default btn-xs" onclick = "ExpedicionController.OpcionesVuelos('+item.IdUsuario+ ","+item.IdSolicitud+')">Cargar Vuelos <i class="fa fa-external-link"></i</button></a>'
            ]).draw();
        });
    },

    OpcionesVuelos: function (IdUsuario,SolicitudId) {
        var user = {
            UserId: parseInt(IdUsuario),
            SolicitudId: parseInt(SolicitudId)
        }
        var userData = JSON.stringify(user);
        sessionStorage.setItem("UserData", userData);
        window.location.href = "OpcionesVuelo.aspx";
    },

}

$(function () {
    ExpedicionController.onReady();
});
