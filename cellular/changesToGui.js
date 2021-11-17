modules.cellularGui = '2013-August-2';

/*********************************************************************/
/******************************* HOOKS *******************************/
/*********because sometimes you HAVE to mod the original file*********/
/*********************************************************************/

function getSnapLogoImage()
{
    return 'cellular_logo_sm.png';
}

function getSnapAppsName()
{
    return 'Cellular';
}

function getSnapAppsAboutText()
{
    return 'Cellular 0.99\n Based upon Snap! 4.0\nBuild Your Own Blocks\n\n--- beta ---\n\n'
        + 'Cellular modifications copyright \u24B8 2013 Aidan Lane and Matthew Ready\n'
        + 'aidan.lane@monash.edu, matt.ready@monash.edu\n\n'
        + 'For more information visit http://flipt.org/';
}

function getSnapAppsLogoExtent()
{
    return new Point(190, 28);
}

IDE_Morph.prototype.exportIndex = "cellular.html";

/*********************************************************************/
/***************************** OVERRIDES *****************************/
/*********************************************************************/

IDE_Morph.prototype.snapAppsGetIsDraggableOverride = function () {
    return this.currentSprite.areClonesDraggable;
};

IDE_Morph.prototype.snapAppsIsDraggableOverride = function () {
    var currentSprite = this.currentSprite;

    currentSprite.areClonesDraggable = !currentSprite.areClonesDraggable;
    this.stage.children.forEach(function (x) {
        if (x instanceof SpriteMorph && x.parentSprite == currentSprite)
        {
            x.isDraggable = currentSprite.areClonesDraggable;
        }
    });
};

