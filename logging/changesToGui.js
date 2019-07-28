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
    if (!Assignment.exist) {
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

    window.hintProvider = window.getHintProvider();

    // ide.loadExampleProject(window.assignments[assignmentID].name);

    ide.controlBar.updateLabel();
    ide.controlBar.fixLayout();
}