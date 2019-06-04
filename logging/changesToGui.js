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

IDE_Morph.prototype.loadAssignment = function(assignmentID) {
    Trace.log("IDE.loadAssignment", assignmentID);
    Assignment.setID(assignmentID);

    ide.loadExampleProject(window.assignments[assignmentID].name);

    ide.controlBar.updateLabel();
    ide.controlBar.fixLayout();
}