/*
** This is what creates the cell brush tools GUI.
*/
IDE_Morph.prototype.createCorralSnap = IDE_Morph.prototype.createCorral;
IDE_Morph.prototype.createCorral = function()
{
    this.createCorralSnap();

    // assumes the stage has already been created
    var myself = this,
        padding = 5,
        newbutton,
        paintbutton,
        colors = [
            this.groupColor,
            this.frameColor.darker(50),
            this.frameColor.darker(50)
        ];

    // paint brush tool
    var scribbleButton = new ToggleButtonMorph(
        null, //colors,
        myself, // the IDE is the target
        'scribble',
        [
            new SymbolMorph('brush', 14),
            new SymbolMorph('brush', 14)
        ],
        function () {  // query
            if (typeof myself.stage !== "undefined"
                && myself.stage !== null
                && typeof myself.stage.drawTool !== "undefined"
                && myself.stage.drawTool !== null)
                return myself.stage.drawTool;
            return false;
        }
    );
    scribbleButton.corner = 12;
    scribbleButton.color = colors[0];
    scribbleButton.highlightColor = colors[1];
    scribbleButton.pressColor = colors[2];
    scribbleButton.labelMinExtent = new Point(36, 18);
    scribbleButton.padding = 0;
    scribbleButton.labelShadowOffset = new Point(-1, -1);
    scribbleButton.labelShadowColor = colors[1];
    scribbleButton.labelColor = new Color(0, 200, 200);
    scribbleButton.contrast = this.buttonContrast;
    scribbleButton.hint = localize("draw to cell attributes");

    function createBasicLabel(text) {
        var basicLabel = new TextMorph(text);
        basicLabel.corner = 12;
        basicLabel.padding = 0;
        basicLabel.color = myself.buttonLabelColor;
        basicLabel.contrast = myself.buttonContrast;
        return basicLabel;
    };

    function createBasicField(hint, width, accept, defaultValue) {
        var basicField = new InputFieldMorph(defaultValue);
        if (MorphicPreferences.isFlat) {
            basicField.color = myself.groupColor;
        }
        basicField.corner = 12;
        basicField.padding = 0;
        basicField.contrast = myself.buttonContrast;
        basicField.hint = hint;
        basicField.contents().minWidth = 0;
        basicField.setWidth(width); // fixed dimensions
        basicField.reactToEdit = accept;
        return basicField;
    };

    var sizeLabel = createBasicLabel(localize("cell radius:"));

    var sizeField = createBasicField(localize("brush size (in cells)"), 32, function () {
        var value = Number(sizeField.getValue());
        if (isNaN(value))
        {
            sizeField.setContents(1);
            return;
        }
        if (value > 99)
        {
            sizeField.setContents(99);
            return;
        }
        if (value < 0.5)
        {
            sizeField.setContents(0.5);
            return;
        }
        myself.stage.strokeSize = value;
    }, this.stage.strokeSize.toString());

    var hardnessLabel = createBasicLabel(localize("hard:"));

    var hardnessField = createBasicField(localize("brush hardness (0-1)"), 32, function () {
        var value = Number(hardnessField.getValue());
        if (isNaN(value))
        {
            hardnessField.setContents(1);
            return;
        }
        if (value > 1)
        {
            hardnessField.setContents(1);
            return;
        }
        if (value < 0)
        {
            hardnessField.setContents(0);
            return;
        }
        myself.stage.strokeHardness = value;
    }, this.stage.strokeHardness.toString());

    var valueLabel = createBasicLabel(localize("value:"));

    var valueField = createBasicField(localize("brush value"), 32, function () {
        var value = Number(valueField.getValue());
        if (isNaN(value))
        {
            valueField.setContents(10);
            return;
        }
        myself.stage.strokeValue = value;
    }, this.stage.strokeValue.toString());

    var attributeSelectorLabel = createBasicLabel(localize("attribute:"));

    var attributeSelector = new InputFieldMorph(Cell.attributes.length > 0 ? Cell.attributes[0] : "", false, function() {
        var retn = {};
        for (var i=0; i<Cell.attributes.length; i++)
        {
            retn[Cell.attributes[i]] = Cell.attributes[i];
        }
        return retn;
    }, true );
    if (MorphicPreferences.isFlat) {
        attributeSelector.color = this.groupColor;
    }
    attributeSelector.corner = 12;
    attributeSelector.padding = 0;
    attributeSelector.contrast = this.buttonContrast;
    attributeSelector.hint = localize("attribute");
    this.attributeSelector = attributeSelector;

    var gridSizerLabel = createBasicLabel(localize("grid size:"));

    var gridSizer = new InputFieldMorph(
            "40x30", false, // numeric?
            {
            "16x12": "16x12",
            "20x15": "20x15",
            "40x30": "40x30",
            "80x60": "80x60",
            }, // drop-down dict, optional
            true
        );
    if (MorphicPreferences.isFlat) {
        gridSizer.color = this.groupColor;
    }
    gridSizer.corner = 12;
    gridSizer.padding = 0;
    gridSizer.contrast = this.buttonContrast;
    gridSizer.hint = localize("grid size");
    gridSizer.contents().minWidth = 0;

    var clearButton = new PushButtonMorph(
        myself,
        'onClearButton',
        localize('clear'),
        null,
        localize('clear current cell attribute'),
        null);

    var queryValueLabel = createBasicLabel(localize("(hover to query)"));
    this.cellAttributeQueryText = queryValueLabel;

    var lineHeight = this.logo.height();
    var lines = [
        [
            scribbleButton,
            sizeLabel,
            sizeField,
            hardnessLabel,
            hardnessField,
            valueLabel,
            valueField,
            attributeSelectorLabel,
            attributeSelector
        ],
        [
            gridSizerLabel,
            gridSizer,
            clearButton,
            queryValueLabel, // Keep the query label last since it changes size.
        ]
    ];


    if (this.stageBottomBar) {
        this.stageBottomBar.destroy();
    }
    this.stageBottomBar = new Morph();

    var stageBottomBar = this.stageBottomBar;
    stageBottomBar.color = this.frameColor;
    stageBottomBar.setHeight(lineHeight * lines.length + padding);
    this.add(stageBottomBar);

    var currentY = stageBottomBar.top() + padding / 2;
    lines.forEach(function (line) {
        var currentX = stageBottomBar.left() + padding;
        line.forEach(function (morph) {
            morph.setCenter(new Point(0, currentY + lineHeight / 2));
            morph.setLeft(currentX);
            morph.drawNew();
            if (morph.fixLayout) {
                morph.fixLayout();
            }
            stageBottomBar.add(morph);

            currentX = morph.right() + padding;
        });
        currentY += lineHeight;
    });

    stageBottomBar.reactToChoice = function(choice)
    {
        var gridSizeChoice = gridSizer.getValue();
        var choiceInt = 40;
        switch (gridSizeChoice)
        {
            case "16x12": choiceInt = 16; break;
            case "20x15": choiceInt = 20; break;
            case "40x30": choiceInt = 40; break;
            case "80x60": choiceInt = 80; break;
        }
        if (myself.stage.cellsX != choiceInt || myself.stage.cellsY != choiceInt * 3 / 4)
        {
            myself.stage.cellsX = choiceInt;
            myself.stage.cellsY = choiceInt * 3 / 4;
            myself.stage.updateCells();
        }
    }

    stageBottomBar.reactToEdit = function () {
        sizeField.accept();
        valueField.accept();
        hardnessField.accept();
    }
};

