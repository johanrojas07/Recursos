var lstDatosBasicos = [];
var lstSoportesUsuario = [];
var lstAttachments = [];
var spId = 0;
var UserInfo = null;

var UsuarioController = {
    onReady: function () {
        Utils.Operations.InitializeDatePicker(".datepicker");
        $("input[name='tipoVinculacion']").change(UsuarioController._ValidarTipoVinculacion);

        $("#btnGuardarUsuario").click(UsuarioController.ConfirmarDatosUsuario);
        $("select[name=lstCargos]").change(UsuarioController._NuevoCargo);
        $(".SoportesUsuario").change(UsuarioController._ValidarArchivo);

        Utils.Operations.FormatCurrency('.currency');
        UsuarioController.CargarDatosBasicos();
        Utils.Operations.EmailRegex("#txtCorreo");
        Utils.Operations.InputNumber("#txtNumeroDocumento,#txtCelular,#txtNumeroCuenta");
    },
    _ValidarTipoVinculacion: function () {
        if ($("input[name='tipoVinculacion']").is(':checked')) {
            if (this.value === "1") {
                $(".divContratista").hide();
                $(".divFuncionario").show();
                $("#juramentada").hide();
                $("#contrato").hide();
            } else {
                $(".divFuncionario").hide();
                $(".divContratista").show();
                $("#juramentada").show();
                $("#contrato").show();
            }
        }
    },
    _NuevaSolicitud: function () {
        if ($("#UsuarioId").val() !== '') {

            var user = {
                UserId: parseInt($("#UsuarioId").val()),
                SolicitudId: null
            }
            var userData = JSON.stringify(user);
            sessionStorage.setItem("UserData", userData);
            window.location.href = "RegistroSolicitud.aspx";
        } else {
            Modal.BootstrapDialog.Warning('Perfil de usuario', 'No puede realizar esta acción hasta que no registre su información en el sistema.');
        }
    },
    _NuevoCargo: function () {
        var valor = $(this).val();
        if (valor == 'otro') {
            $("#divOtroCargo").show();
        } else {
            $("#divOtroCargo").hide();
        }
    },
    _ValidarPerfilActual: function(){
        if (sessionStorage["UserData"] !== null && sessionStorage["UserData"] !== undefined) {
            var usuario = JSON.parse(sessionStorage["UserData"]);
            
            if (usuario.UsuarioNuevo !== null && usuario.UsuarioNuevo !== undefined) {

                if (!usuario.UsuarioNuevo) {
                    if (usuario.UserId !== 0 && usuario.UserId !== null) {
                        UsuarioController.CargarUsuario(null, usuario.UserId, null);
                    }
                } else {
                    sessionStorage.removeItem("UserData");
                    Modal.BootstrapDialog.Close();
                }
            } else {
                if (usuario.UserId !== 0 && usuario.UserId !== null) {
                    UsuarioController.CargarUsuario(null, usuario.UserId, null);
                    //sessionStorage.removeItem("UserData");
                }
            }

        } else {
            UsuarioController.GetUserInfo();
        }
    },
    _ValidarArchivo: function (e) {
        debugger;
        var thisInput = e.target;
        var file = e.target.files[0];
        var existe = false;
        
        if (file !== null) {
            var allFiles = document.getElementsByClassName("SoportesUsuario");
            $.each(allFiles, function (index, input) {

                if ($(input).is(":visible") && input.files.length > 0) {
                    var nameFile = input.files[0].name;
                    if (thisInput.id !== input.id) {
                        if (nameFile == file.name) {
                            existe = true;
                            return false;
                        }
                    }
                }
            });

            if (existe) {
                this.value = "";
                Modal.BootstrapDialog.Warning("¡Atención!", "El archivo seleccionado ya fue cargado en este formulario.");
            }
        }
    },
    GetUserInfo: function () {
        var obj = {
            UrlSite: _spPageContextInfo.webAbsoluteUrl,
            RowLimit: '0',
            AddFileUrl: false,
            GetUserInfo: true
        };

        Bext.Servicios.Ejecutar(obj, true, function (data) {
            //debugger;
            
            if (data.Data.length > 0) {
                UserInfo = data.Data[0];
                $("#UsuarioSpId").val(UserInfo.ID);
                $("#txtNombreCompleto").val(UserInfo.Name);
                $("#txtCorreo").val(UserInfo.Email);
                UsuarioController.CargarUsuario(UserInfo.ID, null, null);
            } else {
                Modal.BootstrapDialog.Warning('Perfil de usuario', 'Los datos de la sesión de usuario no fueron cargados.');
            }
        });
    }, 
    CargarDatosBasicos: function () {
        var obj = Utils.Operations.GetBasicObject('ConsultarDatosBasicos');
        Bext.Servicios.Ejecutar(obj, true, function (data) {

            if (data.Data.length > 0) {

                lstDatosBasicos = data.Data;

                var hoy = new Date();
                var minDate = Utils.Operations.ConvertDateToFormat(hoy, 'yy-mm-dd');
                $('#txtFechaFinContrato').data("DateTimePicker").minDate(minDate);

                var lstTipoDocumentos = Utils.Operations.GetListFromArray(lstDatosBasicos, "IdTipoDatoBasico", Enums.TipoDatoBasico.TipoDocumentoIdentidad);
                var lstDependencias = Utils.Operations.GetListFromArray(lstDatosBasicos, "IdTipoDatoBasico", Enums.TipoDatoBasico.Dependencia);
                var lstCargos = Utils.Operations.GetListFromArray(lstDatosBasicos, "IdTipoDatoBasico", Enums.TipoDatoBasico.Cargo);
                var lstCodigos = Utils.Operations.GetListFromArray(lstDatosBasicos, "IdTipoDatoBasico", Enums.TipoDatoBasico.Codigo);
                var lstGrados = Utils.Operations.GetListFromArray(lstDatosBasicos, "IdTipoDatoBasico", Enums.TipoDatoBasico.Grado);
                var lstBancos = Utils.Operations.GetListFromArray(lstDatosBasicos, "IdTipoDatoBasico", Enums.TipoDatoBasico.Banco);

                Utils.Operations.PopulateSelect("#lstTipoDocumento", lstTipoDocumentos, "IdDatoBasico", "Descripcion");
                Utils.Operations.PopulateSelect("#lstDependencias", lstDependencias, "IdDatoBasico", "Descripcion");
                Utils.Operations.PopulateSelect("#lstCargos", lstCargos, "IdDatoBasico", "Descripcion");
                Utils.Operations.PopulateSelect("#lstCodigos", lstCodigos, "IdDatoBasico", "Descripcion");
                Utils.Operations.PopulateSelect("#lstGrados", lstGrados, "IdDatoBasico", "Descripcion");
                Utils.Operations.PopulateSelect("#lstBancos", lstBancos, "IdDatoBasico", "Descripcion");
                $("#lstCargos").append('<option value="otro">OTRO</option>');
            }

            UsuarioController._ValidarPerfilActual();
        });
    },
    CargarUsuario: function(spid, idusuario, documento){
        var obj = Utils.Operations.GetBasicObject('ObtenerUsuario');
        obj.Item = {
            SpId: spid,
            IdUsuario: idusuario,
            NumeroDocumento: documento
        }

        Bext.Servicios.Ejecutar(obj, true, function (data) {
            //debugger;
            sessionStorage.removeItem("UserData");
            if (data.Data.length !== 0) {
                UsuarioController.MapearUsuario(data.Data[0]);
                UsuarioController.CargarSoportesUsuario(data.Data[0].IdUsuario);
            } else {
                Modal.BootstrapDialog.Close();
            }
        });
    },
    CargarSoportesUsuario: function (idUsuario) {
        var obj = Utils.Operations.GetBasicObject('ConsultarSoportesUsuario');
        obj.Item = {
            IdUsuario: idUsuario,
        }

        Bext.Servicios.Ejecutar(obj, true, function (data) {
            ////debugger;
            if (data.Data.length !== 0) {
                UsuarioController.MapearSoportesUsuario(data.Data);
            }
            Modal.BootstrapDialog.Close();
        });
    },
    MapearUsuario: function (objUsuario) {

        $("#UsuarioId").val(objUsuario.IdUsuario);
        $("#UsuarioSpId").val(objUsuario.SpId);

        $("#lstTipoDocumento").val(objUsuario.IdTipoDocumento);
        $("#txtNumeroDocumento").val(objUsuario.NumeroDocumento);
        $("#txtPasaporte").val(objUsuario.Pasaporte);
        $("#txtNombreCompleto").val(objUsuario.NombreCompleto);
        $("#txtCorreo").val(objUsuario.Correo);
        $("#txtCelular").val(objUsuario.Celular);

        if (objUsuario.EsFuncionario) {
            $("#radFuncionario").prop("checked", true);
            $("#lstCodigos").val(objUsuario.IdCodigoFuncionario);
            $("#lstGrados").val(objUsuario.IdGradoFuncionario);
            $("#radFuncionario").trigger('click');
        } else {

            var fechaActual = new Date();
            fechaActual.setHours(0, 0, 0, 0);
            var finalizacionContrato = Utils.Operations.ConvertToJavascriptDate(objUsuario.FechaTerminacion);

            if (finalizacionContrato >= fechaActual) {

                $("#ContratoId").val(objUsuario.IdContrato);
                if (objUsuario.EsContratoUngrd) {
                    $("#radUngrd").prop("checked", true);
                } else {
                    $("#radFngrd").prop("checked", true);
                }
                $("#txtNumeroContrato").val(objUsuario.NumeroContrato);
                $("#txtFechaFinContrato").val(objUsuario.FechaTerminacion);
            }
            else {
                //var htmlMensaje = '<p>Debe actualizar los siguientes campos debido a la finalización de su contrato: </p>';
                //htmlMensaje += '<b>Fuente del contrato</b>';
                //htmlMensaje += '<b>Número de contrato</b>';
                //htmlMensaje += '<b>Fecha terminación del contrato</b>';
                //Modal.BootstrapDialog.Warning('Perfil de usuario', htmlMensaje);
            }
            $("#radContratista").trigger('click');
        }

        if (objUsuario.IdCargo !== null && objUsuario.OtroCargo == null) {
            $("#lstCargos").val(objUsuario.IdCargo);
        } else {
            $("#lstCargos").val("otro");
            $("#txtCargo").val(objUsuario.OtroCargo);
            $("#divOtroCargo").show();
        }

        $("#lstDependencias").val(objUsuario.IdDependencia);
        $("#txtIngresoMensual").val(objUsuario.IngresoMensual);
        $("#txtIngresoMensual").formatCurrency();
        
        if (objUsuario.EsCuentaAhorros) {
            $("#radAhorros").prop("checked", true);
        } else {
            $("#radCorriente").prop("checked", true);
        }

        $("#txtNumeroCuenta").val(objUsuario.NumeroCuenta);
        $("#lstBancos").val(objUsuario.IdBanco);
        //Modal.BootstrapDialog.Close();
    },
    MapearSoportesUsuario: function (lstSoportes) {
        $.each(lstSoportes, function (i, val) {
            var inputFiles = document.getElementsByClassName("SoportesUsuario");
            $.each(inputFiles, function (index, item) {
                if (parseInt($(item).attr("data-tipoSoporte")) === val.IdTipoSoporte) {

                    var parentElemSoportes = $(item).parent();
                    var ctrlDescargar = $(parentElemSoportes).find("a");
                    var ctrlEliminar = $(parentElemSoportes).find("button");
                    $(ctrlDescargar).show();
                    $(ctrlEliminar).show();

                    $(ctrlDescargar).html(val.Nombre + "&nbsp;<i class='fa fa-cloud-download'></i>");
                    $(ctrlDescargar).attr("href", val.Url);
                    $(ctrlEliminar).attr("onclick", "UsuarioController.ConfirmarEliminacionSoporte(this," + val.IdSoporte + "," + val.ShpId + ")");
                    
                    $(item).hide();
                    return false;
                }
            });
        });
    },
    ConfirmarDatosUsuario: function () {
        
        var controlsToValidate = [
            { name: 'lstTipoDocumento', label: 'Tipo de documento' },
            { name: 'txtNumeroDocumento', label: 'Número de documento' },
            { name: 'txtNombreCompleto', label: 'NombreCompleto' },
            { name: 'txtCorreo', label: 'Correo electrónico' },
            { name: 'txtCelular', label: 'Celular' },
            { name: 'tipoVinculacion', label: 'Tipo de vinculación' },
            { name: 'lstCargos', label: 'Cargo' },
            { name: 'fuenteContrato', label: 'Fuente del contrato' },
            { name: 'txtNumeroContrato', label: 'Número de contrato' },
            { name: 'txtFechaFinContrato', label: 'Fecha terminación del contrato' },
            { name: 'lstCodigos', label: 'Código' },
            { name: 'lstGrados', label: 'Grado' },
            { name: 'lstDependencias', label: 'Dependencia' },
            { name: 'txtIngresoMensual', label: 'Ingreso mensual' },
            { name: 'tipoCuentaBancaria', label: 'Tipo de cuenta bancaria' },
            { name: 'txtNumeroCuenta', label: 'Número cuenta bancaria' },
            { name: 'lstBancos', label: 'Banco' },
            { name: 'flSoporteRut', label: 'Soporte de RUT' },
            { name: 'flContrato', label: 'Soporte de Contrato' }
        ];
        var isValid = Utils.Operations.ValidarControles(controlsToValidate);
        if (isValid) {
            var buttons = [
                { label: 'Cancelar', action: function (dialogRef) { dialogRef.close(); } },
                { icon: 'glyphicon glyphicon-floppy-disk', label: 'Continuar', cssClass: 'btn-primary', action: function (dialogRef) { UsuarioController.GuardarDatosUsuario(); } }
            ];
            Modal.BootstrapDialog.Ok('Perfil de usuario', '¿Desea enviar los cambios realizados en la información de usuario?', buttons);
        } else {
            return;
        }
    },
    GuardarDatosUsuario: function () {
        //debugger;
        var obj = Utils.Operations.GetBasicObject('RUsuario');
        obj.Item = UsuarioController.ObjUsuario();
        obj.QueryConfig.FormatSqlDateTime = '101';
        obj.QueryConfig.CRAction = 8;
        obj.QueryConfig.WithTransaction = true;
        obj.QueryConfig.SetAuditFields = true;

        if ($("input[name='tipoVinculacion']:checked").val() === '0') {

            var RContrato = Utils.Operations.GetBasicObject('RContrato');
            RContrato.QueryConfig.FDtype = { FechaTerminacion: 'DateTime' };
            RContrato.QueryConfig.FormatSqlDateTime = '101';
            RContrato.QueryConfig.CRAction = 8;
            RContrato.QueryConfig.WithTransaction = true;
            RContrato.QueryConfig.SetAuditFields = true;
            RContrato.Item = UsuarioController.ObjContrato();

            obj.SubQueryLists = [RContrato];
        }
        
        var withFiles = false;
        var formData = UsuarioController.GetFormDataSoportes();
        if (formData != null) {
            withFiles = true;
            var FileMappingRename = {};
            $.each(lstSoportesUsuario, function (index, item) {
                FileMappingRename[item.File.name] = { TipoSoporte: item.TipoSoporte };
            });
            obj.DocumentSettings = {
                MappingInfo: {
                    "Title": 'NumeroDocumento',
                    "DocUsuario": 'NumeroDocumento',
                },
                DocumentLibrary: 'SoportesUsuarios',
                CharacterSeparation: '_',
                RenameMapping: [{ FieldName: 'NumeroDocumento' }, { FieldName: 'IdUsuario' }, { FieldName: 'TipoSoporte' }],
                FileMappingRename: FileMappingRename,
            };

            formData.append("QueryList", JSON.stringify(obj));
        }

        Bext.Servicios.Ejecutar((formData == null) ? obj : formData, true, function (data) {
            //debugger;
            if (data.Ok && data.Data.length > 0) {

                var userId = data.Data[0].IdUsuario;
                var containAttachments = false;
                $.each(data.Data, function (index, item) {
                    if (item.ItemAttachments !== undefined) {
                        if (item.ItemAttachments.length > 0) {
                            lstAttachments = item.ItemAttachments;
                            containAttachments = true;
                        }
                    }
                });

                if (containAttachments) {
                    if (lstAttachments.length === lstSoportesUsuario.length) {
                        var Tsoportes = UsuarioController.ObjSoportesUsuario(lstAttachments, userId);
                        Bext.Servicios.Ejecutar(Tsoportes, true, function (data) {
                            //debugger;
                            if (data.Ok) {
                                $(".SoportesUsuario").val("");
                                var buttons = [
                                    { label: 'Aceptar', action: function (dialogRef) { UsuarioController.CargarUsuario(null, userId, null); } }
                                ];
                                Modal.BootstrapDialog.Success('Perfil de usuario', 'La información del usuario ha sido guardada exitosamente.', buttons);
                            } else {
                                Modal.BootstrapDialog.Close();
                            }
                        });
                    } else {
                        var buttons = [
                            { label: 'Aceptar', action: function (dialogRef) { UsuarioController.CargarUsuario(null, data.Data[0].IdUsuario, null); } }
                        ];
                        Modal.BootstrapDialog.Success('Perfil de usuario', 'La información del usuario ha sido guardada exitosamente.', buttons);
                    }
                } else {
                    var buttons = [
                        { label: 'Aceptar', action: function (dialogRef) { UsuarioController.CargarUsuario(null, data.Data[0].IdUsuario, null); } }
                    ];
                    Modal.BootstrapDialog.Success('Perfil de usuario', 'La información del usuario ha sido guardada exitosamente.', buttons);
                }
            }
        }, null, null, null, withFiles);
    },
    ObjUsuario: function () {

        var codigo = null;
        var grado = null;
        var tipoVinculacion = null;
        var cargo = null;
        var otroCargo = null;

        if ($("#lstCodigos").is(":visible")) { codigo = parseInt($("#lstCodigos").val()); }
        if ($("#lstGrados").is(":visible")) { grado = parseInt($("#lstGrados").val()); }
        if ($("input[name='tipoVinculacion']").is(":visible")) { tipoVinculacion = parseInt($("input[name='tipoVinculacion']:checked").val()); }
        
        if ($("#lstCargos").val() !== "otro") {
            cargo = parseInt($("#lstCargos").val());
        } else {
            otroCargo = $("#txtCargo").val();
        }

        var item = {};
        item.IdUsuario = ($("#UsuarioId").val() !== '') ? parseInt($("#UsuarioId").val()) : 0;
        item.SpId = ($("#UsuarioSpId").val() !== '') ? parseInt($("#UsuarioSpId").val()) : null;
        item.IdTipoDocumento = parseInt($("#lstTipoDocumento").val());
        item.IdDependencia = parseInt($("#lstDependencias").val());
        item.IdCargo = cargo;
        item.IdBanco = parseInt($("#lstBancos").val());
        item.NumeroDocumento = $("#txtNumeroDocumento").val();
        item.Pasaporte = $("#txtPasaporte").val();
        item.NombreCompleto = $("#txtNombreCompleto").val().toUpperCase();
        item.Correo = $("#txtCorreo").val();
        item.Celular = $("#txtCelular").val();
        item.EsFuncionario = tipoVinculacion;
        item.IdCodigoFuncionario = codigo;
        item.IdGradoFuncionario = grado;
        item.IngresoMensual = $("#txtIngresoMensual").formatCurrency().asNumber();
        item.EsCuentaAhorros = $("input[name='tipoCuentaBancaria']:checked").val();
        item.NumeroCuenta = $("#txtNumeroCuenta").val();
        item.OtroCargo = otroCargo;
        item = Utils.Operations.SetAuditFields(item);
        return item;
    },
    ObjContrato: function () {

        var fuenteContrato = null;
        var numeroContrato = null;
        var fechaFinContrato = null;

        if ($("input[name='fuenteContrato']").is(":visible")) { fuenteContrato = parseInt($("input[name='fuenteContrato']:checked").val()); }
        if ($("#txtNumeroContrato").is(":visible")) { numeroContrato = $("#txtNumeroContrato").val(); }
        if ($("#txtFechaFinContrato").is(":visible")) { fechaFinContrato = $("#txtFechaFinContrato").val(); }

        var item = {};
        item.IdContrato = ($("#ContratoId").val() !== '') ? parseInt($("#ContratoId").val()) : 0;
        item.IdUsuario = ($("#UsuarioId").val() !== '') ? parseInt($("#UsuarioId").val()) : -1;
        item.EsContratoUngrd = fuenteContrato;
        item.NumeroContrato = numeroContrato;
        item.FechaTerminacion = fechaFinContrato;
        item = Utils.Operations.SetAuditFields(item);

        return item;
    },
    GetFormDataSoportes: function () {
        var allFiles = document.getElementsByClassName("SoportesUsuario");
        var formdata = new FormData();
        var ok = false;

        $.each(allFiles, function (index, item) {
            if ($(item).is(":visible")) {
                if (item.files[0] !== null && item.files[0] !== undefined) {
                    ok = true;
                    var file = item.files[0];
                    var tipoSoporte = parseInt($(item).attr('data-tipoSoporte'));
                    var itemFile = {
                        TipoSoporte: tipoSoporte,
                        File: file
                    };
                    formdata.append(file.name, file);
                    lstSoportesUsuario.push(itemFile);
                }
            }
        });
        return (ok) ? formdata : null;
    },
    ObjSoportesUsuario: function (lstSoportes, userId) {
        var item = Utils.Operations.GetBasicObject('TSoportes');
        item.QueryConfig.CRAction = 8;
        item.QueryConfig.WithTransaction = true;
        item.QueryConfig.SetAuditFields = true;

        var items = [];

        $.each(lstSoportes, function (i, val) {
            var fname = val.FileName.substring(0, val.FileName.indexOf("."));
            var ts = fname.split("_");
            
            var itemSoporte = {
                IdSoporte: 0,
                ShpId: val.ID,
                IdUsuario: userId,
                IdSolicitud: null,
                IdTipoSoporte: parseInt(ts[2]),
                Nombre: val.FileName,
                Url: val.Url
            };
            itemSoporte = Utils.Operations.SetAuditFields(itemSoporte);
            items.push(itemSoporte);
        });

        item.Items = items;
        return item;
    },
    ConfirmarEliminacionSoporte: function (elem, soporteId, itemId) {
        var buttons = [
                { label: 'Cancelar', action: function (dialogRef) { dialogRef.close(); } },
                { icon: 'glyphicon glyphicon-trash', label: 'Continuar', cssClass: 'btn-danger', action: function (dialogRef) { UsuarioController.EliminarSoporteDb(elem, soporteId, itemId); } }
        ];
        Modal.BootstrapDialog.Ok('Perfil de usuario', '¿Está seguro de eliminar el soporte?', buttons);
    },
    EliminarSoporteDb: function (elem, soporteId, itemId) {

        var obj = Utils.Operations.GetBasicObject('TSoportes');
        obj.QueryConfig.CRAction = 4;
        obj.QueryConfig.WithTransaction = true;
        obj.Item = {
            IdSoporte: soporteId
        }
        Bext.Servicios.Ejecutar(obj, true, function (data) {
            ////debugger;
            if (data.Ok) {
                UsuarioController.EliminarSoporteDocumenLibrary(elem, itemId);
            }
        });
    },
    EliminarSoporteDocumenLibrary: function (elem, itemId) {
        ////debugger;
        var obj = {
            Config: {
                Token: '6s/hftT3pTdXtYrKKbGyDPQ3Djxso3Pj',
                WebServiceName: "",
            },
            List: 'SoportesUsuarios',
            UrlSite: _spPageContextInfo.webAbsoluteUrl,
        };
        obj.ItemsToDelete = [itemId];

        Bext.Servicios.Ejecutar(obj, true, function (data) {
            //debugger;
            if (data.Ok) {
                var parentElemSoportes = $(elem).parent();
                var ctrlDescargar = $(parentElemSoportes).find("a");
                var ctrlUpload = $(parentElemSoportes).find("input");

                $(ctrlDescargar).html("");
                $(ctrlDescargar).attr("href", "");
                $(ctrlDescargar).hide();
                $(elem).attr("onclick", "");
                $(elem).hide();
                $(ctrlUpload).show();
                UsuarioController.CargarSoportesUsuario(parseInt($("#UsuarioId").val()));
                //Modal.BootstrapDialog.Close();
            } else {
                Modal.BootstrapDialog.Close();
            }
        });
    }
}

$(function () {
    UsuarioController.onReady();
});