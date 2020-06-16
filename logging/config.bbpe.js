
// This folder stores all the starter code.
// The file name should be consistent with the assignment_file_name field
// in the assignment table.
window.assignmentFolder = "Examples";

// This folder stores all instruction files.
// all instruction files should be pdf.
window.instructionFolder = "Instructions";

// For buddy display
// is the viewer in a new window or a inner window?
window.openViewerInNewWindow = true;

// Specify the login header's logo and title text
window.loginHeader = {
    logo: 'login/NCStateLogoWhite.png',
    description: 'Infusing Computing Professional Development'
};

// Set the quiz-bar title
window.defaultQuizTitle = "Summer Quiz:"

// Create the logger you want to use on this snap deployment
window.createLogger = function(assignmentID) {
    if (assignmentID == 'view') {
        // Logs to the console
        return new window.ConsoleLogger(50);
    } else {
        // Logs to a MySQL database
        return new window.DBLogger(3000);
    }
};

// If this function returns true, Snap will not confirm before
// you leave the page. This is handy for debugging.
window.easyReload = function(assignmentID) {
    return (assignmentID == 'test' || assignmentID == 'view');
};
