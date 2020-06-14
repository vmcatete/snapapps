IDE_Morph.prototype.loadExampleProject = function(name) {
    Trace.log("IDE.loadExampleProject", name);
    if (!name) return;
    var examples = ide.getMediaList("Examples");
    var resourceURL = null;
    examples.forEach(function(example) {
        if (example.name === name) {
            resourceURL = ide.resourceURL('Examples', example.fileName);
        }
    });

    if (resourceURL) {
        ide.openProjectString(ide.getURL(resourceURL));
    }
    else {
        Trace.log("IDE.loadExampleProject", "Example project does not exist");
        return false;
    }
}

IDE_Morph.prototype.loadAssignment = function() {
    if (!Assignment.exist || Assignment.getFileName() == "") {
        Trace.log("No associated assignment to load for the session.");
        console.log("No associated assignment to load for the session.");
    }
    else {
        var resourceURL = ide.resourceURL(window.assignmentFolder, Assignment.getFileName());
        var xmlString = ide.getURL(resourceURL);

        if (!xmlString.startsWith("<!DOC")) {
            ide.openProjectString(ide.getURL(resourceURL));
            Trace.log("IDE.loadAssignment", Assignment.getID());
        }
        else {
            Trace.log("IDE.loadAssignmentFailed", Assignment.getID());
        }
    }

    ide.controlBar.updateLabel();
    ide.controlBar.fixLayout();
}


IDE_Morph.prototype.loadInstruction = function() {
    if (window.assignment.instruction_file_name && window.assignment.instruction_file_name != "" && !window.assignment.instruction_file_name.endsWith(".pdf")) {
        Trace.log("IDE.loadInstruction", "None");
        $('#my_pdf_viewer').hide();
        return;
    }

    Trace.log("IDE.loadInstruction", window.assignment.instruction_file_name);
    var path = "./" + window.instructionFolder + "/" + window.assignment.instruction_file_name;
    pdfjsLib.getDocument(path).then((pdf) => {
        myState.pdf = pdf;
        render();
    });
}


IDE_Morph.prototype.cloudMenu = function () {
    Trace.log("IDE.cloudMenu");
    var menu,
        myself = this,
        world = this.world(),
        pos = this.controlBar.cloudButton.bottomLeft(),
        shiftClicked = (world.currentKey === 16);

    if (location.protocol === 'file:' && !shiftClicked) {
        this.showMessage('cloud unavailable without a web server.');
        return;
    }

    menu = new MenuMorph(this);
    if (shiftClicked) {
        menu.addItem(
            'url...',
            'setCloudURL',
            null,
            new Color(100, 0, 0)
        );
        menu.addLine();
    }
    if (!this.cloud.username) {
        menu.addItem(
            'Login...',
            'initializeCloud'
        );
        menu.addItem(
            'Signup...',
            'createCloudAccount'
        );
        menu.addItem(
            'Reset Password...',
            'resetCloudPassword'
        );
        menu.addItem(
            'Resend Verification Email...',
            'resendVerification'
        );
    } else {
        menu.addItem(
            localize('Logout') + ' ' + this.cloud.username,
            'logout'
        );

        if (allowStudentChangePassword || (window.user && (window.user.user_type == "teacher" || window.user.user_type == "admin"))) {
            menu.addItem(
                'Change Password...',
                'changeCloudPassword'
            );
        }
    }

    if (shiftClicked) {
        menu.addLine();
        menu.addItem(
            'export project media only...',
            function () {
                if (myself.projectName) {
                    myself.exportProjectMedia(myself.projectName);
                } else {
                    myself.prompt('Export Project As...', function (name) {
                        myself.exportProjectMedia(name);
                    }, null, 'exportProject');
                }
            },
            null,
            this.hasChangedMedia ? new Color(100, 0, 0) : new Color(0, 100, 0)
        );
        menu.addItem(
            'export project without media...',
            function () {
                if (myself.projectName) {
                    myself.exportProjectNoMedia(myself.projectName);
                } else {
                    myself.prompt('Export Project As...', function (name) {
                        myself.exportProjectNoMedia(name);
                    }, null, 'exportProject');
                }
            },
            null,
            new Color(100, 0, 0)
        );
        menu.addItem(
            'export project as cloud data...',
            function () {
                if (myself.projectName) {
                    myself.exportProjectAsCloudData(myself.projectName);
                } else {
                    myself.prompt('Export Project As...', function (name) {
                        myself.exportProjectAsCloudData(name);
                    }, null, 'exportProject');
                }
            },
            null,
            new Color(100, 0, 0)
        );
        menu.addLine();
        menu.addItem(
            'open shared project from cloud...',
            function () {
                myself.prompt('Author name�?', function (usr) {
                    myself.prompt('Project name...', function (prj) {
                        myself.showMessage(
                            'Fetching project\nfrom the cloud...'
                        );
                        myself.cloud.getPublicProject(
                            prj,
                            usr.toLowerCase(),
                            function (projectData) {
                                var msg;
                                if (!Process.prototype.isCatchingErrors) {
                                    window.open(
                                        'data:text/xml,' + projectData
                                    );
                                }
                                myself.nextSteps([
                                    function () {
                                        msg = myself.showMessage(
                                            'Opening project...'
                                        );
                                    },
                                    function () {nop(); }, // yield (Chrome)
                                    function () {
                                        myself.rawOpenCloudDataString(
                                            projectData
                                        );
                                    },
                                    function () {
                                        msg.destroy();
                                    }
                                ]);
                            },
                            myself.cloudError()
                        );

                    }, null, 'project');
                }, null, 'project');
            },
            null,
            new Color(100, 0, 0)
        );
    }
    menu.popup(world, pos);
};

