
require('assignment.js');

function SurveyDialog(id, title) {
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
            dialogClass: 'no-close',
            closeOnEscape: false,
            width: 700,
            height: 625,
            resizable: true,
            autoOpen: false,
        });
    });
}

SurveyDialog.prototype.createDialogDiv = function() {
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

SurveyDialog.prototype.show = function(baseURL, callback, surveyInfo) {
    var myself = this;

    // In case there's a latent callback, go ahead and call it
    if (this.callback) this.callback();
    this.callback = callback;

    this.surveyInfo = surveyInfo;

    $('#' + this.dialogID).dialog('option', 'width', 700);
    $('#' + this.dialogID).dialog('option', 'height', 625);

    // log information
    var url = baseURL;
    url += '?userID=' + window.userID;
    url += '&assignmentID=' + Assignment.getID();
    url += '&eventID=' + this.eventID;
    Object.keys(myself.params).forEach(function(key) {
        var value = myself.params[key];
        url += '&' + key + '=' + value;
    });
    Trace.log('SurveyDialog.show', {
        eventID: myself.eventID,
        url: url,
        surveyInfo: surveyInfo,
    });
    $('#' + this.idIframe).attr('src', url);
    $('#' + this.idDialog).dialog( 'open' );

    this.allowClose(false);
};

SurveyDialog.prototype.allowClose = function(allowClose) {
    if (allowClose != true && allowClose != false) return;
    var visibility = 'hidden';
    if (allowClose) {
        visibility = 'visible';
    }
    document.getElementById(this.idDialog).parentElement.getElementsByClassName('ui-dialog-titlebar-close')[0].style.visibility = visibility;
}

SurveyDialog.prototype.setOption = function(key, value) {
    // No Objects allowed
    if (Object(key)  === key || Object(value) === value) return;
    $('#' + this.dialogID).dialog('option', key, value);
}

SurveyDialog.prototype.setParam = function(key, value) {
    // No Objects allowed
    if (Object(key)  === key || Object(value) === value) return;
    this.params[key] = value;
};

SurveyDialog.prototype.receiveMessage = function(event) {
    if (!event || !event.data) return;
    // if (event.data.message != 'survey-complete') return;
    if (event.data != 'closeQSIWindow') return;
    var eventID = event.data.eventID;
    if (eventID != this.eventID) return;
    Trace.log("SurveyDialog.surveySubmitted", this.surveyInfo);
    console.log(event);
    console.log(event.data);
    console.log(event.data.userID);
    this.close();
};

SurveyDialog.prototype.close = function() {
    Trace.log('SurveyDialog.close', SurveyDialog.eventID);
    $('#' + this.idDialog).dialog( 'close' );
    if (this.callback) this.callback();
    Trace.log("SurveyDialog.dialogClosed", this.surveyInfo);

    this.surveyInfo = "";
    this.callback = null;
};
