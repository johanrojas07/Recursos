var lstDatosBasicos = [];
var Utils = {};
Utils.Operations = Utils.Operations || (function ($) {

    return {
        GetUserInfo: function () {
            var user = {};
            var obj = {
                UrlSite: _spPageContextInfo.webAbsoluteUrl,
                RowLimit: '0',
                AddFileUrl: false,
                GetUserInfo: true
            };

            Bext.Servicios.Ejecutar(obj, true, function (data) {
                debugger;
                if (data.Data.length > 0) {
                    user = data.Data[0];
                }
                Modal.BootstrapDialog.Close();
            });

            return user;
        },
        InitializeDatePicker: function (selectors, withTime) {

            var format = 'YYYY-MM-DD';
            if (withTime !== null && withTime !== undefined) {
                if (withTime) {
                    format = 'YYYY-MM-DD HH:mm:ss';
                }
            }

            $(selectors).each(function () {
                $(this).datetimepicker({
                    //format: "dd/mm/yyyy",
                    format: format,
                    locale: 'es',
                    showClear: true,
                    //language: "es",
                    //autoclose: true,
                    //todayHighlight: true
                });
            });
        },
        InicializeDataTable: function (tableSelector, columnDefs) {

            if (columnDefs === null && columnDefs === undefined) {
                columnDefs = [];
            }

            var table = $(tableSelector).DataTable({
                "destroy": true,
                "language": {
                    "decimal": "",
                    "emptyTable": "No hay registros disponibles",
                    "info": "Mostrando _START_ hasta _END_ de _TOTAL_ registros",
                    "infoEmpty": "Mostrando 0 de 0 registros",
                    "infoFiltered": "(filtrado de _MAX_ registros)",
                    "infoPostFix": "",
                    "thousands": ",",
                    "lengthMenu": "Mostrando _MENU_ registros",
                    "loadingRecords": "Cargando...",
                    "processing": "Procesando...",
                    "search": "Buscar:",
                    "zeroRecords": "No se han encontrado registros según el filtro",
                    "paginate": {
                        "first": "Primera página",
                        "last": "Última página",
                        "next": "Siguiente",
                        "previous": "Atrás"
                    },
                    "aria": {
                        "sortAscending": ": activar para ordenar las columnas ascendentemente",
                        "sortDescending": ": activar para ordenar las columnas descendentemente"
                    }
                },
                "columns": columnDefs
                //"columnDefs": columnDefs,
            });

            //return table;
        },
        InicializeServerSideDataTable: function (tableSelector, obj, columns, columnDefs, order, sort) {

            if (order === null && order === undefined) {
                order = [[0, "asc"]]
            }
            if (sort === null && sort === undefined) {
                sort = true;
            }

            var table = $(tableSelector).DataTable({
                "destroy": true,
                "scrollX": true,
                "processing": true,
                "serverSide": true,
                //"bSort": true,
                //"order": order,
                "bSort": sort,
                "ajax": {
                    url: _spPageContextInfo.webAbsoluteUrl + "/_layouts/15/ProcesosJuridicos/ProcesosJuridicosServices.aspx",
                    type: 'POST',
                    data: { QueryList: JSON.stringify(obj) },
                    dataSrc: "data"
                },
                "language": {
                    "decimal": "",
                    "emptyTable": "No hay registros disponibles",
                    "info": "Mostrando _START_ hasta _END_ de _TOTAL_ registros",
                    "infoEmpty": "Mostrando 0 de 0 registros",
                    "infoFiltered": "(filtrado de _MAX_ registros)",
                    "infoPostFix": "",
                    "thousands": ",",
                    "lengthMenu": "Mostrando _MENU_ registros",
                    "loadingRecords": "Cargando...",
                    "processing": "<h4>Procesando...</h4><div class='progress progress-striped active' style='margin-left:auto;margin-right:auto;width: 90%;margin-bottom: 0;'><div class='progress-bar progress-bar-primary' style='width: 100%'></div></div>",
                    "search": "Buscar:",
                    "zeroRecords": "No se han encontrado registros según el filtro",
                    "paginate": {
                        "first": "Primera página",
                        "last": "Última página",
                        "next": "Siguiente",
                        "previous": "Atrás"
                    },
                    "aria": {
                        "sortAscending": ": activar para ordenar las columnas ascendentemente",
                        "sortDescending": ": activar para ordenar las columnas descendentemente"
                    }
                },
                "columns": columns,
                "columnDefs": columnDefs,
            });

            return table;
        },
        ClearDataTable: function (tableSelector) {
            $(tableSelector).each(function () {
                var table = $(this).DataTable();
                table.rows().remove().draw();
            });
        },
        RemoveDatatable: function (tableSelector) {
            var a = $(tableSelector).dataTable()
            a.fnDestroy();
        },
        EmailRegex: function (selectors) {
            $(selectors).each(function () {
                $(this).keyup(function (e) {

                    var smMessage = $("#" + this.id + "_validation");
                    var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                    if (regex.test(this.value)) {
                        smMessage.text("");
                        smMessage.hide();
                    } else {
                        smMessage.text("El correo ingresado no es válido");
                        smMessage.show();
                    }
                });
            });
        },
        InputNumber: function (selectores) {
            $(selectores).each(function () {
                $(this).keypress(function (tecla) {
                    if (tecla.charCode > 31 && (tecla.charCode < 48 || tecla.charCode > 57)) {
                        return false;
                    }
                    return true;
                });
            });
        },
        InputNumberDecimals: function (selectores) {
            $(selectores).each(function () {
                $(this).keypress(function (evt) {
                    var charCode = (evt.which) ? evt.which : event.keyCode
                    var value = this.value;
                    var dotcontains = value.indexOf(".") != -1;
                    if (dotcontains)
                        if (charCode == 46) return false;
                    if (charCode == 46) return true;
                    if (charCode > 31 && (charCode < 48 || charCode > 57))
                        return false;
                    return true;
                });
            });
        },
        GenerateGuid: function () {
            var d = new Date().getTime();
            if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
                d += performance.now(); //use high-precision timer if available
            }
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            //return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            //    return v.toString(16);
            //});
        },
        SetSessionStorage: function (key, value) {
            sessionStorage.setItem(key, value);
        },
        GetSessionStorage: function (key) {
            return sessionStorage.getItem(key);
        },
        PopulateSelect: function (selector, list, propertyValue, propertyText) {
            $(selector).find('option:not(:first)').remove();
            var htmlOptions = '';
            $.each(list, function (index, item) {
                htmlOptions += '<option value="' + item[propertyValue] + '">' + item[propertyText] + '</option>';
            });
            $(selector).append(htmlOptions);
        },
        GetBasicObject: function (settingsKeyQuery, settingsKeyConfig) {

            var keyQuery = (settingsKeyQuery != null) ? settingsKeyQuery : null;
            var keyConfig = (settingsKeyConfig != null) ? settingsKeyConfig : "UngrdComisiones";

            var obj = {
                Config: {
                    Token: 'URYgrHVy6uWi5Qwot2zKJtFF0BojSj9niPmDTrVbEOndo6L/4UaWVfQ3Djxso3Pj',
                    WebServiceName: "",
                    AppName: "UngrdComisiones"
                },
                List: 'BextGeneralListConfigAppsUngrdComisiones',
                UrlSite: _spPageContextInfo.webAbsoluteUrl,
                QueryConfig: {
                    SettingsKeyQuery: keyQuery,
                    SettingsKeyConfig: keyConfig,
                }
            };
            return obj;
        },
        SetAuditFields: function (model) {

            model.FechaCreacion = null;
            model.UsuarioCreacion = null;
            model.MaquinaCreacion = null;
            model.FechaActualizacion = null;
            model.UsuarioActualizacion = null;
            model.MaquinaActualizacion = null;
            model.Activo = true;

            return model;
        },
        ConvertToJavascriptDate: function(strDate){
            var dateParts = strDate.split("-");
            var dateResult = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            return dateResult;
        },
        FormatDate: function (jsonDate, setFormat) {
            var dateReturn = '';
            var re = /-?\d+/;
            var m = re.exec(jsonDate);
            var d = new Date(parseInt(m[0]));
            var month = (parseInt(d.getMonth()) + 1).toString().length > 1 ? parseInt(d.getMonth()) + 1 : "0" + (parseInt(d.getMonth()) + 1).toString();
            var day = d.getDate().toString().length > 1 ? d.getDate() : "0" + d.getDate();

            switch (setFormat) {
                case 'dd/mm/yyyy':
                    dateReturn = day + "/" + month + "/" + d.getFullYear();
                    break;
                case 'yyyy/mm/dd':
                    dateReturn = d.getFullYear() + "/" + month + "/" + day;
                    break;
                case 'yyyy-mm-dd':
                    dateReturn = d.getFullYear() + "-" + month + "-" + day;
                    break;
                case 'mm-dd-yyyy':
                    dateReturn = day + "-" + month + "-" + d.getFullYear();
                    break;
            };

            return dateReturn;
        },
        ConvertDateToFormat: function (date, formatoSalida) {

            var stringDate = "";
            if (typeof date === 'object') {

                var d = (date.getDate() < 10) ? "0" + date.getDate() : date.getDate();
                var m = ((date.getMonth() + 1) < 10) ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
                var y = date.getFullYear();

                switch (formatoSalida) {
                    case "yy/mm/dd":
                        stringDate = y + "/" + m + "/" + d;
                        break;
                    case "mm/dd/yy":
                        stringDate = m + '/' + d + '/' + y;
                        break;
                    case "dd/mm/yy":
                        stringDate = d + '/' + m + '/' + y;
                        break;
                    case "yy-mm-dd":
                        stringDate = y + "-" + m + "-" + d;
                        break;
                    case "mm-dd-yy":
                        stringDate = m + "-" + d + "-" + y;
                        break;
                    case "dd-mm-yy":
                        stringDate = d + '-' + m + '-' + y;
                        break;
                }
            }
            return stringDate;
        },
        AddDays: function (date, days) {
            var result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        },
        ExportToCSV: function (args, lst) {
            var data, filename, link;
            var csv = Utils.Operations.ConvertArrayOfObjectsToCSV({
                data: lst
            });
            if (csv == null) return;

            filename = args.filename || 'export.csv';

            //window.open('data:application/vnd.ms-excel,' + csv);

            link = document.createElement('a');
            link.setAttribute("href", "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(csv));
            link.setAttribute('download', filename);
            link.click();
        },
        ConvertArrayOfObjectsToCSV: function (args) {

            var result, ctr, keys, columnDelimiter, lineDelimiter, data;

            data = args.data || null;
            if (data == null || !data.length) {
                return null;
            }

            columnDelimiter = args.columnDelimiter || ',';
            lineDelimiter = args.lineDelimiter || '\n';

            keys = Object.keys(data[0]);

            result = '';
            result += keys.join(columnDelimiter);
            result += lineDelimiter;

            data.forEach(function (item) {
                ctr = 0;
                keys.forEach(function (key) {
                    if (ctr > 0) result += columnDelimiter;

                    result += item[key];
                    ctr++;
                });
                result += lineDelimiter;
            });

            console.log(result);
            return result;
        },
        FnExcelReport: function (strTableContent, fileName) {

            var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
            tab_text += '<head><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';
            tab_text += '<x:Name>' + fileName + '</x:Name>';
            tab_text += '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
            tab_text += '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';
            tab_text += '<table style="font-family:Arial">' + strTableContent + '</table></body></html>';

            var data_type = 'data:application/vnd.ms-excel;charset=utf-8,%EF%BB%BF';

            var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");

            if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
                if (window.navigator.msSaveBlob) {
                    var blob = new Blob([tab_text], {
                        type: "application/csv;charset=utf-8;"
                    });
                    navigator.msSaveBlob(blob, fileName + '.xls');
                }
            } else {
                link = document.createElement('a');
                link.setAttribute("href", data_type + ', ' + encodeURIComponent(tab_text));
                link.setAttribute('download', fileName + '.xls');
                link.click();
            }
        },
        SimpleExportToExcel: function (htmlTable, e) {
            var objExport = '<table border="1">' + htmlTable + '</table>';
            window.open('data:application/vnd.ms-excel;base64,' + Utils.Operations.Base64_encode(objExport));
            e.preventDefault();
        },
        Base64_encode: function (data) {
            var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
              ac = 0,
              enc = "",
              tmp_arr = [];

            if (!data) {
                return data;
            }

            do { // pack three octets into four hexets
                o1 = data.charCodeAt(i++);
                o2 = data.charCodeAt(i++);
                o3 = data.charCodeAt(i++);

                bits = o1 << 16 | o2 << 8 | o3;

                h1 = bits >> 18 & 0x3f;
                h2 = bits >> 12 & 0x3f;
                h3 = bits >> 6 & 0x3f;
                h4 = bits & 0x3f;

                // use hexets to index into b64, and append result to encoded string
                tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
            } while (i < data.length);

            enc = tmp_arr.join('');

            var r = data.length % 3;

            return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
        },
        GetCurrentUserWithDetails: function () {
            var userDetails = null;
            var endpointUrl = _spPageContextInfo.webAbsoluteUrl + '/_api/web/currentuser/?$expand=groups';
            var resp = $.ajax({
                url: endpointUrl,
                async: false,
                method: "GET",
                contentType: "application/json;odata=verbose",
                headers: {
                    "Accept": "application/json;odata=verbose"
                },
                success: function (data) {
                    userDetails = (data.d);
                    return true;
                },
            });

            return userDetails;
        },
        AddZerosFormat: function (number, cant) {
            var data = "";
            if (number.length < cant) {
                for (var i = 0 ; i < cant - 1; i++) {
                    data += "0";
                }
            }
            data += number;
            return data;
        },
        ValidarControles(lstControles) {

            if (lstControles.length > 0) {

                var getCampos = '';
                $.each(lstControles, function (index, ctrl) {

                    if (typeof ctrl === 'object') {

                        //var input = $("input[name='" + ctrl.name + "']");
                        var input = $("[name='" + ctrl.name + "']");
                        var inputType = input.prop('type');

                        if (input.is(":visible")) {
                            switch (inputType) {
                                case "text":
                                    if (input.val() === '') {
                                        input.closest("div.form-group").addClass('has-error');
                                        getCampos += '<small class="text-danger">El campo <b>"' + ctrl.label + '"</b> es obligatorio.</small><br />';
                                    } else {
                                        //if (input.attr("pattern") !== undefined && input.attr("pattern") !== "") {
                                        //    var regex = input.attr("pattern");
                                        //    if (regex.test(input.val())) {
                                        //        input.closest("div.form-group").addClass('has-error');
                                        //        getCampos += '<small class="text-danger">El formato del campo <b>"' + ctrl.label + '"</b> no es válido.</small><br />';
                                        //    } else {
                                        //        input.closest("div.form-group").removeClass('has-error');
                                        //    }
                                        //} else {
                                        //    input.closest("div.form-group").removeClass('has-error');
                                        //}
                                        input.closest("div.form-group").removeClass('has-error');
                                    }
                                    break;

                                case "date":
                                    if (input.val() === '') {
                                        input.closest("div.form-group").addClass('has-error');
                                        getCampos += '<small class="text-danger">El campo <b>"' + ctrl.label + '"</b> es obligatorio.</small><br />';
                                    } else {
                                        input.closest("div.form-group").removeClass('has-error');
                                    }
                                    break;

                                case "select-one":
                                    if (input.val() === '' || input.val() === null) {
                                        input.closest("div.form-group").addClass('has-error');
                                        getCampos += '<small class="text-danger">El campo <b>"' + ctrl.label + '"</b> es obligatorio.</small><br />';
                                    } else {
                                        input.closest("div.form-group").removeClass('has-error');
                                    }
                                    break;

                                case "select-multiple":
                                    if (input.val().length === 0) {
                                        input.closest("div.form-group").addClass('has-error');
                                        getCampos += '<small class="text-danger">El campo <b>"' + ctrl.label + '"</b> es obligatorio.</small><br />';
                                    } else {
                                        input.closest("div.form-group").removeClass('has-error');
                                    }
                                    break;

                                case "textarea":
                                    if (input.val() === '') {
                                        input.closest("div.form-group").addClass('has-error');
                                        getCampos += '<small class="text-danger">El campo <b>"' + ctrl.label + '"</b> es obligatorio.</small><br />';
                                    } else {
                                        input.closest("div.form-group").removeClass('has-error');
                                    }
                                    break;

                                case "file":
                                    if (input.val() === '') {
                                        input.closest("div.form-group").addClass('has-error');
                                        getCampos += '<small class="text-danger">El campo <b>"' + ctrl.label + '"</b> es obligatorio.</small><br />';
                                    } else {
                                        input.closest("div.form-group").removeClass('has-error');
                                    }
                                    break;
                                case "radio":
                                    if (!input.is(':checked')) {
                                        input.closest("div.form-group").addClass('has-error');
                                        getCampos += '<small class="text-danger">El campo <b>"' + ctrl.label + '"</b> es obligatorio.</small><br />';
                                    } else {
                                        input.closest("div.form-group").removeClass('has-error');
                                    }
                                    break;
                            }
                        } else {
                            input.closest("div.form-group").removeClass('has-error');
                        }
                    }
                });

                if (getCampos != "") {
                    Modal.BootstrapDialog.Warning('Formulario inválido', '<p class="text-justify">No se puede enviar la información, ya que no diligenció todos los campos requeridos en este formulario, busque las secciones marcadas en color rojo, ingrese la información y vuelva a intentarlo.</p>' + getCampos);
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        },
        GetBase64Image: function(img) {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL("image/png");
            return dataURL;
        },
        FormatCurrency: function (controles) {
            $(controles).each(function () {
                $(this).blur(function () {
                    $(this).formatCurrency({ colorize: true, negativeFormat: '-%s%n', roundToDecimalPlace: 2 });
                })
                .keyup(function (e) {
                    var e = window.event || e;
                    var keyUnicode = e.charCode || e.keyCode;
                    if (e !== undefined) {
                        switch (keyUnicode) {
                            case 16: break; // Shift
                            case 17: break; // Ctrl
                            case 18: break; // Alt
                            case 27: this.value = ''; break; // Esc: clear entry
                            case 35: break; // End
                            case 36: break; // Home
                            case 37: break; // cursor left
                            case 38: break; // cursor up
                            case 39: break; // cursor right
                            case 40: break; // cursor down
                            case 78: break; // N (Opera 9.63+ maps the "." from the number key section to the "N" key too!) (See: http://unixpapa.com/js/key.html search for ". Del")
                            case 110: break; // . number block (Opera 9.63+ maps the "." from the number block to the "N" key (78) !!!)
                            case 190: break; // .
                            default: $(this).formatCurrency({ colorize: true, negativeFormat: '-%s%n', roundToDecimalPlace: 0, eventOnDecimalsEntered: true });
                        }
                    }
                })
                .keypress(function (key) {
                    if (key.charCode > 31 && (key.charCode < 48 || key.charCode > 57))
                        return false;
                });
            });
        },
        CurrencyString: function (value) {
            var result = "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return result;
        },
        GetListFromArray: function (lst, prop, value) {

            var result = [];
            if (lst.length > 0) {
                var i = 0;
                for (i = 0; i < lst.length; i++) {
                    if (lst[i][prop] === value) {
                        result.push(lst[i]);
                    }
                }
            }
            return result;
        },
        GetObjectFromArray: function (lst, prop, value) {
            var objResult = {};
            if (lst.length > 0) {
                var i = 0;
                for (i = 0; i < lst.length; i++) {
                    if (lst[i][prop] === value) {
                        objResult = lst[i];
                        break;
                    }
                }
            }
            return objResult;
        },
        GetDescription: function (lst, prop, value) {
            var text = "";
            if (lst.length > 0) {
                var i = 0;
                for (i = 0; i < lst.length; i++) {
                    if (lst[i][prop] === value) {
                        text = lst[i].Descripcion;
                        break;
                    }
                }
            }
            return text;
        }
    }
})(jQuery);