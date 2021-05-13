var lstVuelos = [];
var contadorId = 0;
var lstRutaAerea = [];

var OpcionesVueloController = {
    onReady: function () {
        //$("input[name='tipoVinculacion']").click(OpcionesVueloController._ValidarTipoVinculacion);
        $("input[name='seleccionVuelo']").click(OpcionesVueloController._ValidarSeleccion);
        $("#btnAgregar").click(OpcionesVueloController._ValidarDatosVuelo);
        $("#btnGuardar").click(OpcionesVueloController.GuardarOpcionVuelo);
        Utils.Operations.InitializeDatePicker(".datepicker", true);
        Utils.Operations.FormatCurrency('.currency');
        Utils.Operations.InicializeDataTable(".table", null);

        OpcionesVueloController._ValidarPerfilActual();
        OpcionesVueloController._CargarAerolineas();
        OpcionesVueloController._CloseModalOpcionesVuelo();

    },

    _CloseModalOpcionesVuelo: function () {
        $('#ModalVuelos').on('hide.bs.modal', function (e) {
            var closeModal = confirm("Esta acción no guardara la información diligenciada; ¿Desea Continuar.?");
            if (closeModal) {
                $('#frmOpcionesVuelos').find('.form-group').removeClass('has-error');
                OpcionesVueloController._LimpiarFormulario();
                $('#txtOrigen').val('');
                $('#txtDestino').val('');
                lstVuelos = [];
                Utils.Operations.ClearDataTable("#tblVuelos");
            } else {
                e.preventDefault();
                e.stopImmediatePropagation();
                return false;
            }
        });
    },

    
    /*_ValidarTipoVinculacion: function () {
        if ($("input[name='tipoVinculacion']").is(':checked')) {
            if (true) {}
            if (this.value === "1" && ) {
                $('#divFuncionario').show();
                $('#divContratista').hide();
            } else {
                $('#divFuncionario').hide();
                $('#divContratista').show();
            }
        }
   },*/

    _ValidarPerfilActual: function(){
        if (sessionStorage["UserData"] !== null && sessionStorage["UserData"] !== undefined) {
            UserData = JSON.parse(sessionStorage["UserData"]);
            if (UserData.UserId !== null && UserData.SolicitudId !== null) {
                //Carga los datos del usuario y la solicitud
                OpcionesVueloController.CargarDatosUsuarioSolicitud(UserData.UserId, UserData.SolicitudId);
                OpcionesVueloController.BuscarSolicitudVuelos(UserData.UserId, UserData.SolicitudId);
            } else {
                if (UserData.UserId !== 0 && UserData.UserId !== null) {
                    //Carga los datos del usuario
                    OpcionesVueloController.CargarUsuario(null, UserData.UserId, null);
                }
            }
            sessionStorage.removeItem("UserData");
        } else {
            buttons = [{
                label: 'Aceptar', action: function (dialogRef) {
                    dialogRef.close();
                    window.location.href = "default.aspx";
                }
            }];
            Modal.BootstrapDialog.Warning('¡Atención!', 'No cuenta con permisos suficientes para ingresar a esta página.', buttons);
        }
    },
    _CargarAerolineas: function(){
        var obj = Utils.Operations.GetBasicObject('ConsultarDatosBasicos');
        Bext.Servicios.Ejecutar(obj, true, function (data) {
            if (data.Data.length > 0) {
                lstDatosBasicos = data.Data;

                var lstAerolineas = Utils.Operations.GetListFromArray(lstDatosBasicos, "IdTipoDatoBasico", Enums.TipoDatoBasico.Aerolinea);

                Utils.Operations.PopulateSelect("#lstAerolineas", lstAerolineas, "IdDatoBasico", "Descripcion");
                Modal.BootstrapDialog.Close();
            }
        });
    },
    _ValidarSeleccion: function () {
        var listCheck = $(this);
        if (listCheck.is(':checked')) {
            var group = "input:checkbox[name='" + listCheck.attr("name") + "']";
            $(group).prop('checked', false);
            listCheck.prop('checked', true);
        } else {
            listCheck.prop('checked', true);
        }
    },
   
    _ValidarDatosVuelo: function () {

        var controlsToValidate = [
            { name: 'lstAerolinea', label: 'Aerolinea' },
            { name: 'txtOrigen', label: 'Orígen' },
            { name: 'txtDestino', label: 'Destino' },
            { name: 'txtFechaInicial', label: 'Fecha y Hora de Salida' },
            { name: 'txtValor', label: 'Valor' }
        ];

        var isValid = Utils.Operations.ValidarControles(controlsToValidate);


        if (isValid) {
            OpcionesVueloController._AgregarVuelo();
        } else {
            return;
        }
    },

    _AgregarVuelo: function () {

        if (lstVuelos.length < 3) {

            if ($("#txtValor").is(":visible")) { valor = $("#txtValor").formatCurrency().asNumber(); }

            contadorId++;
            var rutaAerea = $('#IdDesplazamiento').val();
            var aerolinea = $("#lstAerolinea option:selected").val();
            var origen = $("#txtOrigen").val();
            var destino = $("#txtDestino").val();
            var fechaInicial = $("#txtFechaInicial").val();
            var valor = valor;
            var aprobado = false;
            var numeroReserva = null;
            var numeroTiquete = null;

            var itemData = {

                IdOpcionVuelo: contadorId,
                IdRutaAerea: rutaAerea,
                Aerolinea: aerolinea,
                Origen: origen,
                Destino: destino,
                FechaHoraSalida: fechaInicial,
                Valor: valor,
                Aprobado: aprobado,
                NumeroReserva: numeroReserva,
                NumeroTiquete: numeroTiquete,
                VirtualItem: true
            }
            itemData = Utils.Operations.SetAuditFields(itemData);
            lstVuelos.push(itemData);
            OpcionesVueloController.crearTablaVuelos(lstVuelos);
            OpcionesVueloController._LimpiarFormulario();
        } else {
            alert('Solo puede agregar 3 opciones por tramo');
        }
    },
    crearTablaVuelos: function (lista) {

        if (!$.fn.DataTable.isDataTable('#tblVuelos')) {
            var columnsDef = [
                { 'width': 140, 'targets': 0 },
                { 'width': 115, 'targets': 1, "orderable": true },
                { 'width': 190, 'targets': 2 },
                { 'width': 160, 'targets': 3 },
                { 'width': 230, 'targets': 4 },
                { 'width': 300, 'targets': 5, 'className': 'text-justify' },
                { 'width': 40, 'targets': 6 },
            ];
            Utils.Operations.InicializeDataTable("#tblVuelos", columnsDef);
        } else {
            Utils.Operations.ClearDataTable("#tblVuelos");
        }

        if (lista.length > 0) {
            var table = $("#tblVuelos").DataTable();

            $.each(lista, function (index, item) {

                table.row.add([
                    item.Aerolinea,
                    item.Origen,
                    item.Destino,
                    item.FechaHoraSalida,
                    item.Valor,
                    '<button type="button" class="btn btn-danger btn-xs" onclick="OpcionesVueloController.eliminarVuelo(\'' + item.IdOpcionVuelo + '\')">Quitar <i class="fa fa-remove"></i></button>'
                ]).draw();
            });
        }
    },

    eliminarVuelo: function (IdOpcionVuelo) {
 
        IdOpcionVuelo = parseInt(IdOpcionVuelo);
        var itemDelete = lstVuelos.find(x => x.IdOpcionVuelo === IdOpcionVuelo);

        if (itemDelete.VirtualItem) {
            $.each(lstVuelos, function (key, item) {
                if (item.IdOpcionVuelo === IdOpcionVuelo) {
                    lstVuelos.splice(key, 1);
                    return false;
                }
            });
            OpcionesVueloController.crearTablaVuelos(lstVuelos);
        } /*else {
                    var obj = Utils.Operations.GetBasicObject('TOpcionVuelo','idOpcionVuelo');
                    obj.QueryConfig.CRAction = 4;
                    obj.QueryConfig.withTrasaction = true;

                    obj.item = {
                           idOpcionVuelo:itemDelete.idOpcionVuelo;
                    }

                    Bext.Sericios.Ejecutar(obj,true, function(data)){

                           $.each(lstVuelos,function(key,item) {
                                  if (item.Aerolinea === aerolinea) {
                                        lstVuelos.splice(key,1);
                                        return false;
                                  }
                           });
                           OpcionesVueloController.crearTablaVuelos(lstVuelos);
                    }
             }*/
    },

    _LimpiarFormulario: function(){
        $("#lstAerolinea").val('');
        $("#txtFechaInicial").val('');
        $("#txtValor").val('');
    },
    CargarUsuario: function (spid, idusuario, documento) {
        var obj = Utils.Operations.GetBasicObject('ObtenerUsuario');
        obj.Item = {
            SpId: spid,
            IdUsuario: idusuario,
            NumeroDocumento: documento
        }

        Bext.Servicios.Ejecutar(obj, true, function (data) {
            if (data.Data.length !== 0) {
                OpcionesVueloController.MapearDatosUsuario(data.Data[0]);
                Modal.BootstrapDialog.Close();
            } else {
                Modal.BootstrapDialog.Close();
            }
        });
    },

    CargarDatosUsuarioSolicitud: function (usuarioId,solicitudId) {
        var obj = Utils.Operations.GetBasicObject('ObtenerUsuarioSolicitud');
        obj.Item ={
            IdUsuario: usuarioId,
            IdSolicitud: solicitudId
        }
        Bext.Servicios.Ejecutar(obj, true, function (data) {
            if (data.Data.length !== 0) {
                OpcionesVueloController.MapearDatosUsuario(data.Data[0]);
                Modal.BootstrapDialog.Close();
            } else {
                Modal.BootstrapDialog.Close();
            }
        });
    },

    MapearDatosUsuario: function(objUsuario){
        $("#txtNombre").val(objUsuario.NombreCompleto);
        $("#txtDocumento").val(objUsuario.NumeroDocumento);
        $("#txtCorreo").val(objUsuario.Correo);
        $("#txtTipoVinculacion").val(objUsuario.TipoVinculacion);
        $("#txtCargo").val(objUsuario.Cargo);
    },

    BuscarSolicitudVuelos: function (usuarioId, solicitudId) {

        var obj = Utils.Operations.GetBasicObject('ConsultaRutaAerea');
        obj.Item = {
            IdUsuario: usuarioId,
            IdSolicitud: solicitudId
        }


        Bext.Servicios.Ejecutar(obj, true, function (data) {
         
            if (data.Data.length > 0) {
                lstRutaAerea = data.Data;
                OpcionesVueloController.CargarTablaVuelos(data.Data);
            } else {
                Utils.Operations.ClearDataTable("#tblRutaAerea");
            }
            Modal.BootstrapDialog.Close();
        });
    },

    CargarTablaVuelos: function (data) {
        Utils.Operations.ClearDataTable("#tblRutaAerea");
        var table = $('#tblRutaAerea').DataTable();
        $.each(data, function (index, item) {
            table.row.add([
                item.Origen,
                item.Destino,
                item.FechaInicio,
                '<button type="button" class="btn btn-info btn-xs" data-toggle="modal" data-target="#ModalVuelos" onclick="OpcionesVueloController.CargarDatosDesplazamiento(' + item.IdDesplazamiento + ')" >Cargar Opciones </button>',
                '<button type="button" class="btn btn-info btn-xs" data-toggle="modal" data-target="#ModalVuelos" id="btnOpciones">Ver Opciones </button>',
            ]).draw();
        });
    },

    CargarDatosDesplazamiento: function (IdDesplazamiento) {

        var resultado = Utils.Operations.GetObjectFromArray(lstRutaAerea, 'IdDesplazamiento', IdDesplazamiento);
            OpcionesVueloController.MapearDatosComision(resultado);
    },

    MapearDatosComision: function (objVuelo) {
        $('#txtOrigen').val(objVuelo.Origen);
        $('#txtDestino').val(objVuelo.Destino);
        $('#IdDesplazamiento').val(objVuelo.IdDesplazamiento);
        var fechaActual = objVuelo.FechaInicio;
        $('#txtFechaInicial').data("DateTimePicker").minDate(fechaActual);
    },
    GuardarOpcionVuelo: function () {
        debugger;
        $.each(lstVuelos, function (key, item) {
            if (item.VirtualItem) {
                item.IdOpcionVuelo = 0;
            }
            delete item['VirtualItem'];
        });

        var obj = Utils.Operations.GetBasicObject('TOpcionVuelo');
    
        obj.QueryConfig.FDtype = { FechaHoraSalida: 'DateTime'};
        obj.Items = lstVuelos;
        obj.QueryConfig.FormatSqlDateTime = '101';
        obj.QueryConfig.CRAction = 8;
        obj.QueryConfig.WithTransaction = true;
        obj.QueryConfig.SetAuditFields = true;
 

        Bext.Servicios.Ejecutar(obj, true, function(data) {
            if(data.Ok) {
                Modal.BootstrapDialog.Success('Opciones de Vuelo', 'Las opciones de vuelo Fueron Cargadas a la comisión.');
                Modal.BootstrapDialog.Close();
            } else {
                Modal.BootstrapDialog.Close();
            }
        });
    }
}

$(function () {
    OpcionesVueloController.onReady();
});