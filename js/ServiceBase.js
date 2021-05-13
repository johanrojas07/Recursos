//Definición del namespace
var Bext = {};
Bext.Servicios = Bext.Servicios || (function ($) {

    var _urlSite = document.location.origin == null || window.location.origin == false ? window.location.protocol + '//' + window.location.hostname + (window.location.port ? (':' + window.location.port) : '') : document.location.origin;

    //Captura el evento Success de la petición ajax
    var _OnSuccess = function callbackSuccesDefault(response) {
        alert(response.d.Message);
    }

    //Captura el evento Warning de la petición ajax
    var _OnWarning = function (response) {
        Modal.BootstrapDialog.Close();
    }

    //Captura y manejo de errores.
    var _OnError = function (xhr, errorType, exception) {

        var $html = "<p><h4>Ha ocurrido un error.</h4></p>";

        if (xhr.d !== undefined) {
            var coreError = JSON.parse(xhr.d);
            $html += "<p style='word-wrap: break-word;'><strong>Error: </strong>" + coreError.Error + "</p>"
            + "<p style='word-wrap: break-word;'><strong>GUID: </strong>" + coreError.GUID + "</p>"
            + "<p style='word-wrap: break-word;'><strong>Message: </strong>" + coreError.Message + "</p>";
        } else {
            if (errorType !== undefined || errorType !== null) {
                $html += "<p style='word-wrap: break-word;'><strong>Error type: </strong>" + errorType + "</p>";
            }
            if (exception !== undefined || exception !== null) {
                $html += "<p style='word-wrap: break-word;'><strong>Exception type: </strong>" + exception + "</p>";
            }
            $html += "<p style='word-wrap: break-word;'><strong>Status Error: </strong>" + xhr.status + "</p>";
            $html += "<p style='word-wrap: break-word;'><strong>Status Text: </strong>" + xhr.statusText + "</p>";

            if (xhr.responseJSON !== undefined) {
                $html += "<p style='word-wrap: break-word;'><strong>Message: </strong>" + xhr.responseJSON.Message + "</p>";
            }
        }

        Modal.BootstrapDialog.Error('Comisiones', $html);
    }

    return {
        Ejecutar: function (obj, isAsync, callbackSuccess, callbackWarning, callbackError, withLoadig, withAttachments) {

            //var uri = _spPageContextInfo.webAbsoluteUrl + "/_layouts/15/UngrdComisiones/ComisionesServices.aspx/QueryListWebMethod";
            var uri = "";
            if (obj === undefined || obj === null) obj = {};
            if (callbackSuccess === undefined || callbackSuccess == null) { callbackSuccess = _OnSuccess };
            if (callbackWarning === undefined || callbackWarning == null) { callbackWarning = _OnWarning };
            if (callbackError === undefined || callbackError == null) { callbackError = _OnError };
            if (withLoadig === undefined || withLoadig == null) { withLoadig = true };
            if (withAttachments === undefined || withAttachments === null) { withAttachments = false };

            if (withAttachments) {
                uri = _spPageContextInfo.webAbsoluteUrl + "/_layouts/15/UngrdComisiones/ComisionesServices.aspx";
                $.ajax({
                    type: "POST",//using post method to send data
                    url: uri, //path to find web method CheckUserName
                    async: isAsync,
                    contentType: false,
                    processData: false,
                    data: obj,
                    beforeSend: function () {
                        if (withLoadig) {
                            if ($(".progress-bar").length === 0) {
                                Modal.BootstrapDialog.Loading();
                            }
                        }
                    },
                    complete: function () {
                        if (!withLoadig) {
                            Modal.BootstrapDialog.Close();
                        }
                    },
                    success: function (response) {
                        if (response.Error !== null && response.Error !== undefined) {
                            callbackError(response);
                            return;
                        } else {
                            callbackSuccess(response);
                        }
                    },
                    failure: function (response) {
                        callbackWarning(response);
                    },
                    error: function (response, errorType, exception) {
                        callbackError(response, errorType, exception);
                    }
                });
            } else {
                uri = _spPageContextInfo.webAbsoluteUrl + "/_layouts/15/UngrdComisiones/ComisionesServices.aspx/QueryListWebMethod";
                $.ajax({
                    type: 'POST',
                    url: uri,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    data: "{'obj':" + JSON.stringify(obj) + "}",
                    async: isAsync,
                    beforeSend: function () {
                        if (withLoadig) {
                            if ($(".progress-bar").length === 0) {
                                Modal.BootstrapDialog.Loading();
                            }
                        }
                    },
                    complete: function () {
                        if (!withLoadig) {
                            Modal.BootstrapDialog.Close();
                        }
                    },
                    success: function (response) {
                        var Obj = JSON.parse(response.d);

                        if (Obj.Error !== null && Obj.Error !== undefined) {
                            callbackError(response);
                            return;
                        } else {
                            callbackSuccess(Obj);
                        }
                    },
                    failure: function (response) {
                        callbackWarning(response);
                    },
                    error: function (response, errorType, exception) {
                        callbackError(response, errorType, exception);
                    }
                });
            }

        },
    }
})(jQuery);