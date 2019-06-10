
// A list of assignments that users can select from when using Snap
// The assignmentID will be logged with each statement
// 'test' and 'view' will not show up on the selection menu
// Assignment name needs to be the same as example name in EXAMPLES file
window.assignments = {
    'LoginAndAccount': {
        name: 'Create Snap Account',
    },
    'Activity1': {
        name: 'Activity 1: Click Alonzo Game',
    },
    'Activity2Part1': {
        name: 'Activity 2 Part 1: Gossip and Greet',
    },
    'Activity2Part2': {
        name: 'Activity 2 Part 2: Gossip and Greet',
    },
    'test': {
        name: 'Testing',
    },
    'view': {
        name: 'Viewing',
    },
};

// If true, requires the Snap users to select an assignment before
// proceeding. Assignments can be pre-specified by using the url
// snap.html?assignment=id
window.requireAssignment = true;
// Allows the user to change their assignment by clicking on project title
window.allowChangeAssignment = false;

// If true, users are required to login before they can use the system
window.requireLogin = true;

// If true, allow new user to login
window.allowNewUser = false;

// If true, if in pair
window.isPairProgramming = false;

// Specify to override the default Snap cloud URL
// window.snapCloudURL = 'https://snap.apps.miosoft.com/SnapCloud';

// Specify login instructions such as which login ID to use.
window.unityID = {
    instruction: 'Sign in with your PD ID',
    hint: '( Your first initial + entire last name )'
}

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
