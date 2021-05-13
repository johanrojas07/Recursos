var currentUser = null;
var idUsuario = null;

var InicioController = {
    onReady: function () {
        InicioController._GetUserInfo();
    },

    _GetUserInfo: function () {
        var obj = {
            UrlSite: _spPageContextInfo.webAbsoluteUrl,
            RowLimit: '0',
            AddFileUrl: false,
            GetUserInfo: true
        };

        Bext.Servicios.Ejecutar(obj, true, function (data) {
            if (data.Data.length > 0) {
                currentUser = data.Data[0];
                InicioController.CargarUsuario(currentUser.ID, null, null);
            }
        });
    },



    CargarUsuario: function (spid) {
        var obj = Utils.Operations.GetBasicObject('ObtenerUsuario');
        obj.Item = {
            SpId: spid,
            IdUsuario: null,
            NumeroDocumento: null
        }

        Bext.Servicios.Ejecutar(obj, true, function (data) {

            if (data.Data.length !== 0) {
                $('#btnVerSolicitudes').show();
                $('#btnNuevaSolicitud').show();
                idUsuario = data.Data[0].IdUsuario;
            } else {
                $('#btnVerSolicitudes').hide();
                $('#btnNuevaSolicitud').hide();
            }

            if (currentUser.Groups.indexOf(Enums.GruposUsuario.AdminComisiones) > -1) {
                $('#btnPerfil').show();
                $('#btnVerSolicitudes').show();
                $('#btnGestionUsuarios').show();
                $('#btnGestionSolicitudes').show();
                Modal.BootstrapDialog.Close();
            } else if (currentUser.Groups.indexOf(Enums.GruposUsuario.MultiUsuario) > -1) {
                $('#btnPerfil').show();
                $('#btnVerSolicitudes').show();
                $('#btnGestionUsuarios').show();

                $('#btnGestionSolicitudes').show();
                Modal.BootstrapDialog.Close();
            } else if (currentUser.Groups.indexOf(Enums.GruposUsuario.SecretarioGeneral) > -1) {
                $('#btnPerfil').show();
                $('#btnVerSolicitudes').show();
                $('#btnGestionUsuarios').hide();
                $('#btnGestionSolicitudes').show();
                Modal.BootstrapDialog.Close();
            } else if (currentUser.Groups.indexOf(Enums.GruposUsuario.TalentoHumano) > -1) {
                $('#btnPerfil').show();
                $('#btnVerSolicitudes').show();
                $('#btnGestionUsuarios').show();
                $('#btnGestionSolicitudes').show();
                Modal.BootstrapDialog.Close();
            } else if (currentUser.Groups.indexOf(Enums.GruposUsuario.JefeArea) > -1) {
                $('#btnPerfil').show();
                $('#btnVerSolicitudes').show();
                $('#btnGestionUsuarios').hide();
                $('#btnGestionSolicitudes').show();
                Modal.BootstrapDialog.Close();
            } else {
                $('#btnPerfil').show();
                $('#btnGestionUsuarios').hide();
                $('#btnGestionSolicitudes').hide();
                Modal.BootstrapDialog.Close();
            }
            Modal.BootstrapDialog.Close();
        });
    },

    redirect: function (btn) {
        switch (btn.id) {
            case 'btnPerfil':
                window.location.href = "/Comisiones/Paginas/RegistroUsuario.aspx";
                break;
            case 'btnVerSolicitudes':
                if (idUsuario !== null) {
                    sessionStorage.setItem("IdUsuario", idUsuario);
                    sessionStorage.setItem("estado", "null");
                    sessionStorage.setItem("MisSolicitudes", "True");
                }
                window.location.href = "/Comisiones/Paginas/GestionSolicitud.aspx";
                break;
            case 'btnGestionUsuarios':
                window.location.href = "/Comisiones/Paginas/GestionUsuarios.aspx";

                break;
            case 'btnGestionSolicitudes':
                window.location.href = "/Comisiones/Paginas/GestionSolicitud.aspx";
                sessionStorage.setItem("MisSolicitudes", "False");
                break;
            case 'btnNuevaSolicitud':
                if (idUsuario !== null) {
                    var user = {
                        UserId: parseInt(idUsuario),
                        SolicitudId: null
                    }
                    var userData = JSON.stringify(user);
                    sessionStorage.setItem("UserData", userData);
                    window.location.href = "/Comisiones/Paginas/RegistroSolicitud.aspx";
                }
                break;
        }
    }
}

$(function () {
    InicioController.onReady();
});