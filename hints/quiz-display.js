require('../logging/survey-dialog-old.js/index.js');
require('../logging/config.js');

function QuizDisplay() {
    var myself = this;

    this.assignment = Assignment.get();

    this.quizDialog = new SurveyDialog('quiz', 'Questions');

    window.quizDisplay = this;

    window.addEventListener('message', function(event) {
        myself.quizDialog.receiveMessage(event);
    });
}

QuizDisplay.prototype.initDisplay = function() {
    console.log("init quiz display");

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
    var gotHelpButton = document.createElement("input");
    var cancelHelpButton = document.createElement("input");

    needHelpButton.setAttribute("value", "I need help");
    needHelpButton.setAttribute("id", "need-help");
    needHelpButton.setAttribute("type", "button");
    needHelpButton.setAttribute("class", "help-button");
    needHelpButton.setAttribute("onclick", "window.quizDisplay.helpButtonClicked(this)");

    gotHelpButton.setAttribute("value", "I got help");
    gotHelpButton.setAttribute("id", "got-help");
    gotHelpButton.setAttribute("type", "button");
    gotHelpButton.setAttribute("class", "help-button");
    gotHelpButton.setAttribute("onclick", "window.quizDisplay.helpButtonClicked(this)");


    cancelHelpButton.setAttribute("value", "Figured out myself");
    cancelHelpButton.setAttribute("id", "cancel-help");
    cancelHelpButton.setAttribute("type", "button");
    cancelHelpButton.setAttribute("class", "help-button");
    cancelHelpButton.setAttribute("onclick", "window.quizDisplay.helpButtonClicked(this)");


    this.helpDiv.appendChild(needHelpButton);
    this.helpDiv.appendChild(gotHelpButton);
    this.helpDiv.appendChild(cancelHelpButton);

    $('#got-help').hide();
    $('#cancel-help').hide();
}

QuizDisplay.prototype.helpButtonClicked = function(button) {
    if (button.getAttribute("id") == "need-help") {
        console.log("need-help clicked");
        $('#need-help').hide();
        $('#cancel-help').show();
        $('#got-help').show();
    }
    else if (button.getAttribute("id") == "got-help") {
        console.log("got-help clicked");
        $('#need-help').show();
        $('#got-help').hide();
        $('#cancel-help').hide();
    }
    else if (button.getAttribute("id") == "cancel-help") {
        console.log("cancel-help clicked");
        $('#need-help').show();
        $('#got-help').hide();
        $('#cancel-help').hide();
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
}

QuizDisplay.prototype.removeAllButtons = function() {
    while (this.quizButtonsDiv.hasChildNodes()) {
        var node = this.quizButtonsDiv.childNodes[0];
        this.quizButtonsDiv.removeChild(node);
    }
}

QuizDisplay.prototype.showSurvey = function(button) {
    console.log("show survey clicked: " + button.value);

    var myself = this;

    var response = confirm("Are you sure you want to open " + button.value + "? \n You ONLY have 1 attempt.");
    if (!response) return;

    button.clicked = true;
    this.disableButtons();

    this.quizDialog.show(button.quizURL, function() {
        console.log("survey complete" + button.value);
        myself.enableButtons();
    }, false);
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