IDE_Morph.prototype.logout = function () {
    window.location.href = "../login.html";
}


// make logo (and control bar) twice as wide
extend(IDE_Morph, 'createLogo', function(base) {
    base.call(this);
    ide.logo.setHeight(ide.logo.height() * 2);
});

// update fixLayout function so the default buttons align on top of the control bar
extend(IDE_Morph, 'createControlBar', function(base) {
    base.call(this);

    var myself = this,
        x = 0;
        padding = 4,
        stopButton = this.controlBar.stopButton,
        pauseButton = this.controlBar.pauseButton,
        startButton = this.controlBar.startButton,
        slider = this.controlBar.steppingSlider,
        stageSizeButton = this.controlBar.stageSizeButton,
        appModeButton = this.controlBar.appModeButton,
        steppingButton = this.controlBar.steppingButton,
        settingsButton = this.controlBar.settingsButton,
        cloudButton = this.controlBar.cloudButton,
        projectButton = this.controlBar.projectButton;

    this.controlBar.customButtons = [];
    this.controlBar.fixLayout = function () {
        x = this.right() - padding;
        [stopButton, pauseButton, startButton].forEach(
            function (button) {
                button.setTop(myself.controlBar.top() + padding);
                button.setRight(x);
                x -= button.width();
                x -= padding;
            }
        );

        x = Math.min(
            startButton.left() - (3 * padding + 2 * stageSizeButton.width()),
            myself.right() - StageMorph.prototype.dimensions.x *
                (myself.isSmallStage ? myself.stageRatio : 1)
        );
        [stageSizeButton, appModeButton].forEach(
            function (button) {
                x += padding;
                button.setTop(myself.controlBar.top() + padding);
                button.setLeft(x);
                x += button.width();
            }
        );

        slider.setTop(myself.controlBar.top() + padding);
        slider.setRight(stageSizeButton.left() - padding);

        steppingButton.setTop(myself.controlBar.top() + padding);
        steppingButton.setRight(slider.left() - padding);

        settingsButton.setCenter(myself.controlBar.center());
        settingsButton.setLeft(this.left());

        cloudButton.setCenter(myself.controlBar.center());
        cloudButton.setRight(settingsButton.left() - padding);

        projectButton.setCenter(myself.controlBar.center());
        projectButton.setRight(cloudButton.left() - padding);

        this.refreshSlider();
        this.updateLabel();

        // setting custom buttons layout
        x = this.label.left() + padding;
        this.customButtons.forEach(
            function(button) {
                button.setTop(myself.controlBar.height() / 2);
                button.setLeft(x);
                x += button.width();
                x += 100;
            }
        );
    };

    this.controlBar.updateLabel = function () {
        var suffix = myself.world().isDevMode ?
                ' - ' + localize('development mode') : '';

        if (this.label) {
            this.label.destroy();
        }
        if (myself.isAppMode) {
            return;
        }

        this.label = new StringMorph(
            (myself.projectName || localize('untitled')) + suffix,
            14,
            'sans-serif',
            true,
            false,
            false,
            MorphicPreferences.isFlat ? null : new Point(2, 1),
            myself.frameColor.darker(myself.buttonContrast)
        );
        this.label.color = myself.buttonLabelColor;
        this.label.drawNew();
        this.add(this.label);
        this.label.setTop(this.top() + 8);
        this.label.setLeft(this.settingsButton.right() + padding);
    };

    // credit to hint-display.js
    // padding is optional
    this.controlBar.addCustomButton = function(buttonName, text, onClick, padding) {
        var button = new PushButtonMorph(ide, onClick, text);
        button.fontSize = DialogBoxMorph.prototype.buttonFontSize;
        button.edge = DialogBoxMorph.prototype.buttonEdge;
        button.padding = DialogBoxMorph.prototype.buttonPadding;
        button.outlineColor = ide.spriteBar.color;
        button.outlineGradient = false;
        button.contrast = DialogBoxMorph.prototype.buttonContrast;
        button.corner = DialogBoxMorph.prototype.buttonCorner;
        button.outline = DialogBoxMorph.prototype.buttonOutline;

        button.drawNew();
        button.fixLayout();

        extendObject(window.ide, 'toggleAppMode', function(base, appMode) {
            base.call(this, appMode);
            if (button.parent == null) return;
            if (this.isAppMode) button.hide();
            else button.show();
        });

        window.ide.controlBar.add(button);
        window.ide.controlBar.customButtons.push(button);
        window.ide.controlBar[buttonName] = button;
        window.ide.fixLayout();

        return button;
    }

});