IDE_Morph.prototype.onClearButton = function() {
    var attribute = this.attributeSelector.getValue();
    if (Cell.hasAttribute(attribute)) {
        this.stage.setCellAttributeEverywhere(attribute, 0);
    }
};

IDE_Morph.prototype.killAllClones = function(prototypeObject) {
    for (var i = 0; i<this.stage.children.length; i++)
    {
        var child = this.stage.children[i];
        if (child.parentSprite == prototypeObject)
        {
            //Remove it if it is a clone of this sprite
            // this.stage.threads.stopAllForReceiver(child);
//            this.stage.removeChild(child);
			child.destroy();
            i--;
        }
    }
}

//Add cellular centre.
TurtleIconMorph.prototype.userMenu = function () {
    var myself = this,
        menu = new MenuMorph(this, 'pen'),
        on = '\u25CF',
        off = '\u25CB';
    if (this.object instanceof StageMorph) {
        return null;
    }
    menu.addItem(
        (this.object.penPoint === 'cellular-center' ? on : off) + ' ' + localize('actual center'),
        function () {
            myself.object.penPoint = 'cellular-center';
            myself.object.changed();
            myself.object.drawNew();
            myself.object.changed();
        }
    );
    menu.addItem(
        (this.object.penPoint === 'tip' ? on : off) + ' ' + localize('tip'),
        function () {
            myself.object.penPoint = 'tip';
            myself.object.changed();
            myself.object.drawNew();
            myself.object.changed();
        }
    );
    menu.addItem(
        (this.object.penPoint === 'middle' ? on : off) + ' ' + localize(
            'stupid middle'
        ),
        function () {
            myself.object.penPoint = 'middle';
            myself.object.changed();
            myself.object.drawNew();
            myself.object.changed();
        }
    );
    return menu;
};

/*********************************************************************/
/************************** IMPLEMENTATION ***************************/
/*********************************************************************/

IDE_Morph.prototype.refreshCellAttributes = function()
{
    if (!Cell.hasAttribute(this.attributeSelector.getValue()))
    {
        this.attributeSelector.setChoice(null);
    }
}

/*********************************************************************/
/*************************** BUTTON LOGIC ****************************/
/*********************************************************************/

IDE_Morph.prototype.scribble = function () {
    this.stage.drawTool = !this.stage.drawTool;
};

SpriteIconMorph.prototype.uberInit = SpriteIconMorph.prototype.init;
SpriteIconMorph.prototype.init = function (aSprite, aTemplate) {
    this.uberInit(aSprite, aTemplate);
    this.createDuplicator();
    this.fixLayout();
}

