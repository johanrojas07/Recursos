//var Modal = {};
//Modal.BootstrapDialog = Modal.BootstrapDialog || (function ($) {
//    var _newModal = function (type, title, body, size, closable, buttons) {
//        if (type == null) { type = BootstrapDialog.TYPE_DEFAULT; }
//        if (size == null) { size = BootstrapDialog.SIZE_NORMAL; }
//        if (closable == null) { closable = true; }

//        var configButtons = [];
//        if (buttons != null) {
//            if (buttons.length > 0) {
//                configButtons = buttons;
//            } else {
//                configButtons.push({ label: 'Aceptar', action: function (dialogRef) { dialogRef.close(); } });
//            }
//        }

//        BootstrapDialog.show({
//            title: title,
//            type: type,
//            message: body,
//            size: size,
//            closable: closable,
//            buttons: configButtons
//        });
//    }
//    return {
//        Ok: function (title, body, buttons) {
//            if (buttons == null) { buttons = []; }
//            _newModal(BootstrapDialog.TYPE_PRIMARY, title, body, null, false, buttons);
//        },
//        Loading: function () {
//            var progress = '<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar progress-bar-primary" style="width: 100%"></div></div>';
//            _newModal(BootstrapDialog.TYPE_PRIMARY, 'Procesando...', progress, BootstrapDialog.SIZE_SMALL, false, null);
//        },
//        Success: function (title, body, buttons) {
//            if (buttons == null) { buttons = []; }
//            _newModal(BootstrapDialog.TYPE_SUCCESS, title, body, null, null, buttons);
//        },
//        Warning: function (title, body, buttons) {
//            if (buttons == null) { buttons = []; }
//            _newModal(BootstrapDialog.TYPE_WARNING, title, body, null, null, buttons);
//        },
//        Error: function (title, body, buttons) {
//            if (buttons == null) { buttons = []; }
//            _newModal(BootstrapDialog.TYPE_DANGER, title, body, null, null, buttons);
//        },
//        Form: function (title, body, buttons) {
//            if (buttons == null) { buttons = []; }
//        },
//        Close: function () {
//            BootstrapDialog.closeAll();
//        }
//    }
//})(jQuery);

var Modal = {};
Modal.BootstrapDialog = Modal.BootstrapDialog || (function ($) {
    var modal = new BootstrapDialog();
    var _newModal = function (type, title, body, size, closable, buttons) {
        if (type == null) { type = BootstrapDialog.TYPE_DEFAULT; }
        if (size == null) { size = BootstrapDialog.SIZE_NORMAL; }
        if (closable == null) { closable = true; }
        var configButtons = [];
        if (buttons != null) {
            if (buttons.length > 0) {
                configButtons = buttons;
            } else {
                configButtons.push({ label: 'Aceptar', action: function (dialogRef) { dialogRef.close(); } });
            }
        }
        //console.time("TiempoLoadingPorSetter: ");
        modal.setTitle(title);
        modal.setMessage(body);
        modal.setType(type);
        modal.setSize(size);
        modal.setClosable(closable);
        modal.setButtons(configButtons);
        modal.open();
    }
    return {
        Ok: function (title, body, buttons) {
            if (buttons == null) { buttons = []; }
            _newModal(BootstrapDialog.TYPE_PRIMARY, title, body, null, false, buttons);
        },
        Loading: function () {
            var progress = '<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar progress-bar-primary" style="width: 100%"></div></div>';
            _newModal(BootstrapDialog.TYPE_PRIMARY, 'Procesando...', progress, BootstrapDialog.SIZE_SMALL, false, null);
        },
        Success: function (title, body, buttons) {
            if (buttons == null) { buttons = []; }
            _newModal(BootstrapDialog.TYPE_SUCCESS, title, body, null, false, buttons);
        },
        Warning: function (title, body, buttons) {
            if (buttons == null) { buttons = []; }
            _newModal(BootstrapDialog.TYPE_WARNING, title, body, null, false, buttons);
        },
        Error: function (title, body, buttons) {
            if (buttons == null) { buttons = []; }
            _newModal(BootstrapDialog.TYPE_DANGER, title, body, null, false, buttons);
        },
        Form: function (title, body, size, closable, buttons) {
            if (buttons == null) { buttons = []; }
            _newModal(BootstrapDialog.TYPE_DANGER, title, body, size, closable, buttons);
        },
        Close: function () {
            modal.close();
        }
    }
})(jQuery);

