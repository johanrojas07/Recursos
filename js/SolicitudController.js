var StorageUserData = null;
var SHPCurrentUser = null;
var DataBaseCurrentUser = null;

var lstDesplazamientos = [];
var lstGastosComision = [];
var lstSoportesSolicitud = [];
var lstAttachments = [];
var EsFuncionario = null;
var EsAudiencia = null;
var contadorDesplazamiento = 1;
//Cambios Jenniffer
var fechaFinContrato = null;
var Dependencia = null;
var EstadoSolicitud = null;
var requiereAprobacion = null;
var justificacion = null;
var EmailAsignado = null;
var correoSolicitante = null;
var formHabilitado = true;

var lstDepartamentos = [];
var lstCiudades = [];
var lstSolicitudes = [];
var userDbId = null;


var SolicitudController = {
    onReady: function () {
        Utils.Operations.InitializeDatePicker(".datepicker");
        Utils.Operations.InicializeDataTable(".table", null);
        Utils.Operations.FormatCurrency('.currency');

        $(".SoportesSolicitud").change(SolicitudController._ValidarArchivo);
        $('#txtFechaInicioComision').on('dp.change', SolicitudController._ValidarFechaInicioComision);
        $('#txtFechaFinComision').on('dp.change', SolicitudController._ValidarFechaFinComision);
        $('#txtFechaInicioDesplazamiento').on('dp.change', SolicitudController._ValidarFechaInicioDesplazamiento);
        $('#txtFechaFinDesplazamiento').on('dp.change', SolicitudController._ValidarFechaFinDesplazamiento);

        $("#btnAgregarDesplazamiento").click(SolicitudController.ValidarDesplazamiento);
        $('#btnCargarResolucion').click(SolicitudController.GuardarResolucion);
        $("input[name='tipoViaje']").change(SolicitudController._ValidarTipoViaje);
        $("input[name='EsAudiencia']").change(SolicitudController._ValidarAudiencia);
        $("input[name='requiereTiquetesAereos']").change(SolicitudController._ValidarTiquetesAereos);
        $("input[name='tipoRuta']").change(SolicitudController._ValidarTipoRuta);
        $("input[name='tipoVuelo']").change(SolicitudController._ValidarDesplazamientoVuelo);
        $(".openTab").click(SolicitudController._ShowTab);

        $('#txtOrigenComision').change(SolicitudController._PreCargarOrigenDesplazamiento);
        $('#txtDestinoComision').change(SolicitudController._PreCargarDestinoDesplazamiento);

        $('#txtNumeroDias').change(SolicitudController._CalcularValorAPagar);
        $('#txtBaseDiaria').change(SolicitudController._CalcularValorAPagar);

        $("select[name=lstOrigenPaisComision]").change(SolicitudController._ValidarPais);
        $("select[name=lstDestinoPaisComision]").change(SolicitudController._ValidarPais);
        $("select[name=lstOrigenPais]").change(SolicitudController._ValidarPais);
        $("select[name=lstDestinoPais]").change(SolicitudController._ValidarPais);

        $("select[name=lstOrigenDepartamentoComision]").change(SolicitudController._CargarCiudades);
        $("select[name=lstDestinoDepartamentoComision]").change(SolicitudController._CargarCiudades);
        $("select[name=lstOrigenDepartamento]").change(SolicitudController._CargarCiudades);
        $("select[name=lstDestinoDepartamento]").change(SolicitudController._CargarCiudades);

        $("select[name=lstOrigenCiudadComision]").change(SolicitudController._SetCampoCiudad);
        $("select[name=lstDestinoCiudadComision]").change(SolicitudController._SetCampoCiudad);
        $("select[name=lstOrigenCiudad]").change(SolicitudController._SetCampoCiudad);
        $("select[name=lstDestinoCiudad]").change(SolicitudController._SetCampoCiudad);

        Utils.Operations.InputNumberDecimals('#txtNumeroDias');

        $("#btnEnviarSolicitud").click(SolicitudController.ConfirmarDatosSolicitud);
        SolicitudController.GetUserInfo();
        SolicitudController.SetDefaultOrderTables();
        SolicitudController.CargarDatosBasicos();
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
            var hoy = new Date();
            var minDate = Utils.Operations.ConvertDateToFormat(hoy, 'yy-mm-dd');
            $('#txtFechaInicioComision').data("DateTimePicker").minDate(minDate);

            if (data.Data.length > 0) {
                SHPCurrentUser = data.Data[0];
                if (SHPCurrentUser.Groups.indexOf(Enums.GruposUsuario.AdminComisiones) > -1) {
                    $("#btnEnviarSolicitud").hide();
                    $('#divContrato').hide();
                } else if (SHPCurrentUser.Groups.indexOf(Enums.GruposUsuario.MultiUsuario) > -1) {
                    $("#btnEnviarSolicitud").hide();
                    $('#divContrato').hide();
                } else if (SHPCurrentUser.Groups.indexOf(Enums.GruposUsuario.SecretarioGeneral) > -1) {
                    $("#btnEnviarSolicitud").hide();
                    $("#btnRechazarSolicitud").show();
                    $("#btnSolicitarModificacion").show();
                    $("#btnAprobarSolicitud").show();
                    $('#divContrato').hide();
                    $('#divAprobacion').hide();
                } else if (SHPCurrentUser.Groups.indexOf(Enums.GruposUsuario.TalentoHumano) > -1) {
                    $("#btnSolicitarModificacion").show();
                    $('#divTipoCta').show();
                    $('#divNoCta').show();
                    $('#divIngreso').show();
                    $('#divBanco').show();
                    $('#divRequiereAprobacion').show();
                    $('#btnEnviarSolicitud').hide();
                    $('#divResolucion').show();
                    $('#btnCargarResolucion').show();
                } else if (SHPCurrentUser.Groups.indexOf(Enums.GruposUsuario.JefeArea) > -1) {
                    $("#btnEnviarSolicitud").hide();
                    $("#btnRechazarSolicitud").show();
                    $("#btnSolicitarModificacion").show();
                    $("#btnAprobarSolicitud").show();
                    $('#divAprobacion').hide();
                    $('#divContrato').hide();

                }
                SolicitudController.CargarUsuarioSesion(SHPCurrentUser.ID);
            } else {
                buttons = [{
                    label: 'Aceptar', action: function (dialogRef) {
                        dialogRef.close();
                        history.back();
                    }
                }];
                Modal.BootstrapDialog.Warning('¡Atención!', 'No se pudo consultar la información de la solicitud, por favor intente más tarde y si el problema persiste contacte el administrador del sitio.', buttons);
            }
        });
    },
    BuscarSolicitudes: function () {
        var obj = Utils.Operations.GetBasicObject('ConsultarSolicitudes');
        obj.Item = {
            IdUsuario: userDbId,
        };
        Bext.Servicios.Ejecutar(obj, true, function (data) {
            if (data.Data.length > 0) {
                lstSolicitudes = data.Data;
            }
        });
    },
    SetDefaultOrderTables: function () {
        var tableRutas = $('#tblRutaAerea').DataTable();
        // Ordernar por defecto columna 3 'Fecha Viaje'
        tableRutas.order([2, 'asc']).draw();
    },
    CargarDatosBasicos: function () {
        var obj = Utils.Operations.GetBasicObject('ConsultarDatosBasicos');
        Bext.Servicios.Ejecutar(obj, true, function (data) {

            if (data.Data.length > 0) {
                var lstDatosBasicos = data.Data;
                var lstPaises = Utils.Operations.GetListFromArray(lstDatosBasicos, "IdTipoDatoBasico", Enums.TipoDatoBasico.Pais);
                lstDepartamentos = Utils.Operations.GetListFromArray(lstDatosBasicos, "IdTipoDatoBasico", Enums.TipoDatoBasico.Departamento);
                lstCiudades = Utils.Operations.GetListFromArray(lstDatosBasicos, "IdTipoDatoBasico", Enums.TipoDatoBasico.Ciudad);
                Utils.Operations.PopulateSelect("#lstOrigenPaisComision", lstPaises, "IdDatoBasico", "Descripcion");
                Utils.Operations.PopulateSelect("#lstDestinoPaisComision", lstPaises, "IdDatoBasico", "Descripcion");
                Utils.Operations.PopulateSelect("#lstOrigenPais", lstPaises, "IdDatoBasico", "Descripcion");
                Utils.Operations.PopulateSelect("#lstDestinoPais", lstPaises, "IdDatoBasico", "Descripcion");
                Utils.Operations.PopulateSelect("#lstOrigenDepartamentoComision", lstDepartamentos, "IdDatoBasico", "Descripcion");
                Utils.Operations.PopulateSelect("#lstDestinoDepartamentoComision", lstDepartamentos, "IdDatoBasico", "Descripcion");
                Utils.Operations.PopulateSelect("#lstOrigenDepartamento", lstDepartamentos, "IdDatoBasico", "Descripcion");
                Utils.Operations.PopulateSelect("#lstDestinoDepartamento", lstDepartamentos, "IdDatoBasico", "Descripcion");
            }
        });
    },
    _ValidarPais: function () {
        var valor = $(this).val();
        $(".txt" + this.id).val('');
        if (valor == Enums.DatoBasico.Colombia + '') {
            $(".otro" + this.id).show();
            $(".txt" + this.id).hide();
        } else {
            $(".otro" + this.id).hide();
            $(".txt" + this.id).show();
        }
    },
    _CargarCiudades: function () {
        var valor = $(this).val();
        var strIdCampoCiudad = '';
        switch (this.id) {
            case 'lstOrigenDepartamentoComision':
                strIdCampoCiudad = 'lstOrigenCiudadComision';
                $("#txtOrigenComision").val('');
                break;
            case 'lstDestinoDepartamentoComision':
                strIdCampoCiudad = 'lstDestinoCiudadComision';
                $("#txtDestinoComision").val('');
                break;
            case 'lstOrigenDepartamento':
                strIdCampoCiudad = 'lstOrigenCiudad';
                $("#txtOrigen").val('');
                break;
            case 'lstDestinoDepartamento':
                strIdCampoCiudad = 'lstDestinoCiudad';
                $("#txtDestino").val('');
                break;
        }

        SolicitudController._SetCiudadControl(strIdCampoCiudad, valor);

    },
    _SetCiudadControl: function (strIdCampoCiudad, valor) {
        var lstCiudadesXDpto = [];
        if (valor != '') {
            lstCiudadesXDpto = Utils.Operations.GetListFromArray(lstCiudades, "IdDatoBasicoPadre", parseInt(valor));
        } else lstCiudadesXDpto.push({ IdDatoBasico: '', Descripcion: '--Seleccione--' })
        Utils.Operations.PopulateSelect("#" + strIdCampoCiudad, lstCiudadesXDpto, "IdDatoBasico", "Descripcion");
    },
    _SetCampoCiudad: function () {
        var valor = $(this).val();
        var strIdCampoCiudad = '';
        switch (this.id) {
            case 'lstOrigenCiudadComision':
                strIdCampoCiudad = 'txtOrigenComision';
                break;
            case 'lstDestinoCiudadComision':
                strIdCampoCiudad = 'txtDestinoComision';
                break;
            case 'lstOrigenCiudad':
                strIdCampoCiudad = 'txtOrigen';
                break;
            case 'lstDestinoCiudad':
                strIdCampoCiudad = 'txtDestino';
                break;
        }
        $("#" + strIdCampoCiudad).val('');
        if (valor != '') {
            $("#" + strIdCampoCiudad).val(this.selectedOptions[0].text);
        }


    },
    _ValidarTipoVinculacion: function (tipoVinculacion) {

        $("#tabs").show();
        if (tipoVinculacion) {
            $("#soporteCitacion").hide();
            $("#soportePoder").hide();

            $("#tabs").find("#tabViaticosDesplazamientoFuncionario").addClass("active").show();
            $("#tabs").find("#tabGastosTerrestresFuncionario").show();
            $("#divFechaTerminacionDesplazamiento").show();
            $("#divNumeroDiasDesplazamiento").show();
            $("#divBaseDiariaDesplazamiento").show();
            $("#divValorPagarDesplazamiento").show();
            $("#divTblViaticosDesplazamiento").show();
            var refTab = $("#tabDesplazamientoFuncionario").find("a").attr('data-tabId');

            $("#divTipoVuelo").hide();
            $("#divTipoRutaDesplazamiento").hide();
            $("#divTblGastosTransportesFuncionario").hide();
            $("#divTblDesplazamientoContratista").hide();
        } else {

            $("#tabs").find("#tabDesplazamientoContratista").addClass("active").show();
            $("#divFechaTerminacionDesplazamiento").show();
            $("#divNumeroDiasDesplazamiento").show();
            $("#divTipoRutaDesplazamiento").show();
            $("#divTblDesplazamientoContratista").show();

            var refTab = $("#tabDesplazamientoContratista").find("a").attr('data-tabId');

            $("#divTipoVuelo").hide();
            $("#divBaseDiariaDesplazamiento").hide();
            $("#divValorPagarDesplazamiento").hide();
            $("#divTblViaticosDesplazamiento").hide();
            $("#divTblGastosTransportesFuncionario").hide();
        }
    },
    //Validar la Dependencia para mostrar las opciones de audiencia
    _ValidarDependencia: function (Dependencia) {
        if (Dependencia !== 'OFICINA ASESORA JURÍDICA') {
            $('#divAudiencia').hide();
        } else {
            $('#divAudiencia').show();
        }
    },
    _ShowTab: function () {
        $(".nav-tabs").find("li").removeClass("active");
        var desplazamiento = parseInt($(this).attr('data-tabId'));
        $(this).parent().addClass("active");
        $("#frmDesplazamiento").find(".form-group").removeClass("has-error");

        switch (desplazamiento) {
            case Enums.TipoDesplazamiento.ViaticosFuncionarios:
                $("#divFechaTerminacionDesplazamiento").show();
                $("#divNumeroDiasDesplazamiento").show();
                $("#divBaseDiariaDesplazamiento").show();
                $("#divValorPagarDesplazamiento").show();
                $("#divTblViaticosDesplazamiento").show();

                $("#divTipoVuelo").hide();
                $("#divTipoRutaDesplazamiento").hide();
                $("#divTblGastosTransportesFuncionario").hide();
                $("#divTblDesplazamientoContratista").hide();
                $("#divTblRutaAerea").hide();
                break;
            case Enums.TipoDesplazamiento.GastosTransportesFuncionarios:
                $("#divFechaTerminacionDesplazamiento").show();
                $("#divNumeroDiasDesplazamiento").show();
                $("#divValorPagarDesplazamiento").show();
                $("#divTblGastosTransportesFuncionario").show();

                $("#divTipoVuelo").hide();
                $("#divBaseDiariaDesplazamiento").hide();
                $("#divTipoRutaDesplazamiento").hide();
                $("#divTblViaticosDesplazamiento").hide();
                $("#divTblDesplazamientoContratista").hide();
                $("#divTblRutaAerea").hide();
                break;
            case Enums.TipoDesplazamiento.DesplazamientoContratista:
                $("#divFechaTerminacionDesplazamiento").show();
                $("#divNumeroDiasDesplazamiento").show();
                $("#divTipoRutaDesplazamiento").show();
                $("#divTblDesplazamientoContratista").show();

                $("#divTipoVuelo").hide();
                $("#divBaseDiariaDesplazamiento").hide();
                $("#divValorPagarDesplazamiento").hide();
                $("#divTblViaticosDesplazamiento").hide();
                $("#divTblGastosTransportesFuncionario").hide();
                $("#divTblRutaAerea").hide();
                break;
            case Enums.TipoDesplazamiento.RutaAerea:
                $("#divTipoVuelo").show();
                $("#divTblRutaAerea").show();

                $("#divNumeroDiasDesplazamiento").hide();
                $("#divTipoRutaDesplazamiento").hide();
                $("#divFechaTerminacionDesplazamiento").hide();
                $("#divBaseDiariaDesplazamiento").hide();
                $("#divValorPagarDesplazamiento").hide();
                $("#divTblViaticosDesplazamiento").hide();
                $("#divTblGastosTransportesFuncionario").hide();
                $("#divTblDesplazamientoContratista").hide();
                break;
        }
        SolicitudController._LimpiarCamposDesplazamiento()
        $("#btnAgregarDesplazamiento").text("Agregar desplazamiento ")

    },
    _ValidarParametrosSession: function () {
        if (sessionStorage["UserData"] !== null && sessionStorage["UserData"] !== undefined) {
            StorageUserData = JSON.parse(sessionStorage["UserData"]);
            if (StorageUserData.UserId !== null && StorageUserData.SolicitudId !== null) {
                $("#SolicitudId").val(StorageUserData.SolicitudId);
                //Carga los datos de la solicitud del un usuario
                if (DataBaseCurrentUser !== null) {
                    if (DataBaseCurrentUser.IdUsuario === StorageUserData.UserId) {
                        SolicitudController.CargarUsuarioSolicitud(DataBaseCurrentUser.IdUsuario, StorageUserData.SolicitudId);
                    } else {
                        SolicitudController.CargarUsuarioSolicitud(StorageUserData.UserId, StorageUserData.SolicitudId, true);
                    }
                } else {

                    SolicitudController.CargarUsuarioSolicitud(StorageUserData.UserId, StorageUserData.SolicitudId);
                }
            } else {

                if (StorageUserData.UserId !== 0 && StorageUserData.UserId !== null) {

                    //Carga los datos del usuario para que este realice una solicitud
                    if (DataBaseCurrentUser.IdUsuario === StorageUserData.UserId) {
                        //Si la solicitud la va a realizar el usuario en sesion, se mapean sus datos
                        SolicitudController.MapearUsuario(DataBaseCurrentUser);
                        $("#btnEnviarSolicitud").show();
                        Modal.BootstrapDialog.Close();
                    } else {
                        SolicitudController.CargarUsuario(null, StorageUserData.UserId, null);
                    }
                }
                // Nueva Solicitud
                if (StorageUserData.SolicitudId == 0 || StorageUserData.SolicitudId == null) {
                    $('.btnFlujoSolicitud').hide();
                }

            }
            sessionStorage.removeItem("UserData");
        } else {
            buttons = [{
                label: 'Aceptar', action: function (dialogRef) {
                    dialogRef.close();
                    history.back();
                }
            }];
            Modal.BootstrapDialog.Warning('¡Atención!', 'No se pudo consultar la información de la solicitud, por favor intente más tarde y si el problema persiste contacte el administrador del sitio.', buttons);
        }
        sessionStorage.removeItem("UserData");
    },
    _ValidarArchivo: function (e) {
        debugger;
        var thisInput = e.target;
        var file = e.target.files[0];
        var existe = false;

        if (file !== null) {
            var allFiles = document.getElementsByClassName("SoportesSolicitud");
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
    //Se valida la fecha maxima de inicio y fin de una comision de acuerdo a la fecha de terminación del contrato
    _ValidarFechaInicioComision: function (e) {
        debugger;
        if (e.date !== false) {
            $("#txtFechaFinComision").data("DateTimePicker").minDate(e.date);
            $("#txtFechaInicioDesplazamiento").data("DateTimePicker").minDate(e.date);
            $("#txtFechaFinDesplazamiento").data("DateTimePicker").minDate(e.date);
            if (!EsFuncionario) {
                $('#txtFechaInicioComision').data('DateTimePicker').maxDate(fechaFinContrato);
            }
            if ($('#txtFechaInicioDesplazamiento').val() !== "") {
                SolicitudController._CalcularNumeroDias();
            }
        }
    },
    _ValidarFechaFinComision: function (e) {
        debugger;
        // Validar que no existan otras comisiones
        if (e.date !== false) {
            $("#txtFechaInicioDesplazamiento").data("DateTimePicker").maxDate(e.date);
            $("#txtFechaFinDesplazamiento").data("DateTimePicker").maxDate(e.date);
            if (!EsFuncionario) {
                $('#txtFechaFinComision').data('DateTimePicker').maxDate(fechaFinContrato);
            }
            $("#txtFechaFinDesplazamiento").val($("#txtFechaFinComision").val())
            if ($('#txtFechaInicioDesplazamiento').val() !== "") {
                SolicitudController._CalcularNumeroDias();
            }
        }
    },
    _ValidarCruceDeSolicitudes: function () {
        var solicitudValida = true;
        if (lstSolicitudes && lstSolicitudes.length > 0) {
            debugger;
            fechaInicio = new Date($('#txtFechaInicioComision').val());
            fechafin = new Date($('#txtFechaFinComision').val());
            if (fechaInicio || fechafin) {
                fechaInicio = (fechaInicio) ? fechaInicio.getTime() : fechaInicio;
                fechafin = (fechafin) ? fechafin.getTime() : fechafin;
                for (let solicitud of lstSolicitudes) {
                    debugger;
                    if (solicitud.Estado && (solicitud.IdEstado === Enums.EstadoSolicitud.PendienteAprobacionJefeArea
                                            || solicitud.IdEstado === Enums.EstadoSolicitud.PendienteAprobacionSecretario)) {
                        solicitudFechaInicio = new Date(solicitud.FechaInicio).getTime();
                        solicitudFechaFin = new Date(solicitud.FechaFinalizacion).getTime();
                        if (fechaInicio && fechaInicio >= solicitudFechaInicio && fechaInicio <= solicitudFechaFin) {
                            solicitudValida = false;
                            break;
                        }
                        if (fechafin && fechafin >= solicitudFechaInicio && fechafin <= solicitudFechaFin) {
                            solicitudValida = false;
                            break;
                        }
                    }
                }
            }
        }
        if (!solicitudValida) {
            alert("Ya se encuentra una solicitud Pendiente de aprobacion para estas fechas");
        }
        return solicitudValida;
    },
    _PreCargarOrigenDesplazamiento: function (e) {
        var thisInput = e.target;
        if (thisInput.value != "" && $("#txtDestino").val() == "") {
            $("#txtOrigen").val(thisInput.value);
        }
    },

    _PreCargarDestinoDesplazamiento: function (e) {
        var thisInput = e.target;
        if (thisInput.value != "" && $("#txtDestino").val() == "") {
            $("#txtDestino").val(thisInput.value);
        }
    },

    _ValidarFechaInicioDesplazamiento: function (e) {
        if (e.date !== false) {
            $("#txtFechaFinDesplazamiento").data("DateTimePicker").minDate(e.date);
            SolicitudController._CalcularNumeroDias();
        }
    },
    _ValidarFechaFinDesplazamiento: function (e) {
        if (e.date !== false) {
            //$("#txtFechaInicioDesplazamiento").data("DateTimePicker").maxDate(e.date);
            SolicitudController._CalcularNumeroDias();
        }
    },
    _ValidarTipoViaje: function () {
        if ($("input[name='tipoViaje']").is(':checked')) {
            if (this.value === "1") { $("#divPasaporte").hide(); } else { $("#divPasaporte").show(); }
        } else {
            $("#divPasaporte").show();
        }
    },

    // Si es una audiencia los soportes de citacion y poder son obligatorios
    _ValidarAudiencia: function () {
        if ($("input[name='EsAudiencia']").is(':checked')) {
            if (this.value === "1") {
                $("#soporteCitacion").show();
                $("#soportePoder").show();
            } else {
                $("#soporteCitacion").hide();
                $("#soportePoder").hide();
            }
        } else {
            $("#soporteCitacion").hide();
            $("#soportePoder").hide();
        }
    },
    _ValidarTiquetesAereos: function () {
        if ($("input[name='requiereTiquetesAereos']").is(':checked')) {
            if (this.value === "1") { $("#tabRutaAerea").show(); } else { $("#tabRutaAerea").hide(); }
        } else {
            $("#tabRutaAerea").hide();
        }
    },
    _ValidarTipoRuta: function () {
        if ($("input[name='tipoRuta']").is(':checked')) {
            if (this.value === "Otro") { $(".otro").show(); } else { $(".otro").hide(); }
        } else {
            $(".otro").hide();
        }
    },
    _ValidarDesplazamientoVuelo: function () {
        if ($("input[name='tipoVuelo']").is(":checked")) {
            if (this.value === "1") { $("#divFechaTerminacionDesplazamiento").hide(); } else { $("#divFechaTerminacionDesplazamiento").show(); }
        } else {
            //$("#divFechaTerminacionDesplazamiento").hide();
        }
    },
    _LimpiarCamposDesplazamiento: function () {
        $("#HIdDesplazamiento").val("");
        $("#txtOrigen").val("");
        $("#txtDestino").val("");
        $("#txtHoraTrayecto").val("");
        $("#txtFechaInicioDesplazamiento").val("");
        $("#txtFechaFinDesplazamiento").val("");
        $("#txtNumeroDias").val("");
        $("#txtOtraRuta").val("");
        $("#txtBaseDiaria").val("");
        $("#txtValorPagar").val("");
        $("input[name='tipoRuta']").prop("checked", false).trigger('change');
        $("input[name='tipoVuelo']").prop("checked", false).trigger('change');

        $("#lstOrigenPais").val("");
        $("#lstOrigenDepartamento").val("");
        $("#lstOrigenCiudad").val("");
        $("#lstDestinoPais").val("");
        $("#lstDestinoDepartamento").val("");
        $("#lstDestinoCiudad").val("");

        $(".otrolstOrigenPais").hide();
        $(".otrolstDestinoPais").hide();

        $(".txtlstOrigenPais").show();
        $(".txtlstDestinoPais").show();

        //Precargar con los valores de la comision
        $("#txtOrigen").val($("#txtOrigenComision").val());
        $("#txtDestino").val($("#txtDestinoComision").val());
        $("#txtFechaInicioDesplazamiento").val($("#txtFechaInicioComision").val());
        $("#txtFechaFinDesplazamiento").val($("#txtFechaFinComision").val());



    },
    //Si la fecha de inicio y terminacion del desplazamiento se pernocta a 0.5, 
    _CalcularNumeroDias: function () {

        var tipoDesplazamiento = parseInt($(".nav-tabs").find("li.active").find("a").attr("data-tabId"));
        var numDias = null;
        if ($('#txtFechaInicioDesplazamiento').val() !== "") {

            fechaInicio = new Date($('#txtFechaInicioDesplazamiento').val());
            fechafin = new Date($('#txtFechaFinDesplazamiento').val());

            numDias = fechafin.getTime() - fechaInicio.getTime();
            numDias = Math.round(numDias / (1000 * 60 * 60 * 24));

            if (contadorDesplazamiento == 1) {
                numDias = numDias + 0.5;
                console.log(numDias);
            }

            switch (tipoDesplazamiento) {
                case Enums.TipoDesplazamiento.ViaticosFuncionarios:
                    $('#txtNumeroDias').val(numDias);
                    break;
                case Enums.TipoDesplazamiento.DesplazamientoContratista:
                    $('#txtNumeroDias').val(numDias);
                    break;
                case Enums.TipoDesplazamiento.GastosTransportesFuncionarios:
                    $('#txtNumeroDias').val(numDias);
                    break;
            }
            SolicitudController._CalcularValorAPagar();
        } else {
            alert("Seleccione la fecha de inicio del desplazamiento.");
        }
    },
    _CalcularValorAPagar: function () {

        if ($("#txtNumeroDias").val() != "" && $("#txtBaseDiaria").val() != "") {
            $("#txtValorPagar").val($("#txtNumeroDias").val() * $("#txtBaseDiaria").formatCurrency().asNumber());
            $("#txtValorPagar").formatCurrency({ colorize: true, negativeFormat: '-%s%n', roundToDecimalPlace: 2 });
        }

    },
    _InhabilitarFormulario: function () {

        $('#divComision input').attr('readonly', 'readonly');
        $('#divComision select').prop('disabled', 'disabled');
        $('#divComision textarea').attr('readonly', 'readonly');
        $('btnAgregarDesplazamiento').hide();
        $("input[name='tipoViaje']").attr('disabled', 'disabled');
        $("input[name='requiereTiquetesAereos']").attr('disabled', 'disabled');
        $("input[name='gastosAdicionales']").attr('disabled', 'disabled');
        $("input[name='tipoVuelo']").attr('disabled', 'disabled');
        $("input[name='EsAudiencia']").attr('disabled', 'disabled');
        $('#FrmInput').attr('hidden', 'hidden');
        $('.eliminarSoporte').attr('disabled', 'disabled');
        $('#btnEliminar').removeAttr('disabled');
        $('.input-sm').removeAttr("readonly");
        //Hide buttons 
        $('.btnSolicitud').hide();
        formHabilitado = false;

    },
    ValidarDesplazamiento: function () {

        var controlsToValidate = [
            { name: 'lstOrigenPais', label: 'Pais orígen' },
            { name: 'lstDestinoPais', label: 'Pais destino' },
            { name: 'txtOrigen', label: 'Lugar orígen' },
            { name: 'txtDestino', label: 'Lugar destino' },
            { name: 'txtHoraTrayecto', label: 'Hora de Trayecto' },
            { name: 'txtFechaInicioDesplazamiento', label: 'Fecha inicio' },
            { name: 'txtFechaFinDesplazamiento', label: 'Fecha finalización' },
            { name: 'txtNumeroDias', label: 'Número de días' },
            { name: 'tipoRuta', label: 'Tipo de ruta' },
            { name: 'txtOtraRuta', label: 'Otra ruta' },
            { name: 'txtBaseDiaria', label: 'Base diaria' },
            { name: 'txtValorPagar', label: 'Valor a pagar' }
        ];

        if ($('#lstOrigenPais').val() == Enums.DatoBasico.Colombia + '') {
            controlsToValidate.push(
                { name: 'lstOrigenDepartamento', label: 'Departamento Origen' },
                { name: 'lstOrigenCiudad', label: 'Ciudad Origen' },
            )
        }
        if ($('#lstDestinoPais').val() == Enums.DatoBasico.Colombia + '') {
            controlsToValidate.push(
                { name: 'lstDestinoDepartamento', label: 'Departamento Destino' },
                { name: 'lstDestinoCiudad', label: 'Ciudad Destino' },
            )
        }



        var isValid = Utils.Operations.ValidarControles(controlsToValidate);

        if (isValid) {
            SolicitudController.AgregarDesplazamiento();
        } else { return; }
    },
    AgregarDesplazamiento: function () {

        var currentIdDesplazamiento = $('#HIdDesplazamiento').val();
        var fechaFin = null;
        var numeroDias = null;
        var baseDiaria = null;
        var valorPagar = null;
        var tipoRuta = null;
        var otraRuta = null;
        var idaRegreso = false;

        if ($("input[name='tipoVuelo']").is(":visible")) {
            if ($("input[name='tipoVuelo']:checked").val() === "2") {
                idaRegreso = true;
            }
        }

        if ($("#txtFechaFinDesplazamiento").is(":visible")) { fechaFin = $("#txtFechaFinDesplazamiento").val(); }
        if ($("#txtNumeroDias").is(":visible")) { numeroDias = $("#txtNumeroDias").val(); }
        if ($("#txtBaseDiaria").is(":visible")) { baseDiaria = $("#txtBaseDiaria").formatCurrency().asNumber(); }
        if ($("#txtValorPagar").is(":visible")) { valorPagar = $("#txtValorPagar").formatCurrency().asNumber(); }

        if ($("input[name='tipoRuta']").is(":visible")) {
            if ($("input[name='tipoRuta']:checked").val() !== 'Otro') {
                tipoRuta = parseInt($("input[name='tipoRuta']:checked").val());
            } else {
                otraRuta = $("#txtOtraRuta").val();
            }
        }

        if (currentIdDesplazamiento != "") {
            IdDesplazamiento = currentIdDesplazamiento;
            $.each(lstDesplazamientos, function (i, val) {
                if (val.IdDesplazamiento == currentIdDesplazamiento) {
                    SolicitudController.EliminarDesplazamiento(val.IdDesplazamiento);
                }
            });
        } else {
            IdDesplazamiento = ($("#HIdDesplazamiento").val() !== "") ? parseInt($("#HIdDesplazamiento").val()) : Utils.Operations.GenerateGuid();
        }

        var tipoDesplazamiento = parseInt($(".nav-tabs").find("li.active").find("a").attr("data-tabId"));
        var objDesplazamiento = {

            IdDesplazamiento: IdDesplazamiento,
            IdSolicitud: (StorageUserData.SolicitudId !== null) ? parseInt(StorageUserData.SolicitudId) : -1,
            IdTipoDesplazamiento: tipoDesplazamiento,
            IdTipoRuta: tipoRuta,
            IdPaisOrigen: parseInt($('#lstOrigenPais').val()),
            IdPaisDestino: parseInt($('#lstDestinoPais').val()),
            Origen: $("#txtOrigen").val(),
            Destino: $("#txtDestino").val(),
            HoraTrayecto: $("#txtHoraTrayecto").val(),
            FechaInicio: $("#txtFechaInicioDesplazamiento").val(),
            FechaFinalizacion: fechaFin,
            NumeroDias: numeroDias,
            BaseDiaria: baseDiaria,
            ValorPagar: valorPagar,
            OtraRuta: otraRuta,
            VirtualItem: true
        }
        if ($('#lstOrigenPais').val() == Enums.DatoBasico.Colombia + '') {
            objDesplazamiento.IdDepartamentoOrigen = parseInt($('#lstOrigenDepartamento').val());
            objDesplazamiento.IdCiudadOrigen = parseInt($('#lstOrigenCiudad').val());
        }
        if ($('#lstDestinoPais').val() == Enums.DatoBasico.Colombia + '') {
            objDesplazamiento.IdCiudadDestino = parseInt($('#lstDestinoCiudad').val());
            objDesplazamiento.IdDepartamentoDestino = parseInt($('#lstDestinoDepartamento').val());
        }

        objDesplazamiento = Utils.Operations.SetAuditFields(objDesplazamiento);

        if (idaRegreso) {
            //Agrega los dos trayectos de Ida y Regreso.
            objDesplazamiento.FechaFinalizacion = null;
            lstDesplazamientos.push(objDesplazamiento);
            contadorDesplazamiento += 1;

            var objDesplazamientoRegreso = {
                IdDesplazamiento: ($("#HIdDesplazamiento").val() !== "") ? parseInt($("#HIdDesplazamiento").val()) : Utils.Operations.GenerateGuid(),
                IdSolicitud: (StorageUserData.SolicitudId !== null) ? parseInt(StorageUserData.SolicitudId) : -1,
                IdTipoDesplazamiento: tipoDesplazamiento,
                IdTipoRuta: tipoRuta,
                IdPaisOrigen: parseInt($('#lstOrigenPais').val()),
                IdPaisDestino: parseInt($('#lstDestinoPais').val()),
                Origen: $("#txtDestino").val(),
                Destino: $("#txtOrigen").val(),
                HoraTrayecto: $("#txtHoraTrayecto").val(),
                FechaInicio: fechaFin,
                FechaFinalizacion: null,
                NumeroDias: numeroDias,
                BaseDiaria: baseDiaria,
                ValorPagar: valorPagar,
                OtraRuta: otraRuta,
                VirtualItem: true
            }
            if ($('#lstOrigenPais').val() == Enums.DatoBasico.Colombia + '') {
                objDesplazamientoRegreso.IdDepartamentoOrigen = parseInt($('#lstOrigenDepartamento').val());
                objDesplazamientoRegreso.IdCiudadOrigen = parseInt($('#lstOrigenCiudad').val());
            }
            if ($('#lstDestinoPais').val() == Enums.DatoBasico.Colombia + '') {
                objDesplazamientoRegreso.IdDepartamentoDestino = parseInt($('#lstDestinoDepartamento').val());
                objDesplazamientoRegreso.IdCiudadDestino = parseInt($('#lstDestinoCiudad').val());
            }

            objDesplazamientoRegreso = Utils.Operations.SetAuditFields(objDesplazamientoRegreso);

            lstDesplazamientos.push(objDesplazamientoRegreso);
            contadorDesplazamiento += 1;

        } else {
            lstDesplazamientos.push(objDesplazamiento);
            contadorDesplazamiento += 1;
        }

        SolicitudController._LimpiarCamposDesplazamiento();

        //Filtramos los desplazamientos según su tipo
        var lstResult = Utils.Operations.GetListFromArray(lstDesplazamientos, "IdTipoDesplazamiento", tipoDesplazamiento);

        //Creamos la tabla de desplazamiento
        SolicitudController.CrearTablaDesplazamiento(lstResult, tipoDesplazamiento);
        $("#btnAgregarDesplazamiento").text("Agregar desplazamiento ")

    },
    CrearTablaDesplazamiento: function (lista, tipoDesplazamiento) {

        var strDisplayBtns = (formHabilitado) ? "" : 'style="display: none;"';
        if (lista.length > 0) {
            switch (tipoDesplazamiento) {
                case Enums.TipoDesplazamiento.DesplazamientoContratista:

                    var table = $("#tblDesplazamientoContratista").DataTable();
                    if (table.row().count() > 0) {
                        Utils.Operations.ClearDataTable("#tblDesplazamientoContratista");
                    }

                    $.each(lista, function (index, item) {
                        var tipoRuta = "";
                        if (item.IdTipoRuta !== null) {
                            tipoRuta = Listas.TiposRuta.find(x => x.Id === item.IdTipoRuta).Descripcion;
                        } else {
                            tipoRuta = item.OtraRuta;
                        }

                        table.row.add([
                            item.Origen,
                            item.Destino,
                            item.FechaInicio,
                            item.FechaFinalizacion,
                            item.NumeroDias,
                            tipoRuta,
                            '<button type="button" class="btn btn-default btn-xs btnSolicitud" ' + strDisplayBtns + ' onclick="SolicitudController.EditarDesplazamiento(\'' + item.IdDesplazamiento + '\')">Editar <i class="fa fa-edit"></i></button>',
                            '<button type="button" class="btn btn-danger btn-xs btnSolicitud" ' + strDisplayBtns + ' onclick="SolicitudController.EliminarDesplazamiento(\'' + item.IdDesplazamiento + '\')">Quitar <i class="fa fa-remove"></i></button>'
                        ]).draw();
                    });

                    break;
                case Enums.TipoDesplazamiento.ViaticosFuncionarios:

                    var table = $("#tblViaticosDesplazamiento").DataTable();
                    if (table.row().count() > 0) {
                        Utils.Operations.ClearDataTable("#tblViaticosDesplazamiento");
                    }

                    $.each(lista, function (index, item) {
                        table.row.add([
                            item.Origen,
                            item.Destino,
                            item.FechaInicio,
                            item.FechaFinalizacion,
                            item.NumeroDias,
                            Utils.Operations.CurrencyString(item.BaseDiaria),
                            Utils.Operations.CurrencyString(item.ValorPagar),
                            '<button type="button" class="btn btn-default btn-xs btnSolicitud" ' + strDisplayBtns + ' onclick="SolicitudController.EditarDesplazamiento(\'' + item.IdDesplazamiento + '\')">Editar <i class="fa fa-edit"></i></button>',
                            '<button type="button" class="btn btn-danger btn-xs btnSolicitud" ' + strDisplayBtns + ' onclick="SolicitudController.EliminarDesplazamiento(\'' + item.IdDesplazamiento + '\')">Quitar <i class="fa fa-remove"></i></button>'
                        ]).draw();
                    });

                    break;
                case Enums.TipoDesplazamiento.GastosTransportesFuncionarios:

                    var table = $("#tblGastosTransportesFuncionario").DataTable();
                    if (table.row().count() > 0) {
                        Utils.Operations.ClearDataTable("#tblGastosTransportesFuncionario");
                    }

                    $.each(lista, function (index, item) {
                        table.row.add([
                            item.Origen,
                            item.Destino,
                            item.FechaInicio,
                            item.FechaFinalizacion,
                            item.NumeroDias,
                            Utils.Operations.CurrencyString(item.ValorPagar),
                            '<button type="button" class="btn btn-default btn-xs btnSolicitud" ' + strDisplayBtns + ' onclick="SolicitudController.EditarDesplazamiento(\'' + item.IdDesplazamiento + '\')">Editar <i class="fa fa-edit"></i></button>',
                            '<button type="button" class="btn btn-danger btn-xs btnSolicitud" ' + strDisplayBtns + ' onclick="SolicitudController.EliminarDesplazamiento(\'' + item.IdDesplazamiento + '\')">Quitar <i class="fa fa-remove"></i></button>'
                        ]).draw();
                    });
                    break;
                case Enums.TipoDesplazamiento.RutaAerea:

                    $("#divFechaTerminacionDesplazamiento").hide();
                    var table = $("#tblRutaAerea").DataTable();
                    if (table.row().count() > 0) {
                        Utils.Operations.ClearDataTable("#tblRutaAerea");
                    }

                    $.each(lista, function (index, item) {
                        table.row.add([
                            item.Origen,
                            item.Destino,
                            item.FechaInicio,
                            '<button type="button" class="btn btn-default btn-xs btnSolicitud" ' + strDisplayBtns + ' onclick="SolicitudController.EditarDesplazamiento(\'' + item.IdDesplazamiento + '\')">Editar <i class="fa fa-edit"></i></button>',
                            '<button type="button" class="btn btn-danger btn-xs btnSolicitud" ' + strDisplayBtns + ' onclick="SolicitudController.EliminarDesplazamiento( \'' + item.IdDesplazamiento + '\')">Quitar <i class="fa fa-remove"></i></button>'
                        ]).draw();
                    });
                    break;
            }
        }
    },
    EditarDesplazamiento: function (desplazamientoId) {
        var filtro = null;
        if (desplazamientoId.length > 30) {
            filtro = desplazamientoId;
        } else {
            filtro = parseInt(desplazamientoId);
        }

        var desplazamiento = Utils.Operations.GetObjectFromArray(lstDesplazamientos, "IdDesplazamiento", filtro);

        $("#HIdDesplazamiento").val(desplazamiento.IdDesplazamiento);//
        $("#txtOrigen").val(desplazamiento.Origen);
        $("#txtFechaInicioDesplazamiento").val(desplazamiento.FechaInicio);
        $("#txtDestino").val(desplazamiento.Destino);
        $("#txtHoraTrayecto").val(desplazamiento.HoraTrayecto);
        $('#lstOrigenPais').val(desplazamiento.IdPaisOrigen + "");
        $('#lstDestinoPais').val(desplazamiento.IdPaisDestino + "");

        if ($('#lstOrigenPais').val() == Enums.DatoBasico.Colombia + '') {
            $('#lstOrigenDepartamento').val(desplazamiento.IdDepartamentoOrigen + '');
            SolicitudController._SetCiudadControl('lstOrigenCiudad', desplazamiento.IdDepartamentoOrigen);
            $('#lstOrigenCiudad').val(desplazamiento.IdCiudadOrigen + '');

            $(".otrolstOrigenPais").show();
            $(".txtlstOrigenPais").hide();
        }
        if ($('#lstDestinoPais').val() == Enums.DatoBasico.Colombia + '') {
            $('#lstDestinoDepartamento').val(desplazamiento.IdDepartamentoDestino + '')
            SolicitudController._SetCiudadControl('lstDestinoCiudad', desplazamiento.IdDepartamentoDestino);
            $('#lstDestinoCiudad').val(desplazamiento.IdCiudadDestino + '');

            $(".otrolstDestinoPais").show();
            $(".txtlstDestinoPais").hide();
        }



        if (desplazamiento.FechaInicio !== null) {
            $("#txtFechaFinDesplazamiento").val(desplazamiento.FechaFinalizacion);
        }
        if (desplazamiento.NumeroDias !== null) {
            $("#txtNumeroDias").val(desplazamiento.NumeroDias);
        }
        if (desplazamiento.IdTipoRuta !== null) {
            switch (desplazamiento.IdTipoRuta) {
                case Enums.TiposRuta.Aerea:
                    $("#rutaAerea").prop("checked", true).trigger('change');;
                    break;
                case Enums.TiposRuta.Maritimo:
                    $("#rutaFluvial").prop("checked", true).trigger('change');;
                    break;
                case Enums.TiposRuta.Terrestre:
                    $("#rutaTerrestre").prop("checked", true).trigger('change');;
                    break;
            }
        }
        if (desplazamiento.BaseDiaria !== null) {
            $("#txtBaseDiaria").val(desplazamiento.BaseDiaria);
        }
        if (desplazamiento.ValorPagar !== null) {
            $("#txtValorPagar").val(desplazamiento.ValorPagar);
        }

        if (desplazamiento.OtraRuta !== null && desplazamiento.OtraRuta !== "") {
            $("#otraRuta").prop("checked", true).trigger('change');
            $("#txtOtraRuta").val(desplazamiento.OtraRuta);
        }
        $("#btnAgregarDesplazamiento").text("Actualizar desplazamiento ")
    },
    EliminarDesplazamiento: function (desplazamientoId) {
        if (desplazamientoId.length > 30) {
            desplazamientoId = desplazamientoId;
        } else {
            desplazamientoId = parseInt(desplazamientoId)
        }
        var itemDelete = lstDesplazamientos.find(x => x.IdDesplazamiento === desplazamientoId);
        var tipoDesplazamiento = itemDelete.IdTipoDesplazamiento;

        if (itemDelete.VirtualItem) {
            $.each(lstDesplazamientos, function (key, item) {
                if (item.IdDesplazamiento === desplazamientoId) {
                    switch (tipoDesplazamiento) {
                        case Enums.TipoDesplazamiento.DesplazamientoContratista:
                            Utils.Operations.ClearDataTable("#tblDesplazamientoContratista");
                            break;
                        case Enums.TipoDesplazamiento.ViaticosFuncionarios:
                            Utils.Operations.ClearDataTable("#tblViaticosDesplazamiento");
                            break;
                        case Enums.TipoDesplazamiento.GastosTransportesFuncionarios:
                            Utils.Operations.ClearDataTable("#tblGastosTransportesFuncionario");
                            break;
                        case Enums.TipoDesplazamiento.RutaAerea:
                            Utils.Operations.ClearDataTable("#tblRutaAerea");
                            break;
                    }
                    lstDesplazamientos.splice(key, 1);
                    return false;
                }
            });

            var lstResult = Utils.Operations.GetListFromArray(lstDesplazamientos, "IdTipoDesplazamiento", tipoDesplazamiento);
            SolicitudController.CrearTablaDesplazamiento(lstResult, tipoDesplazamiento);
        } else {
            var obj = Utils.Operations.GetBasicObject('TDesplazamiento');

            obj.QueryConfig.CRAction = 4;
            obj.QueryConfig.withTrasaction = true;

            obj.item = {
                IdDesplazamiento: itemDelete.IdDesplazamiento
            }

            Bext.Servicios.Ejecutar(obj, true, function (data) {
                $.each(lstDesplazamientos, function (key, item) {
                    if (item.IdDesplazamiento === desplazamientoId) {
                        switch (tipoDesplazamiento) {
                            case Enums.TipoDesplazamiento.DesplazamientoContratista:
                                Utils.Operations.ClearDataTable("#tblDesplazamientoContratista");
                                break;
                            case Enums.TipoDesplazamiento.ViaticosFuncionarios:
                                Utils.Operations.ClearDataTable("#tblViaticosDesplazamiento");
                                break;
                            case Enums.TipoDesplazamiento.GastosTransportesFuncionarios:
                                Utils.Operations.ClearDataTable("#tblGastosTransportesFuncionario");
                                break;
                            case Enums.TipoDesplazamiento.RutaAerea:
                                Utils.Operations.ClearDataTable("#tblRutaAerea");
                                break;
                        }
                        lstDesplazamientos.splice(key, 1);
                        return false;
                    }
                });
                var lstResult = Utils.Operations.GetListFromArray(lstDesplazamientos, "IdTipoDesplazamiento", tipoDesplazamiento);
                SolicitudController.CrearTablaDesplazamiento(lstResult, tipoDesplazamiento);
                Modal.BootstrapDialog.Close();
            });
        }
    },
    //Métodos para realizar cargue de información
    CargarUsuarioSesion: function (SHPIdUsuario) {
        var obj = Utils.Operations.GetBasicObject('ObtenerUsuario');
        obj.Item = {
            SpId: SHPIdUsuario,
            IdUsuario: null,
            NumeroDocumento: null
        }

        Bext.Servicios.Ejecutar(obj, true, function (data) {
            if (data.Data.length !== 0) {
                DataBaseCurrentUser = data.Data[0];
                fechaFinContrato = DataBaseCurrentUser.FechaTerminacion;
                userDbId = DataBaseCurrentUser.IdUsuario;
                SolicitudController._ValidarParametrosSession();
                SolicitudController.BuscarSolicitudes();
            } else {
                SolicitudController._ValidarParametrosSession();
                //sessionStorage.removeItem("UserData");
                //buttons = [{
                //    label: 'Aceptar', action: function (dialogRef) {
                //        dialogRef.close();
                //        window.location.href = "RegistroUsuario.aspx";
                //    }
                //}];
                //var lnk = "<a href='RegistroUsuario.aspx'>Registro de usuario</a>";
                //Modal.BootstrapDialog.Warning('¡Atención!', '<p>Señor usuario, usted no se encuentra registrado en el sistema de comisiones, por lo tanto no podrá ver la información de ésta página, por favor registre sus datos ingresando por el siguiente enlace.</p>' + lnk, buttons);
            }
        });
    },
    CargarUsuario: function (spid, idusuario, documento) {
        var obj = Utils.Operations.GetBasicObject('ObtenerUsuario');
        obj.Item = {
            SpId: spid,
            IdUsuario: idusuario,
            NumeroDocumento: documento
        }

        Bext.Servicios.Ejecutar(obj, true, function (data) {
            debugger;
            if (data.Data.length !== 0) {
                //DataBaseCurrentUser = data.Data[0];
                SolicitudController.MapearUsuario(data.Data[0]);
                $("#btnEnviarSolicitud").show();
            } else {
                buttons = [{
                    label: 'Aceptar', action: function (dialogRef) {
                        dialogRef.close();
                        window.location.href = "RegistroUsuario.aspx";
                    }
                }];
                var lnk = "<a href='RegistroUsuario.aspx'>Registro de usuario</a>";
                Modal.BootstrapDialog.Warning('¡Atención!', '<p>Señor usuario, usted no se encuentra registrado en el sistema de comisiones, por lo tanto no podrá ver la información de ésta página, por favor registre sus datos ingresando por el siguiente enlace.</p>' + lnk, buttons);
            }
            Modal.BootstrapDialog.Close();
        });
    },
    CargarUsuarioSolicitud: function (usuarioId, solicitudId, inhabilitarForm = false) {
        var obj = Utils.Operations.GetBasicObject('ObtenerUsuarioSolicitud');
        obj.Item = {
            IdUsuario: usuarioId,
            IdSolicitud: solicitudId
        }
        Bext.Servicios.Ejecutar(obj, true, function (data) {
            if (data.Ok && data.Data.length !== 0) {
                var esTalentoHumano = SolicitudController.MapearUsuarioSolicitud(data.Data[0]);
                SolicitudController.CargarSoportesSolicitud(solicitudId);
                SolicitudController.CargarSoporteContrato(usuarioId);
                if (inhabilitarForm || esTalentoHumano) {
                    SolicitudController._InhabilitarFormulario();
                }

                // Es solicitud Propia
                if (sessionStorage["MisSolicitudes"] == "True" && usuarioId == data.Data[0].IdUsuario) {
                    $('.btnFlujoSolicitud').hide();
                    $("#btnEnviarSolicitud").show();
                }
            } else {
                Modal.BootstrapDialog.Close();
            }
        });
    },
    CargarSoportesSolicitud: function (idSolicitud) {
        var obj = Utils.Operations.GetBasicObject('ConsultarSoportesSolicitud');
        obj.Item = {
            IdSolicitud: idSolicitud,
        }

        Bext.Servicios.Ejecutar(obj, true, function (data) {
            debugger;
            if (data.Ok && data.Data.length !== 0) {
                SolicitudController.MapearSoportesSolicitud(data.Data);
            }
            SolicitudController.CargarDesplazamientosSolicitud(idSolicitud);
        });
    },
    CargarDesplazamientosSolicitud: function (solicitudId) {
        var obj = Utils.Operations.GetBasicObject('ConsultarDesplazamientosSolicitud');
        obj.Item = {
            IdSolicitud: solicitudId
        }
        Bext.Servicios.Ejecutar(obj, true, function (data) {
            if (data.Ok && data.Data.length !== 0) {
                lstGastosComision = data.Data;
                SolicitudController.MapearDesplazamientosSolicitud(data.Data);
                //Modal.BootstrapDialog.Close();
            }
            SolicitudController.CargarGastosComision(solicitudId);
        });
    },
    CargarGastosComision: function (solicitudId) {

        var obj = Utils.Operations.GetBasicObject('ConsultarGastosComision');
        obj.Item = {
            IdSolicitud: solicitudId
        }
        Bext.Servicios.Ejecutar(obj, true, function (data) {
            if (data.Ok && data.Data.length !== 0) {
                SolicitudController.MapearGastosComision(data.Data);
            }
            Modal.BootstrapDialog.Close();
        });
    },
    //Métodos para mapear la información consultada
    MapearUsuarioSesion: function (mapping) {

    },
    MapearUsuario: function (objUsuario) {


        $("#txtNombreCompleto").val(objUsuario.NombreCompleto);
        $("#txtNumeroDocumento").val(objUsuario.NumeroDocumento);
        $("#txtCorreo").val(objUsuario.Correo);
        $("#txtTipoVinculacion").val(objUsuario.TipoVinculacion);
        $('#txtDependencia').val(objUsuario.Dependencia);
        $("#txtCargo").val(objUsuario.Cargo);
        $('#txtTipoCta').val(objUsuario.TipoCuenta);
        $('#txtBanco').val(objUsuario.Banco);
        $('#txtNoCta').val(objUsuario.NumeroCuenta);
        $('#txtIngreso').val(objUsuario.IngresoMensual);
        $("#txtPasaporte").val(objUsuario.Pasaporte);
        $('#txtFuente').val(objUsuario.TipoContrato);
        $('#txtNumContrato').val(objUsuario.NumeroContrato);
        EsFuncionario = objUsuario.EsFuncionario;

        if (!EsFuncionario && SHPCurrentUser.Groups.indexOf(Enums.GruposUsuario.TalentoHumano) > -1) {
            $('#divContrato').show();
        } else {
            $('#divContrato').hide();
        }

        Dependencia = objUsuario.Dependencia;
        SolicitudController._ValidarDependencia(Dependencia);
        SolicitudController._ValidarTipoVinculacion(objUsuario.EsFuncionario);
        SolicitudController.lstUsuariosgrupo(Dependencia, Enums.GruposUsuario.JefeArea);
    },
    MapearUsuarioSolicitud: function (objUsuarioSolicitud) {
        EstadoSolicitud = objUsuarioSolicitud.IdEstado;
        requiereAprobacion = objUsuarioSolicitud.RequiereAprobacion;
        justificacion = objUsuarioSolicitud.Justificacion;
        correoSolicitante = objUsuarioSolicitud.correo;

        $("#txtNombreCompleto").val(objUsuarioSolicitud.NombreCompleto);
        $("#txtNumeroDocumento").val(objUsuarioSolicitud.NumeroDocumento);
        $("#txtCorreo").val(objUsuarioSolicitud.Correo);
        $("#txtTipoVinculacion").val(objUsuarioSolicitud.TipoVinculacion);
        $('#txtDependencia').val(objUsuarioSolicitud.Dependencia);
        $("#txtCargo").val(objUsuarioSolicitud.Cargo);
        $('#txtTipoCta').val(objUsuarioSolicitud.TipoCuenta);
        $('#txtBanco').val(objUsuarioSolicitud.Banco);
        $('#txtNoCta').val(objUsuarioSolicitud.NumeroCuenta);
        $('#txtIngreso').val(objUsuarioSolicitud.IngresoMensual);
        $('#txtFuente').val(objUsuarioSolicitud.TipoContrato);
        $('#txtNumContrato').val(objUsuarioSolicitud.NumeroContrato);
        $("#txtPasaporte").val(objUsuarioSolicitud.Pasaporte);
        EsFuncionario = objUsuarioSolicitud.EsFuncionario;
        if (!EsFuncionario && SHPCurrentUser.Groups.indexOf(Enums.GruposUsuario.TalentoHumano) > -1) {
            $('#divContrato').show();
        } else {
            $('#divContrato').hide();
        }

        SolicitudController._ValidarDependencia(objUsuarioSolicitud.Dependencia);
        SolicitudController._ValidarTipoVinculacion(objUsuarioSolicitud.EsFuncionario);
        $("#divConsecutivo").show();
        $("#txtConsecutivo").val(objUsuarioSolicitud.IdSolicitud);
        $("#txtObjetoComision").val(objUsuarioSolicitud.ObjetoComision);

        $("#lstOrigenPaisComision").val(objUsuarioSolicitud.IdPaisOrigen);
        $("#lstDestinoPaisComision").val(objUsuarioSolicitud.IdPaisDestino);

        if ($('#lstOrigenPaisComision').val() == Enums.DatoBasico.Colombia + '') {
            $('#lstOrigenDepartamentoComision').val(objUsuarioSolicitud.IdDepartamentoOrigen + '');
            SolicitudController._SetCiudadControl('lstOrigenCiudadComision', objUsuarioSolicitud.IdDepartamentoOrigen);
            $('#lstOrigenCiudadComision').val(objUsuarioSolicitud.IdCiudadOrigen + '');

            $(".otrolstOrigenPaisComision").show();
            $(".txtlstOrigenPaisComision").hide();
        }
        if ($('#lstDestinoPaisComision').val() == Enums.DatoBasico.Colombia + '') {
            $('#lstDestinoDepartamentoComision').val(objUsuarioSolicitud.IdDepartamentoDestino + '')
            SolicitudController._SetCiudadControl('lstDestinoCiudadComision', objUsuarioSolicitud.IdDepartamentoDestino);
            $('#lstDestinoCiudadComision').val(objUsuarioSolicitud.IdCiudadDestino + '');

            $(".otrolstDestinoPaisComision").show();
            $(".txtlstDestinoPaisComision").hide();
        }

        $("#txtOrigenComision").val(objUsuarioSolicitud.Origen);
        $("#txtDestinoComision").val(objUsuarioSolicitud.Destino);
        $("#txtFechaInicioComision").val(objUsuarioSolicitud.FechaInicio);
        $("#txtFechaFinComision").val(objUsuarioSolicitud.FechaFinalizacion);
        if (objUsuarioSolicitud.EsViajeNacional) {
            //$("#viajeNacional").prop("checked", true).trigger('click');
            $("#viajeNacional").prop("checked", true);
        } else {
            $("#viajeInternacional").prop("checked", true).trigger('click');
        }

        if (objUsuarioSolicitud.RequiereTiquetesAereos) {
            $("#requiereTiquete").prop("checked", true).trigger('change');
        } else {
            //$("#noRequiereTiquete").prop("checked", true).trigger('click');
            $("#noRequiereTiquete").prop("checked", true);
        }
        if (objUsuarioSolicitud.EsAudiencia) {
            $("#EsAudiencia").prop("checked", true).trigger('change');
        } else {
            $("#EsAudiencia").prop("checked", true);
        }

        if (SHPCurrentUser.Groups.indexOf(Enums.GruposUsuario.TalentoHumano) > -1) {
            return true;//  SolicitudController._InhabilitarFormulario();
        } else return false;


    },
    MapearSoportesSolicitud: function (lstSoportes) {
        SolicitudController._ValidarAudiencia();
        $.each(lstSoportes, function (i, val) {
            var inputFiles = document.getElementsByClassName("SoportesSolicitud");
            $.each(inputFiles, function (index, item) {
                if (parseInt($(item).attr("data-tipoSoporte")) === val.IdTipoSoporte) {

                    var parentElemSoportes = $(item).parent();
                    var ctrlDescargar = $(parentElemSoportes).find("a");
                    var ctrlEliminar = $(parentElemSoportes).find("button");
                    $(ctrlDescargar).show();
                    if (val.IdTipoSoporte == 80) {
                        if (val.Nombre != "" && SHPCurrentUser.Groups.indexOf(Enums.GruposUsuario.TalentoHumano) > -1) {
                            $('#divResolucion').show();
                            $(ctrlEliminar).show();
                        } else {
                            $('#divResolucion').show();
                            $(ctrlEliminar).hide();
                        }
                    } else {
                        $(ctrlEliminar).show();
                    }

                    $(ctrlDescargar).html(val.Nombre + "&nbsp;<i class='fa fa-cloud-download'></i>");
                    $(ctrlDescargar).attr("href", val.Url);
                    $(ctrlEliminar).attr("onclick", "SolicitudController.ConfirmarEliminacionSoporte(this," + val.IdSoporte + "," + val.ShpId + ")");
                    $(item).hide();
                    return false;
                }
            });
        });
    },
    MapearDesplazamientosSolicitud: function (lst) {
        $.each(lst, function (key, item) {
            item["VirtualItem"] = false;
            if (item["NumeroDias"] !== undefined && item["NumeroDias"] != null) {
                item["NumeroDias"] = "" + item["NumeroDias"];
            }
        });

        lstDesplazamientos = lst;
        var lstDespContratista = Utils.Operations.GetListFromArray(lst, "IdTipoDesplazamiento", Enums.TipoDesplazamiento.DesplazamientoContratista);
        var lstDespFuncionario = Utils.Operations.GetListFromArray(lst, "IdTipoDesplazamiento", Enums.TipoDesplazamiento.ViaticosFuncionarios);
        var lstGastosFuncionario = Utils.Operations.GetListFromArray(lst, "IdTipoDesplazamiento", Enums.TipoDesplazamiento.GastosTransportesFuncionarios);
        var lstRutaAerea = Utils.Operations.GetListFromArray(lst, "IdTipoDesplazamiento", Enums.TipoDesplazamiento.RutaAerea);

        if (lstDespContratista.length > 0) {
            SolicitudController.CrearTablaDesplazamiento(lstDespContratista, Enums.TipoDesplazamiento.DesplazamientoContratista);
        }
        if (lstDespFuncionario.length > 0) {
            SolicitudController.CrearTablaDesplazamiento(lstDespFuncionario, Enums.TipoDesplazamiento.ViaticosFuncionarios);
        }
        if (lstGastosFuncionario.length > 0) {
            SolicitudController.CrearTablaDesplazamiento(lstGastosFuncionario, Enums.TipoDesplazamiento.GastosTransportesFuncionarios);
        }
        if (lstRutaAerea.length > 0) {
            SolicitudController.CrearTablaDesplazamiento(lstRutaAerea, Enums.TipoDesplazamiento.RutaAerea);
        }
        SolicitudController.ValidarEstadoSolicitud();
    },
    MapearGastosComision: function (lstGastos) {
        $.each(lstGastos, function (key, item) {
            switch (item.IdTipoGastoComision) {
                case Enums.GastoAdicional.Transporte:
                    $("#gastoTransporte").prop("checked", true);
                    break;
                case Enums.GastoAdicional.Alojamiento:
                    $("#gastoAlojamiento").prop("checked", true);
                    break;
                case Enums.GastoAdicional.Alimentacion:
                    $("#gastoAlimentacion").prop("checked", true);
                    break;
            }
        });
    },
    //Métodos para guardar la información
    ConfirmarDatosSolicitud: function () {
        var controlsToValidate = [
            { name: 'txtObjetoComision', label: 'Objeto de la comisión o desplazamiento' },
            { name: 'lstOrigenPaisComision', label: 'Pais Origen' },
            { name: 'txtOrigenComision', label: 'Lugar Orígen' },
            { name: 'lstDestinoPaisComision', label: 'Pais Destino' },
            { name: 'txtDestinoComision', label: 'Lugar Destino' },
            { name: 'txtFechaInicioComision', label: 'Fecha inicio de la comisión' },
            { name: 'txtFechaFinComision', label: 'Fecha finalización de la comisión' },
            { name: 'tipoViaje', label: 'Tipo de viaje' },
            { name: 'requiereTiquetesAereos', label: '¿Requiere tiquetes aéreos?' },
            { name: 'flSoporteAgenda', label: 'Soporte de agenda' },
            { name: 'EsAudiencia', label: '¿Es una Audiencia?' },
            { name: 'flSoporteCitacion', label: 'Soporte de Citación' },
            { name: 'flSoportePoder', label: 'Soporte de Poder' },
        ];

        if ($('#lstOrigenPaisComision').val() == Enums.DatoBasico.Colombia + '') {
            controlsToValidate.push(
                { name: 'lstOrigenDepartamentoComision', label: 'Departamento Origen' },
                { name: 'lstOrigenCiudadComision', label: 'Ciudad Origen' },
            )
        }
        if ($('#lstDestinoPaisComision').val() == Enums.DatoBasico.Colombia + '') {
            controlsToValidate.push(
                { name: 'lstDestinoDepartamentoComision', label: 'Departamento Destino' },
                { name: 'lstDestinoCiudadComision', label: 'Ciudad Destino' },
            )
        }
        var isDateValid = SolicitudController._ValidarCruceDeSolicitudes();

        var isValid = (isDateValid) ? Utils.Operations.ValidarControles(controlsToValidate) : false;
        if (isValid) {
            var tablaDesplazamiento = [];

            if (EsFuncionario) {
                tablaDesplazamiento = Utils.Operations.GetListFromArray(lstDesplazamientos, "IdTipoDesplazamiento", Enums.TipoDesplazamiento.ViaticosFuncionarios);
            } else {
                tablaDesplazamiento = Utils.Operations.GetListFromArray(lstDesplazamientos, "IdTipoDesplazamiento", Enums.TipoDesplazamiento.DesplazamientoContratista);
            }

            if (tablaDesplazamiento.length > 0) {
                if ($("input[name='requiereTiquetesAereos']").is(':checked')) {
                    if ($("#requiereTiquete").is(':checked')) {
                        var tablaRutaAerea = tablaDesplazamiento = Utils.Operations.GetListFromArray(lstDesplazamientos, "IdTipoDesplazamiento", Enums.TipoDesplazamiento.RutaAerea);
                        if (tablaRutaAerea.length > 0) {
                            var buttons = [
                                { label: 'Cancelar', action: function (dialogRef) { dialogRef.close(); } },
                                { icon: 'glyphicon glyphicon-floppy-disk', label: 'Continuar', cssClass: 'btn-primary', action: function (dialogRef) { SolicitudController.GuardarSolicitud(); } }
                            ];
                            Modal.BootstrapDialog.Ok('Solicitud de comisión', 'La información de la solicitud será enviada para aprobación. ¿desea continuar?', buttons);
                        } else {
                            Modal.BootstrapDialog.Warning('¡Atención!', 'Si marcó el campo <b>"¿Requiere tiquetes aéreos?"</b> con la opción <b>"Sí"</b>, por favor ingrese la información de ruta aérea.');
                        }
                    } else {
                        var buttons = [
                            { label: 'Cancelar', action: function (dialogRef) { dialogRef.close(); } },
                            { icon: 'glyphicon glyphicon-floppy-disk', label: 'Continuar', cssClass: 'btn-primary', action: function (dialogRef) { SolicitudController.GuardarSolicitud(); } }
                        ];
                        Modal.BootstrapDialog.Ok('Solicitud de comisión', 'La información de la solicitud será enviada para aprobación. ¿desea continuar?', buttons);
                    }
                } else {
                    var buttons = [
                        { label: 'Cancelar', action: function (dialogRef) { dialogRef.close(); } },
                        { icon: 'glyphicon glyphicon-floppy-disk', label: 'Continuar', cssClass: 'btn-primary', action: function (dialogRef) { SolicitudController.GuardarSolicitud(); } }
                    ];
                    Modal.BootstrapDialog.Ok('Solicitud de comisión', 'La información de la solicitud será enviada para aprobación. ¿desea continuar?', buttons);
                }
            } else {
                Modal.BootstrapDialog.Warning('¡Atención!', 'Para realizar esta solicitud debe diligenciar la información de viáticos y/o desplazamiento.');
            }
        } else {
            return false;
        }
    },
    GuardarSolicitud: function () {
        debugger;
        var obj = Utils.Operations.GetBasicObject('TSolicitud');
        obj.QueryConfig.FDtype = { FechaInicio: 'DateTime', FechaFinalizacion: 'DateTime' };
        obj.Item = SolicitudController.ObjSolicitud();
        obj.QueryConfig.FormatSqlDateTime = '101';
        obj.QueryConfig.CRAction = 8;
        obj.QueryConfig.WithTransaction = true;
        obj.QueryConfig.SetAuditFields = true;
        obj.SubQueryLists = [];
        obj.EmailSettings = SolicitudController.ObjEnvioEmail();
        //Se adicionan los gastos adicionales de la comisión
        if ($("input[name='gastosAdicionales']").is(":checked")) {
            var TGastoComision = SolicitudController.ObjGastoAdicional();
            obj.SubQueryLists.push(TGastoComision);
        }

        //Se recupera y adicionan los desplazamientos de la comisión
        var TDesplazamiento = SolicitudController.ObjDesplazamiento();
        obj.SubQueryLists.push(TDesplazamiento);

        EstadoSolicitud = obj.Item.IdEstado;
        var UEstadoSolicitud = SolicitudController.ObjUEstadoSolicitud();
        obj.SubQueryLists.push(UEstadoSolicitud);

        var withFiles = false;
        var formData = SolicitudController.GetFormDataSoportes();
        if (formData != null) {
            withFiles = true;
            var FileMappingRename = {};
            $.each(lstSoportesSolicitud, function (index, item) {
                FileMappingRename[item.File.name] = { TipoSoporte: item.TipoSoporte };
            });
            obj.DocumentSettings = {
                MappingInfo: {
                    "IdSolicitud": 'IdSolicitud',
                    "DocUsuario": $("#txtNumeroDocumento").val(),
                },
                //MappingInfoDb: {ShpId: 'ID_FILE',IdUsuario: null,IdSolicitud: 'IdSolicitud',IdTipoSoporte: 72,Nombre: 'FILE_NAME', Url: 'URL_FILE'},
                DocumentLibrary: 'SoportesSolicitudes',
                CharacterSeparation: '_',
                RenameMapping: [{ FieldName: '{FILE_NAME}' }, { FieldName: 'IdSolicitud' }, { FieldName: 'TipoSoporte' }],
                FileMappingRename: FileMappingRename,
                //SettingsKeyQuery: "CrearSoportes",
                //SettingsKeyConfig: "CrearSoportes"
            };

            formData.append("QueryList", JSON.stringify(obj));
        }

        Bext.Servicios.Ejecutar((formData == null) ? obj : formData, true, function (data) {
            if (data.Ok && data.Data.length > 0) {
                var solicitudId = data.Data[0].IdSolicitud;
                $("#SolicitudId").val(data.Data[0].IdSolicitud);
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
                    if (lstAttachments.length === lstSoportesSolicitud.length) {
                        var Tsoportes = SolicitudController.ObjSoportesSolicitud(lstAttachments, solicitudId);
                        Bext.Servicios.Ejecutar(Tsoportes, true, function (data) {
                            //debugger;
                            if (data.Ok) {
                                $(".SoportesSolicitud").val("");
                                var buttons = [
                                    { label: 'Aceptar', action: function (dialogRef) { window.location.href = "GestionSolicitud.aspx"; } }
                                ];
                                Modal.BootstrapDialog.Success('Registro de solicitud de comisión', 'La información de la solicitud de comisión ha sido enviada correctamente para su gestión.', buttons);
                            } else {
                                Modal.BootstrapDialog.Close();
                            }
                        });
                    } else {
                        var buttons = [
                            { label: 'Aceptar', action: function (dialogRef) { window.location.href = "GestionSolicitud.aspx"; } }
                        ];
                        Modal.BootstrapDialog.Success('Registro de solicitud de comisión', 'La información de la solicitud de comisión ha sido enviada correctamente para su gestión.', buttons);
                    }
                } else {
                    var buttons = [
                        { label: 'Aceptar', action: function (dialogRef) { window.location.href = "GestionSolicitud.aspx"; } }
                    ];
                    Modal.BootstrapDialog.Success('Registro de solicitud de comisión', 'La información de la solicitud de comisión ha sido enviada correctamente para su gestión.', buttons);
                }
            }
        }, null, null, null, withFiles);
    },
    ObjSolicitud: function () {

        var tiqueteAereo = null;
        if ($("input[name='requiereTiquetesAereos']").is(':checked')) {
            tiqueteAereo = parseInt($("input[name='requiereTiquetesAereos']:checked").val());
        }

        var item = {};
        item.IdSolicitud = (StorageUserData.SolicitudId !== null) ? parseInt(StorageUserData.SolicitudId) : 0;
        item.IdUsuario = StorageUserData.UserId;
        switch (requiereAprobacion) {
            case false:
                item.IdEstado = Enums.EstadoSolicitud.AprobadoSecretario;
                break;
            case true:
                item.IdEstado = Enums.EstadoSolicitud.PendienteAprobacionJefeArea;
                break;
            case null:
                if (SHPCurrentUser.Groups.indexOf(Enums.GruposUsuario.SecretarioGeneral) > -1) 
                {
                    item.IdEstado = Enums.EstadoSolicitud.AprobadoSecretario;
                    EstadoSolicitud = Enums.EstadoSolicitud.AprobadoSecretario;
                }
                else{
                    item.IdEstado = Enums.EstadoSolicitud.PendienteAprobacionJefeArea;
                    EstadoSolicitud = Enums.EstadoSolicitud.PendienteAprobacionJefeArea;
                }
                break
        }

        item.ObjetoComision = $("#txtObjetoComision").val();
        item.Origen = $("#txtOrigenComision").val();
        item.Destino = $("#txtDestinoComision").val();

        item.IdPaisOrigen = $("#lstOrigenPaisComision").val();
        item.IdPaisDestino = $("#lstDestinoPaisComision").val();

        if ($('#lstOrigenPaisComision').val() == Enums.DatoBasico.Colombia + '') {
            item.IdDepartamentoOrigen = parseInt($('#lstOrigenDepartamentoComision').val());
            item.IdCiudadOrigen = parseInt($('#lstOrigenCiudadComision').val());
        }
        if ($('#lstDestinoPaisComision').val() == Enums.DatoBasico.Colombia + '') {
            item.IdDepartamentoDestino = parseInt($('#lstDestinoDepartamentoComision').val());
            item.IdCiudadDestino = parseInt($('#lstDestinoCiudadComision').val());
        }
        
        item.FechaInicio = $("#txtFechaInicioComision").val();
        item.FechaFinalizacion = $("#txtFechaFinComision").val();
        item.EsViajeNacional = parseInt($("input[name='tipoViaje']:checked").val());
        item.RequiereTiquetesAereos = tiqueteAereo;
        item.EsAudiencia = EsAudiencia;


        item = Utils.Operations.SetAuditFields(item);

        return item;
    },
    ObjEnvioEmail: function () {
        EmailSettings = {
            PostFixAppKey: 'UngrdComisiones',
            Body: '<p>Buen Día.<br/></p> <p>Una comision le ha sido asignada para su correspondiente tramite.</p><br/>Dirijase al sistema de Comisiones Y expedición de Tiquetes para revisar la Solicitud.',
            Subject: 'Comisión Asignada',
            IsIsHtmlBody: true,
            EmailTo: EmailAsignado,
            EmailsTo: [],
            EmailsCC: [],
            EmailsBcc: [],
            AddItemAttachment: false,
            AddTemplate: true,
            MappingInfo: {},
            BodyDir: {},
            ExcecType: 1
        }
        return EmailSettings;
    },

    GetFormDataSoportes: function () {
        var allFiles = document.getElementsByClassName("SoportesSolicitud");
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
                    lstSoportesSolicitud.push(itemFile);
                }
            }
        });
        return (ok) ? formdata : null;
    },
    ObjSoportesSolicitud: function (lstSoportes, solicitudId) {
        var item = Utils.Operations.GetBasicObject('TSoportes');
        item.QueryConfig.CRAction = 8;
        item.QueryConfig.WithTransaction = true;
        item.QueryConfig.SetAuditFields = true;

        var items = [];

        $.each(lstSoportes, function (i, val) {
            var fname = val.FileName.substring(0, val.FileName.indexOf("."));
            var ts = fname.substring((fname.length - 2), fname.length);;

            var itemSoporte = {
                IdSoporte: 0,
                ShpId: val.ID,
                IdUsuario: null,
                IdSolicitud: solicitudId,
                IdTipoSoporte: parseInt(ts),
                Nombre: val.FileName,
                Url: val.Url
            };
            itemSoporte = Utils.Operations.SetAuditFields(itemSoporte);
            items.push(itemSoporte);
        });

        item.Items = items;
        return item;
    },
    ObjGastoAdicional: function () {

        var TGastoComision = Utils.Operations.GetBasicObject('TGastoComision');
        TGastoComision.QueryConfig.CRAction = 8;
        TGastoComision.QueryConfig.WithTransaction = true;
        TGastoComision.QueryConfig.SetAuditFields = true;

        var lstGastosAdicionales = [];
        $.each($("input[name='gastosAdicionales']"), function (index, item) {
            debugger;
            if (item.checked) {
                var gasto = {
                    IdGastoComision: 0,
                    IdSolicitud: (StorageUserData.SolicitudId !== null) ? parseInt(StorageUserData.SolicitudId) : -1,
                    IdTipoGastoComision: parseInt(item.value),
                }
                gasto = Utils.Operations.SetAuditFields(gasto);
                lstGastosAdicionales.push(gasto);
            }
        });
        TGastoComision.Items = lstGastosAdicionales;
        return TGastoComision;
    },
    ObjDesplazamiento: function () {

        $.each(lstDesplazamientos, function (key, item) {
            if (item.VirtualItem) {
                item.IdDesplazamiento = 0;
            }
            delete item['VirtualItem'];
        });

        var ObjTDesplazamiento = Utils.Operations.GetBasicObject('TDesplazamiento');
        ObjTDesplazamiento.QueryConfig.FDtype = { FechaInicio: 'DateTime', FechaFinalizacion: 'DateTime' };
        ObjTDesplazamiento.QueryConfig.FormatSqlDateTime = '101';
        ObjTDesplazamiento.QueryConfig.CRAction = 8;
        ObjTDesplazamiento.QueryConfig.WithTransaction = true;
        ObjTDesplazamiento.QueryConfig.SetAuditFields = true;
        ObjTDesplazamiento.Items = lstDesplazamientos;
        return ObjTDesplazamiento;
    },
    ConfirmarEliminacionSoporte: function (elem, soporteId, itemId) {
        var buttons = [
            { label: 'Cancelar', action: function (dialogRef) { dialogRef.close(); } },
            { icon: 'glyphicon glyphicon-trash', label: 'Continuar', cssClass: 'btn-danger', action: function (dialogRef) { SolicitudController.EliminarSoporteDb(elem, soporteId, itemId); } }
        ];
        Modal.BootstrapDialog.Ok('Registro de solicitud de comisión', '¿Está seguro de eliminar el soporte?', buttons);
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
                SolicitudController.EliminarSoporteDocumenLibrary(elem, itemId);
            }
        });
    },
    EliminarSoporteDocumenLibrary: function (elem, itemId) {
        ////debugger;
        var obj = {
            Config: {
                Token: '6s/hftT3pTf8L3yJ94nXbkxrtjfIyES9',
                WebServiceName: "",
            },
            List: 'SoportesSolicitudes',
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
                SolicitudController.CargarSoportesSolicitud(parseInt($("#SolicitudId").val()));
                //Modal.BootstrapDialog.Close();
            } else {
                Modal.BootstrapDialog.Close();
            }
        });
    },
    ConfirmarActualizacionSolicitud: function (btn) {
        if (btn.id == 'btnRechazarSolicitud') {
            EstadoSolicitud = Enums.EstadoSolicitud.Rechazada;
            requiereAprobacion = false;
            var body = '<div class="col-sm-12">' +
                '<div class="row form-group">' +
                '<label class="label-control">Describa en este espacio los motivos para rechazar la solicitud.</label>' +
                '<textarea class="form-control" rows="8" id="txtModificacion"></textarea></div>' +
                '</div>' +
                '</div>'
            var buttons = [
                { label: 'Cancelar', action: function (dialogRef) { dialogRef.close(); } },
                { icon: 'glyphicon glyphicon-ok', label: 'Continuar', cssClass: 'btn-success', action: function (dialogRef) { SolicitudController.TramitarComisión(); } }
            ];
            Modal.BootstrapDialog.Form('Observaciones para la Comisión', body, BootstrapDialog.SIZE_NORMAL, true, buttons);
            SolicitudController.lstUsuariosgrupo(Dependencia, Enums.GruposUsuario.Usuario);
        } if (btn.id == 'btnAprobarSolicitud') {
            var buttons = [
                { label: 'Cancelar', action: function (dialogRef) { dialogRef.close(); } },
                { icon: 'glyphicon glyphicon-ok', label: 'Continuar', cssClass: 'btn-success', action: function (dialogRef) { SolicitudController.TramitarComisión(); } }
            ];

            if (SHPCurrentUser.Groups.indexOf(Enums.GruposUsuario.SecretarioGeneral) > -1) {
                EstadoSolicitud = Enums.EstadoSolicitud.AprobadoSecretario;
                requiereAprobacion = false;
                SolicitudController.lstUsuariosgrupo(Dependencia, Enums.GruposUsuario.Usuario);
            } else if (SHPCurrentUser.Groups.indexOf(Enums.GruposUsuario.JefeArea) > -1) {
                EstadoSolicitud = Enums.EstadoSolicitud.PendienteAprobacionSecretario;
                requiereAprobacion = false;
                SolicitudController.lstUsuariosgrupo(Dependencia, Enums.GruposUsuario.SecretarioGeneral);
            }
            Modal.BootstrapDialog.Ok('Aprobación Solicitud de Comisión', '¿Está seguro de Aprobar la Comisión?', buttons);
            var correoUser = SolicitudController.MapearUsuarioSolicitud

        } if (btn.id == 'btnSolicitarModificacion') {
            EstadoSolicitud = Enums.EstadoSolicitud.EnDevolucion;
            requiereAprobacion = true;
            var body = '<div class="col-sm-12">' +
                '<div class="row form-group">' +
                '<label class="form-control">Describa las modificaciones que se deben realizar en la solicitud.</label>' +
                '<textarea class="form-control" rows="8" id="txtModificacion"></textarea></div>' +
                '</div>' +
                '</div>'
            if (SHPCurrentUser.Groups.indexOf(Enums.GruposUsuario.TalentoHumano) > -1) {
                body += '<div class="row form-group" id="divAprobacion">' +
                    '<div class="col-md-8">' +
                    '<label class="label-control" type="text">¿Requiere Aprobación del Jefe de área.? </label>' +
                    '</div>' +
                    '<div class=" col-md-4">' +
                    '<label class="radio-inline"><input type="radio" name="requiereAprobacion" id="requiereAprobacion" value="1">Sí</label><label class="radio-inline"><input type="radio" name="requiereAprobacion" id="noRequiereAprobacion" value="0">No</label>' +
                    '</div>' +
                    '</div>'
            }
            var buttons = [
                { label: 'Cancelar', action: function (dialogRef) { dialogRef.close(); } },
                { icon: 'glyphicon glyphicon-ok', label: 'Continuar', cssClass: 'btn-success', action: function (dialogRef) { SolicitudController.TramitarComisión(); } }
            ];
            Modal.BootstrapDialog.Form('Observaciones para la Comisión', body, BootstrapDialog.SIZE_NORMAL, true, buttons);
        }
    },
    TramitarComisión: function () {
        var obj = Utils.Operations.GetBasicObject('TSolicitud');
        obj.Item = SolicitudController.objEstadoSolicitud();

        obj.QueryConfig.CRAction = 8;
        obj.QueryConfig.WithTransaction = true;
        obj.QueryConfig.SetAuditFields = true;
        obj.SubQueryLists = [];
        obj.EmailSettings = SolicitudController.ObjEnvioEmail();

        var UEstadoSolicitud = SolicitudController.ObjUEstadoSolicitud();
        obj.SubQueryLists.push(UEstadoSolicitud);

        Bext.Servicios.Ejecutar(obj, true, function (data) {

            if (data.Ok) {
                window.location.href = "GestionSolicitud.aspx";
            } else {
                Modal.BootstrapDialog.Success('Solicitud No Guardada', 'No ha sido posible actualizar el Estado de la Comisión, intente más tarde.');
                window.location.href = "GestionSolicitud.aspx";
            }
        });
    },
    objEstadoSolicitud: function () {
        var items = {
            IdSolicitud: (StorageUserData.SolicitudId !== null) ? parseInt(StorageUserData.SolicitudId) : 0,
            IdUsuario: StorageUserData.UserId,
            IdEstado: EstadoSolicitud,
        };
        items = Utils.Operations.SetAuditFields(items);
        return items;
    },
    ObjUEstadoSolicitud: function () {

        if (EstadoSolicitud == Enums.EstadoSolicitud.Rechazada) {
            justificacion = $("#txtModificacion").val();
        } else if (EstadoSolicitud == Enums.EstadoSolicitud.EnDevolucion) {
            if ($("input[name='requiereAprobacion']").is(':checked')) {
                requiereAprobacion = parseInt($("input[name='requiereAprobacion']:checked").val());
            }
            justificacion = $("#txtModificacion").val();
        } else {
            justificacion = justificacion;
        }

        var UEstadoSolicitud = Utils.Operations.GetBasicObject('UEstadoSolicitud');
        UEstadoSolicitud.QueryConfig.CRAction = 8;
        UEstadoSolicitud.QueryConfig.WithTransaction = true;
        UEstadoSolicitud.QueryConfig.SetAuditFields = true;

        var item = {
            IdUEstadoSolicitud: 0,
            IdSolicitud: (StorageUserData.SolicitudId !== null) ? parseInt(StorageUserData.SolicitudId) : 0,
            IdEstadoSolicitud: EstadoSolicitud,
            RequiereAprobacion: requiereAprobacion,
            Justificacion: justificacion
        };

        item = Utils.Operations.SetAuditFields(item);
        UEstadoSolicitud.Item = item;
        return UEstadoSolicitud;
    },
    GuardarResolucion: function () {

        var solicitudId = StorageUserData.SolicitudId;
        var obj = Utils.Operations.GetBasicObject('TSoportes');
        obj.QueryConfig.CRAction = 8;
        obj.QueryConfig.WithTransaction = true;
        obj.QueryConfig.SetAuditFields = true;

        var item = {
            IdSoporte: 0,
            ShpId: 0,
            IdUsuario: null,
            IdSolicitud: solicitudId,
            IdTipoSoporte: 80,
            Nombre: "",
            Url: ''
        }
        item = Utils.Operations.SetAuditFields(item);
        obj.Item = item;

        var formData = SolicitudController.GetFormDataSoportes();

        if (formData != null) {
            withFiles = true;
            var FileMappingRename = {};
            $.each(lstSoportesSolicitud, function (index, item) {
                FileMappingRename[item.File.name] = { TipoSoporte: item.TipoSoporte };
            });
            obj.DocumentSettings = {
                MappingInfo: {
                    "IdSolicitud": 'IdSolicitud',
                    "DocUsuario": $("#txtNumeroDocumento").val(),
                },
                DocumentLibrary: 'SoportesSolicitudes',
                CharacterSeparation: '_',
                RenameMapping: [{ FieldName: '{FILE_NAME}' }, { FieldName: 'IdSolicitud' }, { FieldName: 'TipoSoporte' }],
                FileMappingRename: FileMappingRename,
            };

            formData.append("QueryList", JSON.stringify(obj));
        }

        /*for(var pair of formData.entries()) {
            console.log(pair[0]+","+pair[1]);
        }*/
        Bext.Servicios.Ejecutar((formData == null) ? obj : formData, true, function (data) {
            debugger;
            if (data.Ok && data.Data.length > 0) {
                var soporteId = data.Data[0].IdSoporte;
                var containAttachments = false;
                var lstAttachments = [];
                $.each(data.Data, function (index, item) {
                    if (item.ItemAttachments !== undefined) {
                        if (item.ItemAttachments.length > 0) {
                            lstAttachments = item.ItemAttachments;
                            containAttachments = true;
                        }
                    }
                });
                if (containAttachments) {
                    if (lstAttachments.length === lstSoportesSolicitud.length) {
                        //var Tsoportes = SolicitudController.ObjSoportesSolicitud(lstAttachments, solicitudId);
                        var obj = Utils.Operations.GetBasicObject('TSoportes');
                        obj.QueryConfig.CRAction = 8;
                        obj.QueryConfig.WithTransaction = true;
                        obj.QueryConfig.SetAuditFields = true;

                        var item = {
                            IdSoporte: soporteId,
                            ShpId: lstAttachments[0].ID,
                            IdUsuario: null,
                            IdSolicitud: solicitudId,
                            IdTipoSoporte: 80,
                            Nombre: lstAttachments[0].FileName,
                            Url: lstAttachments[0].Url
                        }
                        item = Utils.Operations.SetAuditFields(item);
                        obj.Item = item;
                        Bext.Servicios.Ejecutar(obj, true, function (data) {
                            //debugger;
                            if (data.Ok) {
                                $(".SoportesSolicitud").val("");
                                var buttons = [
                                    { label: 'Aceptar', action: function (dialogRef) { window.location.href = "GestionSolicitud.aspx"; } }
                                ];
                                Modal.BootstrapDialog.Success('Cargue de Resolución de comisión', 'La resolución ha sido cargada correctamente a la comisión .', buttons);
                            } else {
                                Modal.BootstrapDialog.Close();
                            }
                        });
                    } else {
                        var buttons = [
                            { label: 'Aceptar', action: function (dialogRef) { window.location.href = "GestionSolicitud.aspx"; } }
                        ];
                        Modal.BootstrapDialog.Success('Cargue de Resolución de comisión', 'La resolución ha sido cargada correctamente a la comisión .', buttons);
                    }
                } else {
                    var buttons = [
                        { label: 'Aceptar', action: function (dialogRef) { window.location.href = "GestionSolicitud.aspx"; } }
                    ];
                    Modal.BootstrapDialog.Success('Registro de solicitud de comisión', 'La información de la solicitud de comisión ha sido enviada correctamente para su gestión.', buttons);
                }
            } else {
                Modal.BootstrapDialog.Warning('Registro de solicitud de comisión', "El soporte de Resolución no fue cargado, intente más tarde");

            }
        }, null, null, null, withFiles);
    },
    CargarSoporteContrato: function (IdUsuario) {
        var obj = Utils.Operations.GetBasicObject('ConsultarSoportesUsuario');
        obj.Item = {
            IdUsuario: IdUsuario,
        }
        Bext.Servicios.Ejecutar(obj, true, function (data) {
            debugger;
            if (data.Ok && data.Data.length !== 0) {
                SolicitudController.MapearContrato(data.Data);
            }
        });
    },
    MapearContrato: function (lstSoportes) {
        $.each(lstSoportes, function (i, val) {
            var inputFiles = document.getElementsByClassName("SoportesUsuario");
            $.each(inputFiles, function (index, item) {
                if (parseInt($(item).attr("data-tipoSoporte")) === val.IdTipoSoporte) {
                    var parentElemSoportes = $(item).parent();
                    var ctrlDescargar = $(parentElemSoportes).find("a");
                    $(ctrlDescargar).show();
                    $(ctrlDescargar).html(val.Nombre + "&nbsp;<i class='fa fa-cloud-download'></i>");
                    $(ctrlDescargar).attr("href", val.Url);
                    $(item).hide();
                    return false;
                }
            });
        });
    },
    ValidarEstadoSolicitud: function () {
        //Validar estado de solicitud
        if (EstadoSolicitud != Enums.EstadoSolicitud.PendienteAprobacionJefeArea
            && EstadoSolicitud != Enums.EstadoSolicitud.EnDevolucion) {
            SolicitudController._InhabilitarFormulario();
        }
    },
    lstUsuariosgrupo: function (Dependencia, groupName) {
        if (groupName != Enums.GruposUsuario.Usuario) {
            $.ajax({
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/sitegroups?$filter=LoginName eq '" + groupName + "'&$expand=Users",
                async: false,
                method: "GET",
                contentType: "application/json;odata=verbose",
                headers: {
                    "Accept": "application/json;odata=verbose"
                },
                success: function (data) {
                    debugger;
                    if (data.d.results.length > 0) {
                        usersGrroup = data.d.results[0].Users;
                        $.each(usersGrroup.results, function (i, val) {
                            SHPUserId = val.Id;
                            var obj = Utils.Operations.GetBasicObject('ObtenerUsuario');
                            obj.Item = {
                                SpId: SHPUserId,
                                IdUsuario: null,
                                NumeroDocumento: null
                            }
                            Bext.Servicios.Ejecutar(obj, true, function (data) {
                                debugger;
                                if (data.Data.length !== 0) {
                                    var dependenciajefeArea = data.Data[0].Dependencia;

                                    if (Dependencia == dependenciajefeArea) {
                                        EmailAsignado = data.Data[0].Correo;
                                    }
                                }
                            });
                        });
                    }
                },
            });
        } else {
            EmailAsignado = correoSolicitante;
        }
    },
}

$(function () {
    SolicitudController.onReady();
});

//$(window).bind('beforeunload', function () {
//    if (confirm("¿Desea abandonar esta página?, si lo hace, perderá la información cargada en este formulario'")) {
//        history.back();
//    } else {
//        return false;
//    }
//});