/*
** This creates the text box in which the number of clones is stored for each sprite.
** You can see it below every sprite icon on the bottom right of the screen.
*/
SpriteIconMorph.prototype.createDuplicator = function () {
    if (this.duplicator) {
        this.duplicator.destroy();
    }
    var myself = this;
    var duplicator;
    duplicator = new InputFieldMorph("0");
    duplicator.corner = 12;
    duplicator.padding = 0;
    duplicator.contrast = this.buttonContrast;
    duplicator.hint = "clones";
    duplicator.contents().minWidth = 0;
    duplicator.setCenter(this.center());
    duplicator.setWidth(32); // fixed dimensions
    duplicator.drawNew();
    duplicator.reactToEdit = function () {
        var value = Number(duplicator.getValue());
        var rnd = Process.prototype.reportRandom;

        if (isNaN(value))
        {
            value = 1;
            duplicator.setContents(1);
        }

        //Go through every object and remove everyone that is based off this sprite
        var ide = myself.parentThatIsA(IDE_Morph);
        ide.killAllClones(myself.object);

        //Now we make the clones
        for (var i = 0; i<value; i++)
        {
			ide.stage.createCellularClone(myself.object);
        }

        ide.stage.dirtyEntireStage();
    };
    this.add(duplicator);
    this.duplicator = duplicator;

    myself.object.spriteIconMorph = this;
};

SpriteIconMorph.prototype.updateDuplicator = function()
{
    this.duplicator.setContents(this.object.cloneCount);
}

// SpriteIconMorph layout (we need to change it so we can add room for the text box)
SpriteIconMorph.prototype.fixLayout = function () {
    if (!this.thumbnail || !this.label || (!(this.object instanceof StageMorph) && !this.duplicator)) {return null; }

    this.setWidth(
        this.thumbnail.width()
            + this.outline * 2
            + this.edge * 2
            + this.padding * 2
    );

    this.setHeight(
        this.thumbnail.height()
            + this.outline * 2
            + this.edge * 2
            + this.padding * 3
            + (this.object instanceof StageMorph ? 0 :
              this.padding * 2
            + this.duplicator.height())
            + this.label.height()
    );

    this.thumbnail.setCenter(this.center());
    this.thumbnail.setTop(
        this.top() + this.outline + this.edge + this.padding
    );

    if (this.rotationButton) {
        this.rotationButton.setTop(this.top());
        this.rotationButton.setRight(this.right());
    }

    var nextY;
    if (this.object instanceof StageMorph) {
        if (this.duplicator != undefined)
        {
            this.duplicator.destroy();
            this.duplicator = undefined;
        }
        nextY = this.thumbnail.bottom();
    } else {
        this.duplicator.setCenter(this.center());
        this.duplicator.setTop(
            this.thumbnail.bottom() + this.padding
        );
        nextY = this.duplicator.bottom();

        if (this.object)
        {
            var stage = this.object.parentThatIsA(StageMorph);
            if (stage && stage.children)
            {
                var numClones = 0;
                var stageChildren = stage.children;
                for (var i=0; i<stageChildren.length; i++)
                    if (stageChildren[i] instanceof SpriteMorph
                        && stageChildren[i].parentSprite == this.object)
                        numClones++;

                this.duplicator.setContents(numClones);
            }
        }
    }

    this.label.setWidth(
        Math.min(
            this.label.children[0].width(), // the actual text
            this.thumbnail.width()
        )
    );
    this.label.setCenter(this.center());
    this.label.setTop(
        nextY + this.padding
    );
};

IDE_Morph.prototype.uberNewProject = IDE_Morph.prototype.newProject;
IDE_Morph.prototype.newProject = function() {
    Cell.resetToDefault();
    this.stage.setCellAttributeVisibility(Cell.attributes[0], true);
    return this.uberNewProject();
}

//This overrides the additition of a sprite to the stage.
/*IDE_Morph.prototype.snapAppsHookAddSprite = function (sprite) {
    this.stage.add(sprite);
};*/

IDE_Morph.prototype.uberRemoveSprite = IDE_Morph.prototype.removeSprite;
IDE_Morph.prototype.removeSprite = function (object) {
    this.killAllClones(object);
    return this.uberRemoveSprite(object);
}

// Remove this functionality because it does NOT work right now. I didn't realise this was possible
// and I thought the dimensions of the stage were hardcoded somewhere. FIX ME.
IDE_Morph.prototype.userSetStageSize = function () { };
IDE_Morph.prototype._snapapps_showStageSizeOptions = false;

/*************************************************************
 * For Epidemic Simulatioin
 *************************************************************/
// Change saving feature to save to the last_saved table

// IDE_Morph.prototype.save = function() {
//     this.source = 'cloud';

