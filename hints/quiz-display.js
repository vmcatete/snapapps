require('../logging/config.js');

function QuizDisplay() {
    var myself = this;

    this.assignment = Assignment.get();

    this.quizDialog = new SurveyDialog('quiz', 'Questions');
    this.helpDialog = new SurveyDialog('help', 'Help');
    this.helpDialog.surveyURL = "https://ncsu.qualtrics.com/jfe/form/SV_4Tq1ISyYu2wgsHH";

    window.quizDisplay = this;

    window.addEventListener('message', function(event) {
        myself.quizDialog.receiveMessage(event);
        myself.helpDialog.receiveMessage(event);
    });
}

QuizDisplay.prototype.initDisplay = function() {
    this.createQuizBar();
    this.loadHelpButtons();

    var assignment = Assignment.get();
    if (assignment.quizURLs) {
        this.loadQuizButtons(assignment.quizURLs);
    }
}

QuizDisplay.prototype.createQuizBar = function() {
    var container = document.getElementById("container");
    var canvas = document.getElementById("world");
    var quizBarDiv = document.createElement("div");
    var quizTitleDiv = document.createElement("div");
    var helpDiv = document.createElement("div");
    var quizButtonsDiv = document.createElement("div");

    quizBarDiv.setAttribute("id", "quiz-bar");
    quizTitleDiv.setAttribute("id", "quiz-title");
    quizTitleDiv.innerText = window.defaultQuizTitle;
    quizButtonsDiv.setAttribute("id", "quiz-buttons");
    helpDiv.setAttribute("id", "help");
    quizBarDiv.appendChild(quizTitleDiv);
    quizBarDiv.appendChild(quizButtonsDiv);
    quizBarDiv.appendChild(helpDiv);
    container.insertBefore(quizBarDiv, canvas);

    this.quizBarDiv = quizBarDiv
    this.quizTitleDiv = quizTitleDiv;
    this.quizButtonsDiv = quizButtonsDiv;
    this.helpDiv = helpDiv;
}

QuizDisplay.prototype.loadHelpButtons = function() {
    var needHelpButton = document.createElement("input");
    var startHelpButton = document.createElement("input");
    var cancelHelpButton = document.createElement("input");
    var endHelpButton = document.createElement("input");

    needHelpButton.setAttribute("value", "I need help");
    needHelpButton.setAttribute("id", "need-help");
    needHelpButton.setAttribute("type", "button");
    needHelpButton.setAttribute("class", "help-button");
    needHelpButton.setAttribute("onclick", "window.quizDisplay.helpButtonClicked(this)");

    startHelpButton.setAttribute("value", "Help arrived");
    startHelpButton.setAttribute("id", "start-help");
    startHelpButton.setAttribute("type", "button");
    startHelpButton.setAttribute("class", "help-button");
    startHelpButton.setAttribute("onclick", "window.quizDisplay.helpButtonClicked(this)");


    cancelHelpButton.setAttribute("value", "Cancel");
    cancelHelpButton.setAttribute("id", "cancel-help");
    cancelHelpButton.setAttribute("type", "button");
    cancelHelpButton.setAttribute("class", "help-button");
    cancelHelpButton.setAttribute("onclick", "window.quizDisplay.helpButtonClicked(this)");

    endHelpButton.setAttribute("value", "Help finished");
    endHelpButton.setAttribute("id", "end-help");
    endHelpButton.setAttribute("type", "button");
    endHelpButton.setAttribute("class", "help-button");
    endHelpButton.setAttribute("onclick", "window.quizDisplay.helpButtonClicked(this)");

    this.helpDiv.appendChild(needHelpButton);
    this.helpDiv.appendChild(startHelpButton);
    this.helpDiv.appendChild(cancelHelpButton);
    this.helpDiv.appendChild(endHelpButton);

    $('#start-help').hide();
    $('#cancel-help').hide();
    $('#end-help').hide();
}

