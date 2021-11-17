
require('assignment.js');

function SurveyDialog() {

}

SurveyDialog.callback = null;
SurveyDialog.eventID = null;
SurveyDialog.params = {};

SurveyDialog.show = function(baseURL, callback, fullscreen) {
    // In case there's a latent callback, go ahead and call it
    if (SurveyDialog.callback) SurveyDialog.callback();
    SurveyDialog.callback = callback;
    if (fullscreen) {
        $('#dialog').dialog('option', 'width', '80%');
        $('#dialog').dialog('option', 'height', window.innerHeight * 0.75);
    } else {
        $('#dialog').dialog('option', 'width', 700);
        $('#dialog').dialog('option', 'height', 625);
    }
    var url = baseURL;
    url += '?userID=' + window.userID;
    url += '&assignmentID=' + Assignment.getID();
    url += '&eventID=' + SurveyDialog.eventID;
    Object.keys(SurveyDialog.params).forEach(function(key) {
        var value = SurveyDialog.params[key];
        url += '&' + key + '=' + value;
    });
    Trace.log('SurveyDialog.show', {
        eventID: SurveyDialog.eventID,
        url: url,
        fullscreen: fullscreen,
    });
    $( '#frame' ).attr('src', url);
    $( '#dialog' ).dialog( 'open' );
};

SurveyDialog.setParam = function(key, value) {
    // No Objects allowed
    if (Object(key)  === key || Object(value) === value) return;
    this.params[key] = value;
};

SurveyDialog.receiveMessage = function(event) {
    if (!event || !event.data) return;
    // if (event.data.message != 'survey-complete') return;
    if (event.data != 'closeQSIWindow') return;
    var eventID = event.data.eventID;
    if (eventID != SurveyDialog.eventID) return;
    SurveyDialog.close();
};

SurveyDialog.close = function() {
    Trace.log('SurveyDialog.close', SurveyDialog.eventID);
    $('#dialog').dialog( 'close' );
    if (SurveyDialog.callback) SurveyDialog.callback();
    SurveyDialog.callback = null;
};

window.addEventListener('message', SurveyDialog.receiveMessage);

$(document).ready(function() {
    var body = $('body').get()[0];

    var divDialog = document.createElement('div');
    divDialog.setAttribute('id', 'test-div');
    divDialog.setAttribute('title', 'testing');

    var iframeDialog = document.createElement("iframe");
    iframeDialog.setAttribute('width', '100%');
    iframeDialog.setAttribute('height', '100%');
    iframeDialog.setAttribute('frameborder', '0');
    iframeDialog.setAttribute('id', 'test-iframe');

    divDialog.append(iframeDialog);
    body.append(divDialog);
    // $('#test-div').dialog({
    //     title: 'Questions',
    //     dialogClass: 'no-close',
    //     closeOnEscape: false,
    //     width: 700,
    //     height: 625,
    //     resizable: true,
    //     autoOpen: false,
    // });
});