//     if (window.assignmentID) {
//         this.saveProject(window.assignmentID, "last_saved");
//     } else {
//         this.showMessage("You need to set a project name first.", 2);
//     }
// }

// IDE_Morph.prototype.saveProject = function (name, table) {
//     Trace.log('IDE.saveProject', name);
//     var myself = this;
//     this.nextSteps([
//         function () {
//             if (table === "last_saved") {
//                 myself.showMessage('Saving...');
//             }
//         },
//         function () {
//             myself.rawSaveProject(name, table);
//         }
//     ]);
// };

// IDE_Morph.prototype.rawSaveProject = function (name, table) {
//     var myself = this;

//     if (name) {
//         // do not mess with project name since it's already set
//         // this.setProjectName(name);

//         if (Process.prototype.isCatchingErrors) {
//             try {
//                 var xhr = new XMLHttpRequest();
//                 var projectInfo = {
//                     'userID': window.userID,
//                     'time': Date.now(),
//                     'assignmentID': Assignment.getID(),
//                     'data': myself.serializer.serialize(myself.stage),
//                     'table': table
//                 };

//                 xhr.onreadystatechange = function() {
//                     if (table === "last_saved") {
//                         if (xhr.status === 200) {
//                             myself.showMessage('Saved!', 1);
//                         }
//                         else if (xhr.status > 0) {
//                             myself.showMessage('Failed to save: ' + xhr.responseText);
//                             Trace.logErrorMessage(xhr.responseText);
//                         }
//                     }
//                 }
//                 xhr.open('POST', 'logging/login/saveProject.php', true);
//                 xhr.send(JSON.stringify(projectInfo));
//             } catch (err) {
//                 myself.showMessage('Save failed: ' + err);
//                 Trace.logError(err);
//             }
//         } else {

//             // console.log("Not in try block: \n" + this.serializer.serialize(this.stage));
//             // myself.showMessage('Saved!', 1);
//         }
//     }
// };

IDE_Morph.prototype.loadExampleProject = function(name) {
    Trace.log("IDE.loadExampleProject", name);
    if (!name) return;
    if (name === "Viewing") return;
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
        Trace.logErrorMessage("Example project doesn't exist.");
        return false;
    }
}

IDE_Morph.prototype.loadLastSavedProject = function(userID) {
    Trace.log("IDE.loadLastSavedProject", userID);
    if (!userID) return;

    var myself = this;

    if (Process.prototype.isCatchingErrors) {
        try {
            var xhr = new XMLHttpRequest();
            var projectInfo = {
                'userID': userID
            };

            xhr.onreadystatechange = function() {
                if (this.readyState === 4) {
                    if (xhr.status === 200) {
                        if (xhr.responseText.length === 0) {
                            myself.showMessage("You don't have a saved project.");
                            Trace.logErrorMessage("No saved project.", userID);
                        }
                        else {
                            myself.openProjectString(xhr.responseText);
                        }
                    }
                    else {
                        myself.showMessage('Failed to load saved project: ' + xhr.responseText);
                        Trace.logErrorMessage(xhr.responseText);
                    }
                }
            }
            xhr.open('POST', 'logging/login/getProject.php', true);
            xhr.send(JSON.stringify(projectInfo));
        } catch (err) {
            myself.showMessage('Load saved project failed: ' + err);
            Trace.logError(err);
        }
    } else {

        // console.log("Not in try block: \n" + this.serializer.serialize(this.stage));
        // myself.showMessage('Saved!', 1);
    }
}

IDE_Morph.prototype.loadAssignment = function(assignmentID) {
    Trace.log("IDE.loadAssignment", assignmentID);
    Assignment.setID(assignmentID);
    if (assignmentID === "lastSaved") {
        ide.loadLastSavedProject(window.userID);
    }
    else {
        ide.loadExampleProject(window.assignments[assignmentID].name);
    }
    ide.controlBar.updateLabel();
    ide.controlBar.fixLayout();
}

// IDE_Morph.prototype.cloudMenu = function() {
//     var menu,
//         myself = this,
//         world = this.world(),
//         pos = this.controlBar.cloudButton.bottomLeft(),
//         shiftClicked = (world.currentKey === 16);

