require('../logging/survey-dialog.js');
require('../logging/config.js');

function QuizDisplay() {
    this.assignment = Assignment.get();
    window.quizDisplay = this;
    console.log(this.assignment);
}

QuizDisplay.prototype.initDisplay = function() {
    console.log("init quiz display");
    var quizURLs = this.assignment.quizURLs;

    if (quizURLs == null) return;

    var myself = this;
    this.surveyAttempted = [];
    this.surveyButtons = [];
    var goalbar = document.getElementById("goalbar");
    var buttonIndex = 0;

    Object.keys(quizURLs).forEach(function(key) {
        var button = document.createElement("input");
        button.setAttribute("type","button");
        button.setAttribute("class", "button");
        button.setAttribute("value", key);
        button.setAttribute("onclick", "showSurvey(this)");
        button.setAttribute("button-index", buttonIndex++);
        goalbar.appendChild(button);
        myself.surveyAttempted.push(false);
        myself.surveyButtons.push(button);
    });
}

function showSurvey(button) {
    console.log("show survey clicked");
    var response = confirm("Are you sure you want to open " + button.value + "? \n You ONLY have 1 attempt.");

    if (!response) return;

    var quizURLs = Assignment.get().quizURLs;
    if (quizURLs == null) return;


    var quizDisplay = window.quizDisplay;

    quizDisplay.disableButtons();
    quizDisplay.surveyAttempted[button.getAttribute("button-index")] = true;

    SurveyDialog.show(quizURLs[button.value], function() {
        console.log("survey complete");
        quizDisplay.enableButtons();
    }, false);
}

QuizDisplay.prototype.enableButtons = function() {
    for (var i = 0; i < this.surveyAttempted.length; i++) {
        if (!this.surveyAttempted[i]) {
            this.surveyButtons[i].disabled = false;
        }
    }
}

QuizDisplay.prototype.disableButtons = function() {
    this.surveyButtons.forEach(function(button) {
        button.disabled = true;
    });
}

QuizDisplay.prototype.show = function() {
    console.log("show quiz display");
}

QuizDisplay.prototype.hide = function() {
    console.log("hide quiz display");
}

QuizDisplay.prototype.clear = function() {
    // eslint-disable-next-line no-console
    console.log('-----------------------------------------');
};

QuizDisplay.prototype.willIgnoreHint = function(hint) {
    return false;
};

QuizDisplay.prototype.showHint = function(hint) {
    // eslint-disable-next-line no-console
    console.log(hint.from + ' -> ' + hint.to);
};

QuizDisplay.prototype.showDebugInfo = function(info) {

};

QuizDisplay.prototype.showError = function(error, isNetwork) {
    // eslint-disable-next-line no-console
    console.error(error);
};


QuizDisplay.prototype.finishedHints = function() {

};

QuizDisplay.prototype.getHintType = function() {
    return '';
};

QuizDisplay.prototype.hintDialogShown = function() {

};