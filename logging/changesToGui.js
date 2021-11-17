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