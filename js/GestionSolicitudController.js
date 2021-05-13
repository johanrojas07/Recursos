var estadoSolicitud = null;
var dependencia = null;
var currentUser = null;
var userDbId = null;
var GestionSolicitudController = {
    onReady: function () {
        Utils.Operations.InitializeDatePicker(".datepicker");
        Utils.Operations.InicializeDataTable(".table", null);
        $("#btnBorrarFiltros").click(GestionSolicitudController._EliminarFiltros);
        $("#btnBuscarSolicitudes").click(GestionSolicitudController.BuscarSolicitudes);
        GestionSolicitudController.CargarDatosBasicos();
    },
    _EliminarFiltros: function () {
        $("#txtDocumento").val('');
        $('input[name="tipoVinculacion"]').prop('checked', false);
        $("#lstDependencias").val("");
        $("#txtSolicitudFechaInicio").val("");
        $("#txtSolicitudFechaFin").val("");
    },
    CargarDatosBasicos: function () {
        var obj = Utils.Operations.GetBasicObject('ConsultarDatosBasicos');
        Bext.Servicios.Ejecutar(obj, true, function (data) {

            if (data.Data.length > 0) {
                var lstDatosBasicos = data.Data;
                var lstDependencias = Utils.Operations.GetListFromArray(lstDatosBasicos, "IdTipoDatoBasico", Enums.TipoDatoBasico.Dependencia);
                Utils.Operations.PopulateSelect("#lstDependencias", lstDependencias, "IdDatoBasico", "Descripcion");
                var lstEstados = Utils.Operations.GetListFromArray(lstDatosBasicos, "IdTipoDatoBasico", Enums.TipoDatoBasico.EstadoSolicitud);
                Utils.Operations.PopulateSelect("#selectEstados", lstEstados, "IdDatoBasico", "Descripcion");
            }
            GestionSolicitudController.GetUserInfo();
        });
    },
    GetUserInfo: function () {
        var obj = {
            UrlSite: _spPageContextInfo.webAbsoluteUrl,
            RowLimit: '0',
            AddFileUrl: false,
            GetUserInfo: true
        };

        Bext.Servicios.Ejecutar(obj, true, function (data) {
            debugger;
            if (data.Data.length > 0) {
                currentUser = data.Data[0];
                GestionSolicitudController.CargarUsuario(currentUser.ID);
            } else {
				alert('Los datos de la sesión de usuario no fueron cargados.')
                //Modal.BootstrapDialog.Warning('Perfil de usuario', 'Los datos de la sesi�n de usuario no fueron cargados.');
            }
        });
    },
    CargarUsuario: function (SPId) {
        var obj = Utils.Operations.GetBasicObject('ObtenerUsuario');
        obj.Item = {
            SpId: SPId,
            IdUsuario: null,
            NumeroDocumento: null
        }

        Bext.Servicios.Ejecutar(obj, true, function (data) {
            debugger;
            // Mis Solicitudes
            if (sessionStorage["MisSolicitudes"] == "True") {
                estadoSolicitud = null;
                GestionSolicitudController.FiltroMisSolicitudes(data);
            } else {

                if (currentUser.Groups.indexOf(Enums.GruposUsuario.AdminComisiones) > -1) {
                    estadoSolicitud = null;
                    Modal.BootstrapDialog.Close();
                } else if (currentUser.Groups.indexOf(Enums.GruposUsuario.MultiUsuario) > -1) {
                    estadoSolicitud = null;
                    Modal.BootstrapDialog.Close();
                } else if (currentUser.Groups.indexOf(Enums.GruposUsuario.SecretarioGeneral) > -1) {
                    if (sessionStorage["estado"] == "null") {
                        estadoSolicitud = null
                    } else {
                        estadoSolicitud = Enums.EstadoSolicitud.PendienteAprobacionSecretario;
                    }
                    Modal.BootstrapDialog.Close();
                } else if (currentUser.Groups.indexOf(Enums.GruposUsuario.TalentoHumano) > -1) {
                    if (sessionStorage["estado"] == "null") {
                        estadoSolicitud = null;
                    } else {
                        estadoSolicitud = Enums.EstadoSolicitud.AprobadoSecretario;
                    }
                    Modal.BootstrapDialog.Close();
                } else if (currentUser.Groups.indexOf(Enums.GruposUsuario.JefeArea) > -1) {
                    if (sessionStorage["estado"] == "null") {
                        estadoSolicitud = null;
                    } else {
                        estadoSolicitud = Enums.EstadoSolicitud.PendienteAprobacionJefeArea;
                    }

                    dependencia = data.Data[0].IdDependencia;
                    $("#divDependencia").hide();
                    Modal.BootstrapDialog.Close();
                } else {
                    //Mis solicitudes
                    GestionSolicitudController.FiltroMisSolicitudes(data);
                }
            }

            //Ocultar o mostrar Filtro por Estado 
            if (estadoSolicitud != null) {
                $("#divEstado").hide();
            }

            GestionSolicitudController.BuscarSolicitudes();
        });
    },
    _ValidarBusquedaSolicitudes: function () {
        if (sessionStorage["IdUsuario"] !== null && sessionStorage["IdUsuario"] !== undefined) {
            userDbId = parseInt(sessionStorage["IdUsuario"]);
        }
        sessionStorage.removeItem("IdUsuario");
    },
    FiltroMisSolicitudes: function (data) {
        $("#filtroAdministradores").hide();
        if (data.Data.length !== 0) {

            userDbId = data.Data[0].IdUsuario;
            Modal.BootstrapDialog.Close();
        } else {
            buttons = [{
                label: 'Aceptar', action: function (dialogRef) {
                    dialogRef.close();
                    window.location.href = "RegistroUsuario.aspx";
                }
            }];
            var lnk = "<a href='RegistroUsuario.aspx'>Registro de usuario</a>";
			alert('Señor usuario, usted no se encuentra registrado en el sistema de comisiones, por lo tanto no podra ver la información de esta página, por favor registre sus datos ingresando por el siguiente enlace. ' + lnk)
            //Modal.BootstrapDialog.Warning('�Atenci�n!', '<p>Se�or usuario, usted no se encuentra registrado en el sistema de comisiones, por lo tanto no podr� ver la informaci�n de �sta p�gina, por favor registre sus datos ingresando por el siguiente enlace.</p>' + lnk, buttons);
        }
    },
    BuscarSolicitudes: function () {

        GestionSolicitudController._ValidarBusquedaSolicitudes();
        var NumeroDocumento = ($("#txtDocumento").val() !== "") ? $("#txtDocumento").val() : null;
        var TipoVinculacion = null;
        if ($('input[name="tipoVinculacion"]').is(':checked')) {
            TipoVinculacion = parseInt($('input[name="tipoVinculacion"]:checked').val());
        }
        if (dependencia == null) {
            var Dependencia = ($("#lstDependencias").val() !== "") ? parseInt($("#lstDependencias").val()) : null;
        } else {
            Dependencia = parseInt(dependencia);
        }

        //Obtener valor del filtro Estado
        var _estadoSolicitud = null;
        if (estadoSolicitud == null) {
            _estadoSolicitud = ($("#selectEstados").val() !== "") ? parseInt($("#selectEstados").val()) : null;
        } else {
            _estadoSolicitud = parseInt(estadoSolicitud);
        }

        var FechaInicio = ($("#txtSolicitudFechaInicio").val() !== "") ? $("#txtSolicitudFechaInicio").val() : null;
        var FechaFin = ($("#txtSolicitudFechaFin").val() !== "") ? $("#txtSolicitudFechaFin").val() : null;

        var obj = Utils.Operations.GetBasicObject('ConsultarSolicitudes');
        obj.Item = {
            NumeroDocumento: NumeroDocumento,
            IdUsuario: userDbId,
            TipoVinculacion: TipoVinculacion,
            Dependencia: Dependencia,
            FechaInicio: FechaInicio,
            FechaFin: FechaFin,
            Estado: _estadoSolicitud
        };

        Bext.Servicios.Ejecutar(obj, true, function (data) {
            debugger;
            if (data.Data.length > 0) {
                GestionSolicitudController.CargarTablaSolicitudes(data.Data);
                Modal.BootstrapDialog.Close();
            } else {
                Utils.Operations.ClearDataTable("#tblGestionSolicitudes");
				alert('No se encontró el listado de solicitudes.');
				Modal.BootstrapDialog.Close();
                //Modal.BootstrapDialog.Ok('Gesti\u00F3n de solicitudes', '<p>No se encontr\u00F3 el listado de solicitudes.</p>');
            }
        });
        sessionStorage.removeItem("estado");
    },
    CargarTablaSolicitudes: function (lista) {

        Utils.Operations.ClearDataTable("#tblGestionSolicitudes");
        var table = $("#tblGestionSolicitudes").DataTable();
        $.each(lista, function (index, item) {
            table.row.add([
                item.IdSolicitud,
                item.NombreCompleto,
                item.FechaInicio,
                item.FechaFinalizacion,
                item.Estado,
                item.ObjetoComision,
                '<button type="button" class="btn btn-default btn-xs" onclick="GestionSolicitudController.VerSolicitud(' + item.IdSolicitud + ',' + item.IdUsuario + ')">Ver solicitud <i class="fa fa-external-link"></i></button>',
                item.Justificacion
            ]).draw();
        });
    },
    VerSolicitud: function (solicitudId, usuarioId) {
        var user = {
            UserId: parseInt(usuarioId),
            SolicitudId: parseInt(solicitudId)
        }
        var userData = JSON.stringify(user);
        sessionStorage.setItem("UserData", userData);
        window.location.href = "RegistroSolicitud.aspx";
    }
}

$(function () {
    GestionSolicitudController.onReady();
});
