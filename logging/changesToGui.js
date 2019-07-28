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

    // Assignment.setID(assignmentID);
    if (!sessionStorage.assignment) {
        window.assignmentID = "none";
        window.assignment = {};

        Trace.log("No assignment available for loading.");
        console.log("No assignment available for loading.");
    }
    else {
        window.assignment = JSON.parse(sessionStorage.assignment);
        window.assignmentID = window.assignment.assignment_id;

        var resourceURL = ide.resourceURL(window.assignmentFolder, window.assignment.assignment_file_name);
        var xmlString = ide.getURL(resourceURL);

        if (!xmlString.startsWith("<!DOC")) {
            ide.openProjectString(ide.getURL(resourceURL));
            Trace.log("IDE.loadAssignment", window.assignmentID);
        }
        else {
            Trace.log("IDE.loadAssignmentFailed", window.assignmentID);
        }
    }

    window.hintProvider = window.getHintProvider();

    // ide.loadExampleProject(window.assignments[assignmentID].name);

    ide.controlBar.updateLabel();
    ide.controlBar.fixLayout();
}