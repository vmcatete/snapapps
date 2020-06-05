// Static class for handling assignment gets and sets.
// TODO: Still stores the assignmentID in window, but should probably own it

var Assignment = {

};

Assignment.exist = false; // Used in changesToGui.js to see if there is an assignment file to load. initialize to false;

Assignment.redirectURL = "../login.html";

Assignment.initOrRedirect = function() {
    // check if user is logged into OUR system (sessionStorage.user) but not only Snap Cloud (sessionStorage.username)
    window.assignmentID = getSearchParameters()['assignment'];

    if (window.assignmentID != "view") {
        // set assignment first, because userID format is determined by if the assignment is pair programming
        if (sessionStorage.assignment) {
            window.assignment = JSON.parse(sessionStorage.assignment);
            Assignment.exist = true;
        }
        else {
            window.assignment = {};
            window.assignment.assignment_id = "N/A";
            window.assignment.assignment_name = "Explore";
            Assignment.exist = false;
        }
        // set userID
        if (sessionStorage.user) {
            window.user = JSON.parse(sessionStorage.user)
            // set user id based on if is paired programming
            if (Assignment.isPairProgramming()) {
                window.partner = JSON.parse(sessionStorage.partner);
                window.userID = window.user.user_id + '/' + window.partner.user_id;
            }
            else {
                window.userID = window.user.user_id;
            }
        }
        else {
            window.location.replace(Assignment.redirectURL);
        }

    }
    else { // does not require login to view the log
        window.assignment = {};
        window.userID = "viewer";
        window.assignment.assignment_id = "view";
        window.assignment.assignment_name = "view";
        Assignment.exist = false;
    }
}

Assignment.get = function() {
    return window.assignment;
}

Assignment.getID = function() {
    return window.assignment.assignment_id;
}

Assignment.getName = function() {
    return window.assignment.assignment_name;
}

Assignment.getFileName = function() {
    return window.assignment.assignment_file_name;
}

Assignment.setID = function(assignmentID) {
    if (assignmentID === Assignment.getID()) return;
    if (!window.assignments || !window.assignments[assignmentID]) {
        Trace.logErrorMessage('Invalid assignment: ' + assignmentID);
        return;
    }

    // Log the change twice, so it will show up for both assignments
    var formerID = Assignment.getID();
    Trace.log('Assignment.setID', assignmentID);
    window.assignmentID = assignmentID;
    // Update the project's assignment (overwrite it) to the new assignmentID
    // This will only matter if the project is saved, which presumably implies
    // the change was intended to be permanent
    Assignment.updateStageAssignment(true);

    // Force the code to be re-logged so that we have an initial code state for
    // the new assignment log
    Trace.log('Assignment.setIDFrom', formerID, false, true);

    var params = getSearchParameters();
    var path = location.pathname;
    var keys = Object.keys(params);
    var sep = '?';
    keys.forEach(function(key) {
        var val = params[key];
        if (key === 'assignment') val = assignmentID;
        path += sep + encodeURIComponent(key) + '=' +
            encodeURIComponent(val);
        sep = '&';
    });
    window.history.replaceState(assignmentID, assignmentID, path);

    var assignment = Assignment.get();
    Assignment.onChangedHandlers.forEach(function(handler) {
        if (handler) handler(assignment);
    });

    if (window.ide) ide.fixLayout();
};

Assignment.isPairProgramming = function() {
    //the "==1" part is a must since is_pair_programming attribute's type is string due to parsed from JSON.parse.
    return Assignment.get().is_pair_programming == "1";
};

Assignment.getUsers = function() {
    if (!window.userID) return [];
    return window.userID.split('/');
};

// Assignment.updateStageAssignment = function(overwrite) {
//     // If overwriting or the project's assignment is 'none' or null,
//     // update it to match the current assignmentID
//     if (window.ide && ide.stage && (overwrite || ide.stage.assignment == null ||
//             ide.stage.assignment === '' || ide.stage.assignment === 'none')) {
//         ide.stage.assignment = Assignment.getID();
//     }
// };

// for Hint-Provider use
Assignment.onChangedHandlers = [];

Assignment.onChanged = function(handler) {
    Assignment.onChangedHandlers.push(handler);
};

// extend(StageMorph, 'init', function(base, globals) {
//     base.call(this, globals);
//     this.assignment = Assignment.getID();
// });

// extend(SnapSerializer, 'openProject', function(base, project, ide) {
//     base.call(this, project, ide);
//     Assignment.updateStageAssignment();

//     // When a project is opened, update the current assignment to match
//     if (ide.stage && ide.stage.assignment !== Assignment.getID() &&
//             window.assignments) {
//         var currentAssignment = Assignment.get();
//         var projectAssignmentID = ide.stage.assignment;
//         // Make sure the project's assignment is listed and not a prequel of
//         // the current assignment
//         if (window.assignments[projectAssignmentID] &&
//                 currentAssignment.prequel !== projectAssignmentID) {
//             // Then update to the project's assignment
//             Trace.log('Assignment.updateAssignmentOnOpen');
//             Assignment.setID(projectAssignmentID);
//         }

//     }
// });

// extend(IDE_Morph, 'createControlBar', function(baseCreate) {
//     baseCreate.call(this);
//     var ide = this;
//     extendObject(this.controlBar, 'updateLabel', function(base) {
//         base.call(this);
//         if (ide.isAppMode) return;
//         var assignment = Assignment.get();
//         if (!assignment) return;
//         // A bit of a crude approximation, but it's not worth measuring exactly
//         var maxLength = Math.max(0, (ide.spriteEditor.width() / 6) - 35);
//         var text = this.label.text;
//         if (Assignment.getID() !== 'none' && (maxLength - text.length) > 5) {
//             text += ' - ' + assignment.name;
//         }
//         if (text.length > maxLength) {
//             text = text.slice(0, maxLength) + '...';
//         }
//         this.label.text = text;
//         this.label.parent = null;
//         this.label.drawNew();
//         this.label.parent = this;

//         if (!window.allowChangeAssignment) return;

//         this.label.mouseEnter = function() {
//             document.body.style.cursor = 'pointer';
//         };

//         this.label.mouseLeave = function() {
//             document.body.style.cursor = 'inherit';
//         };

//         this.label.mouseClickLeft = function() {
//             var menu = new MenuMorph(ide);
//             var pos = ide.controlBar.label.bottomLeft();
//             menu.addItem(
//                 localize('Change assignment:'), null, null, null, true);
//             Object.keys(window.assignments).forEach(function(key) {
//                 if (key === 'test' || key === 'view') return;
//                 var assignment = window.assignments[key];
//                 var name = assignment.name;
//                 if (assignment.hint) {
//                     name += ' (' + assignment.hint + ')';
//                 }
//                 menu.addItem(name, function() {
//                     Assignment.setID(key);
//                     ide.controlBar.updateLabel();
//                     ide.controlBar.fixLayout();
//                 }, null, null, key === Assignment.getID());
//             });
//             menu.popup(world, pos);
//         };
//     });
// });