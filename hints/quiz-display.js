require('../logging/survey-dialog.js');
require('../logging/config.js');

function QuizDisplay() {
    this.assignment = Assignment.get();
    window.quizDisplay = this;
    console.log(this.assignment);
}

QuizDisplay.prototype.initDisplay = function() {
    console.log("init quiz display");

    var container = document.getElementById("container");
    var canvas = document.getElementById("world");
    var quizBarDiv = document.createElement("div");
    var quizTitleDiv = document.createElement("div");
    var quizButtonsDiv = document.createElement("div");

    quizBarDiv.setAttribute("id", "quiz-bar");
    quizTitleDiv.setAttribute("id", "quiz-title");
    quizTitleDiv.innerText = window.defaultQuizTitle;
    quizButtonsDiv.setAttribute("id", "quiz-buttons");
    quizBarDiv.appendChild(quizTitleDiv);
    quizBarDiv.appendChild(quizButtonsDiv);
    container.insertBefore(quizBarDiv, canvas);

    this.quizBarDiv = quizBarDiv
    this.quizTitleDiv = quizTitleDiv;
    this.quizButtonsDiv = quizButtonsDiv;

    var assignment = Assignment.get();
    if (assignment.quizURLs) {
        this.loadQuizButtons(assignment.quizURLs);
    }
}

QuizDisplay.prototype.loadQuizButtons = function(quizURLs) {
    this.removeAllButtons();

    var myself = this;

    Object.keys(quizURLs).forEach(function(key) {
        var button = document.createElement("input");
        button.setAttribute("type","button");
        button.setAttribute("class", "button");
        button.setAttribute("value", key);
        button.setAttribute("onclick", "showSurvey(this)");
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

function showSurvey(button) {
    console.log("show survey clicked: " + button.value);
    var response = confirm("Are you sure you want to open " + button.value + "? \n You ONLY have 1 attempt.");

    if (!response) return;

    button.clicked = true;
    window.quizDisplay.disableButtons();

    SurveyDialog.show(button.quizURL, function() {
        console.log("survey complete" + button.value);
        quizDisplay.enableButtons();
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

extend(XML_Element, 'parseString', function(base, string) {
    base.call(this, string);

    console.log(this);

});

WorldMorph.prototype.fillPage = function () {
    var fillParent = true;

    var clientHeight = (fillParent ? this.worldCanvas.offsetHeight :
            window.innerHeight) - 40,
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