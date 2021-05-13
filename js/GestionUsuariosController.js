var idUsuario = null;
var currentUser = null;
var GestionUsuariosController = {
    onReady: function () {
		Utils.Operations.InicializeDataTable(".table", null);
		$("#btnQuitarFiltros").click(GestionUsuariosController._EliminarFiltros);
		$("#btnBuscarUsuario").click(GestionUsuariosController.BuscarUsuario);
		$('#btnCrearUusuario').click(GestionUsuariosController.CrearUsuario);
		GestionUsuariosController.CargarDatosBasicos();
		GestionUsuariosController.BuscarUsuario();

	},
	_EliminarFiltros: function () {
	    $("#txtDocumento").val("");
	    $("#txtNombre").val("");
	    $('input[name="tipoVinculacion"]').prop('checked',false);
	    $("#lstDependencias").val("");
	    $("#lstCargos").val("");
	},
	CargarDatosBasicos: function () {
	    var obj = Utils.Operations.GetBasicObject('ConsultarDatosBasicos');
	    Bext.Servicios.Ejecutar(obj, true, function (data) {

	        if (data.Data.length > 0) {
	            var lstDatosBasicos = data.Data;
	            var lstDependencias = Utils.Operations.GetListFromArray(lstDatosBasicos, "IdTipoDatoBasico", Enums.TipoDatoBasico.Dependencia);
	            var lstCargos = Utils.Operations.GetListFromArray(lstDatosBasicos, "IdTipoDatoBasico", Enums.TipoDatoBasico.Cargo);

	            Utils.Operations.PopulateSelect("#lstDependencias", lstDependencias, "IdDatoBasico", "Descripcion");
	            Utils.Operations.PopulateSelect("#lstCargos", lstCargos, "IdDatoBasico", "Descripcion");
	            //$("#lstCargos").append('<option value="otro">OTRO</option>');
	        }
	        Modal.BootstrapDialog.Close();
	    });
	},
	BuscarUsuario: function () {

		var NumeroDocumento = $("#txtDocumento").val();
		var nombre = $("#txtNombre").val();
		var TipoVinculacion = null;
		if ($('input[name="tipoVinculacion"]').is(':checked')) {
		    TipoVinculacion = parseInt($('input[name="tipoVinculacion"]:checked').val());
		}
		var Dependencia = ($("#lstDependencias").val() !== "") ? parseInt($("#lstDependencias").val()) : null;
		var Cargo = ($("#lstCargos").val() !== "") ? parseInt($("#lstCargos").val()) : null;
		var obj = Utils.Operations.GetBasicObject('ConsultarUsuarios');
		obj.Item = {
			NumeroDocumento:(NumeroDocumento !== "") ? NumeroDocumento : null,
			Nombres: (nombre != "") ? nombre : null,
			TipoVinculacion: TipoVinculacion,
			Dependencia: Dependencia,
			Cargo: Cargo
		};

		Bext.Servicios.Ejecutar(obj, true, function (data) {
		    debugger;
		    if (data.Data.length > 0) {
		        GestionUsuariosController.CargarTablaUsuarios(data.Data);
		    } else {
		        Utils.Operations.ClearDataTable("#tblGestionUsuarios");
		    }
		    Modal.BootstrapDialog.Close();
		});
	},
	CargarTablaUsuarios: function (lista) {

	    Utils.Operations.ClearDataTable("#tblGestionUsuarios");
	    var table = $("#tblGestionUsuarios").DataTable();
	    $.each(lista, function (index, item) {
	        table.row.add([
                    item.NombreCompleto,
                    item.NumeroDocumento,
                    item.Dependencia,
                    item.Cargo,
                    item.TipoVinculacion,
                    '<button type="button" class="btn btn-default btn-xs" onclick="GestionUsuariosController.CrearSolicitudUsuario(' + item.IdUsuario + ')">Crear Solicitud <i class="fa fa-external-link"></i></button>',
                    '<button type="button" class="btn btn-default btn-xs" onclick="GestionUsuariosController.EditarUsuario(' + item.IdUsuario + ')">Editar Usuario <i class="fa fa-external-link"></i></button>'
	        ]).draw();
	    });
	},
	CrearSolicitudUsuario: function (usuarioId) {
	    var user = {
	        UserId: parseInt(usuarioId),
	        SolicitudId: null
	    }
	    var userData = JSON.stringify(user);
	    sessionStorage.setItem("UserData", userData);
	    window.location.href = "RegistroSolicitud.aspx";
	},
    CrearUsuario: function(){
        var user = {
            UsuarioNuevo : true
        }
        var userData = JSON.stringify(user);
        sessionStorage.setItem("UserData", userData);
        window.location.href = "RegistroUsuario.aspx";
    },
    EditarUsuario: function (usuarioId) {
        var user = {
            UserId: parseInt(usuarioId),
        }
        var userData = JSON.stringify(user);
        sessionStorage.setItem("UserData", userData);
        window.location.href = "RegistroUsuario.aspx";
    }
}

$(function(){
	GestionUsuariosController.onReady();
});