QuizDisplay.prototype.helpButtonClicked = function(button) {
    if (button.getAttribute("id") == "need-help") {
        Trace.log("QuizDisplay.helpButtonClicked", "need-help");
        $('#need-help').hide();
        $('#cancel-help').show();
        $('#start-help').show();
    }
    else if (button.getAttribute("id") == "start-help") {
        Trace.log("QuizDisplay.helpButtonClicked", "start-help");
        $('#start-help').hide();
        $('#cancel-help').hide();
        $('#end-help').show();
    }
    else if (button.getAttribute("id") == "cancel-help") {
        Trace.log("QuizDisplay.helpButtonClicked", "cancel-help");
        $('#start-help').hide();
        $('#cancel-help').hide();
        $('#need-help').show();
    }
    else if (button.getAttribute("id") == "end-help") {
        Trace.log("QuizDisplay.helpButtonClicked", "end-help");
        this.helpDialog.show(this.helpDialog.surveyURL, function() {
            $('#end-help').hide();
            $('#need-help').show();
        }, "help-survey", newGuid());
    }
}

QuizDisplay.prototype.loadQuizButtons = function(quizURLs) {
    this.removeAllButtons();

    var myself = this;

    Object.keys(quizURLs).forEach(function(key) {
        var button = document.createElement("input");
        button.setAttribute("type","button");
        button.setAttribute("class", "quiz-button");
        button.setAttribute("value", key);
        button.setAttribute("onclick", "window.quizDisplay.showSurvey(this)");
        button.quizURL = quizURLs[key];
        button.clicked = false;
        myself.quizButtonsDiv.appendChild(button);
    });

    Trace.log("QuizDisplay.loadQuizButtons", quizURLs);
}

QuizDisplay.prototype.removeAllButtons = function() {
    while (this.quizButtonsDiv.hasChildNodes()) {
        var node = this.quizButtonsDiv.childNodes[0];
        this.quizButtonsDiv.removeChild(node);
    }
}

QuizDisplay.prototype.showSurvey = function(button) {
    Trace.log("QuizDisplay.quizButtonClicked", button.value);

    var myself = this;

    var response = confirm("Are you sure you want to open " + button.value + "? \n You ONLY have 1 attempt.");
    if (!response) {
        Trace.log("QuizDisplay.quizCanceled", button.value);
        return;
    }

    button.clicked = true;
    this.disableButtons();

    this.quizDialog.show(button.quizURL, function() {
        console.log("survey complete" + button.value);
        myself.enableButtons();
    }, button.value, newGuid());
}

QuizDisplay.prototype.enableButtons = function() {
    this.quizButtonsDiv.childNodes.forEach(function(child) {
        if (!child.clicked) {
            child.disabled = false;
        }
    });
}

QuizDisplay.prototype.disableButtons = function() {
    this.quizButtonsDiv.childNodes.forEach(function(button) {
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


WorldMorph.prototype.fillPage = function () {
    var fillParent = true;

    var clientHeight = fillParent ? this.worldCanvas.offsetHeight :
            window.innerHeight,
        clientWidth = fillParent ? this.worldCanvas.offsetWidth :
            window.innerWidth,
        myself = this;

    if (!fillParent) {
            this.worldCanvas.style.position = "absolute";
            this.worldCanvas.style.left = "0px";
            this.worldCanvas.style.right = "0px";
            this.worldCanvas.style.width = "100%";
            this.worldCanvas.style.height = "100%";
        if (document.documentElement.scrollTop) {
            // scrolled down b/c of viewport scaling
            clientHeight = document.documentElement.clientHeight;
        }
        if (document.documentElement.scrollLeft) {
            // scrolled left b/c of viewport scaling
            clientWidth = document.documentElement.clientWidth;
        }
    }
    if (this.worldCanvas.width !== clientWidth) {
        this.worldCanvas.width = clientWidth;
        this.setWidth(clientWidth);
    }
    if (this.worldCanvas.height !== clientHeight) {
        this.worldCanvas.height = clientHeight;
        this.setHeight(clientHeight);
    }
    this.children.forEach(function (child) {
        if (child.reactToWorldResize) {
            child.reactToWorldResize(myself.bounds.copy());
        }
    });
};