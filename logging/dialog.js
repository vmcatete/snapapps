
require('assignment.js');

function Dialog(
    id, 
    title, 
    callback
    ) {
    var myself = this;

    this.idDialog = 'dialog-' + id;
    this.idIframe = 'iframe-' + id;
    this.title = title ? title : 'dialog';
    this.callback = null;
    this.eventID = null;
    this.params = {};
    this.surveyInfo = "";

    $(document).ready(function() {
        myself.createDialogDiv();
        $('#' + myself.idDialog).dialog({
            title: myself.title,
            close: callback,
            closeOnEscape: false,
            // width: 1000,
            // height: 1000,
            resizable: true,
            autoOpen: false,
        });
    });
}

Dialog.prototype.createDialogDiv = function() {
    var body = $('body').get()[0];

    var divDialog = document.createElement('div');
    divDialog.setAttribute('id', this.idDialog);
    divDialog.setAttribute('title', this.title);

    var iframeDialog = document.createElement("iframe");
    iframeDialog.setAttribute('width', '100%');
    iframeDialog.setAttribute('height', '100%');
    iframeDialog.setAttribute('frameborder', '0');
    iframeDialog.setAttribute('id', this.idIframe);

    divDialog.append(iframeDialog);
    body.append(divDialog);
}

Dialog.prototype.show = function(baseURL, callback) {
    var myself = this;

    // In case there's a latent callback, go ahead and call it
    if (this.callback) this.callback();
    this.callback = callback;

    // log information
    var url = baseURL;
    
    Object.keys(myself.params).forEach(function(key) {
        var value = myself.params[key];
        url += '&' + key + '=' + value;
    });

    Trace.log('Dialog.show', url);
    $('#' + this.idIframe).attr('src', url);
    $('#' + this.idDialog).dialog('open');
};

Dialog.prototype.fitToWindow = function(padding) {
    this.setOption("width", ide.width() - padding);
    this.setOption("height", ide.height() - padding);
}

Dialog.prototype.allowClose = function(allowClose) {
    if (allowClose != true && allowClose != false) return;
    var visibility = 'hidden';
    if (allowClose) {
        visibility = 'visible';
    }
    document.getElementById(this.idDialog).parentElement.getElementsByClassName('ui-dialog-titlebar-close')[0].style.visibility = visibility;
}

Dialog.prototype.setOption = function(key, value) {
    // No Objects allowed
    if (Object(key)  === key || Object(value) === value) return;
    $('#' + this.idDialog).dialog('option', key, value);
}

Dialog.prototype.setParam = function(key, value) {
    // No Objects allowed
    if (Object(key)  === key || Object(value) === value) return;
    this.params[key] = value;
};

Dialog.prototype.receiveMessage = function(event) {
    if (!event || !event.data) return;
    if (event.data.message != 'survey-complete') return;
    var eventID = event.data.eventID;
    if (eventID != this.eventID) return;
    Trace.log("Dialog.surveySubmitted", this.surveyInfo);
    if (this.title == "Help") {
        this.close();
    }
    else {
        this.allowClose(true);
    }
};

Dialog.prototype.close = function() {
    Trace.log("Dialog.dialogClosed", this.surveyInfo);
    $('#' + this.idDialog).dialog( 'close' );
    if (this.callback) this.callback();

    this.surveyInfo = "";
    this.callback = null;
};