//     menu = new MenuMorph(this);
//     if (shiftClicked) {
//         menu.addItem(
//             'url...',
//             'setCloudURL',
//             null,
//             new Color(100, 0, 0)
//         );
//         menu.addLine();
//     }
//     // if (!SnapCloud.username) {
//     //     menu.addItem(
//     //         'Login...',
//     //         'initializeCloud'
//     //     );
//     //     menu.addItem(
//     //         'Signup...',
//     //         'createCloudAccount'
//     //     );
//     //     menu.addItem(
//     //         'Reset Password...',
//     //         'resetCloudPassword'
//     //     );
//     // } else {
//     //     menu.addItem(
//     //         localize('Logout') + ' ' + SnapCloud.username,
//     //         'logout'
//     //     );
//     //     menu.addItem(
//     //         'Change Password...',
//     //         'changeCloudPassword'
//     //     );
//     // }
//     if (window.hasOwnProperty('userID') && window.userID) {
//         menu.addItem(
//             localize('Logout') + ' ' + window.userID,
//             'logout'
//         );
//     }
//     else {
//         menu.addItem(
//             'Login...',
//             'login'
//         );
//     }
//     if (shiftClicked) {
//         menu.addLine();
//         menu.addItem(
//             'export project media only...',
//             function () {
//                 if (myself.projectName) {
//                     myself.exportProjectMedia(myself.projectName);
//                 } else {
//                     myself.prompt('Export Project As...', function (name) {
//                         myself.exportProjectMedia(name);
//                     }, null, 'exportProject');
//                 }
//             },
//             null,
//             this.hasChangedMedia ? new Color(100, 0, 0) : new Color(0, 100, 0)
//         );
//         menu.addItem(
//             'export project without media...',
//             function () {
//                 if (myself.projectName) {
//                     myself.exportProjectNoMedia(myself.projectName);
//                 } else {
//                     myself.prompt('Export Project As...', function (name) {
//                         myself.exportProjectNoMedia(name);
//                     }, null, 'exportProject');
//                 }
//             },
//             null,
//             new Color(100, 0, 0)
//         );
//         menu.addItem(
//             'export project as cloud data...',
//             function () {
//                 if (myself.projectName) {
//                     myself.exportProjectAsCloudData(myself.projectName);
//                 } else {
//                     myself.prompt('Export Project As...', function (name) {
//                         myself.exportProjectAsCloudData(name);
//                     }, null, 'exportProject');
//                 }
//             },
//             null,
//             new Color(100, 0, 0)
//         );
//         menu.addLine();
//         menu.addItem(
//             'open shared project from cloud...',
//             function () {
//                 myself.prompt('Author name�??', function (usr) {
//                     myself.prompt('Project name...', function (prj) {
//                         var id = 'Username=' +
//                             encodeURIComponent(usr.toLowerCase()) +
//                             '&ProjectName=' +
//                             encodeURIComponent(prj);
//                         myself.showMessage(
//                             'Fetching project\nfrom the cloud...'
//                         );
//                         SnapCloud.getPublicProject(
//                             id,
//                             function (projectData) {
//                                 var msg;
//                                 if (!Process.prototype.isCatchingErrors) {
//                                     window.open(
//                                         'data:text/xml,' + projectData
//                                     );
//                                 }
//                                 myself.nextSteps([
//                                     function () {
//                                         msg = myself.showMessage(
//                                             'Opening project...'
//                                         );
//                                     },
//                                     function () {nop(); }, // yield (Chrome)
//                                     function () {
//                                         myself.rawOpenCloudDataString(
//                                             projectData
//                                         );
//                                     },
//                                     function () {
//                                         msg.destroy();
//                                     }
//                                 ]);
//                             },
//                             myself.cloudError()
//                         );

//                     }, null, 'project');
//                 }, null, 'project');
//             },
//             null,
//             new Color(100, 0, 0)
//         );
//     }
//     menu.popup(world, pos);
// }

// IDE_Morph.prototype.logout = function() {
//     window.userID = null;
//     window.location.replace('logging/assignment.html');
// }

// IDE_Morph.prototype.login = function() {
//     window.location.replace('logging/assignment.html');
// }