
// A list of assignments that users can select from when using Snap
// The assignmentID will be logged with each statement
// 'test' and 'view' will not show up on the selection menu
// Assignment name needs to be the same as example name in EXAMPLES file
window.assignments = {
    'cellularTutorialStarter': {
        name: 'Cellular Tutorial Starter',
        hint: 'Tutorial Starter Kit',
    },
    'epidemic2Starter': {
        name: 'Epidemic Day 2 Starter',
        hint: 'Topic for Day 2',
    },
    'epidemic2Final': {
        name: 'Epidemic Day 2 Final',
        hint: 'Topic for Day 2',
    },
    'epidemic3Starter': {
        name: 'Epidemic Day 3 Starter',
        hint: 'Topic for Day 3',
    },
    'epidemic3Final': {
        name: 'Epidemic Day 3 Final',
        hint: 'Topic for Day 3',
    },
    'epidemic5Starter': {
        name: 'Epidemic Day 5 Starter',
        hint: 'Topic for Day 5',
    },
    'epidemic5Final': {
        name: 'Epidemic Day 5 Final',
        hint: 'Topic for Day 5',
    },
    'lastSaved': {
        name: 'Last Saved Project',
        hint: 'The last time you pressed save',
    },
    'test': {
        name: 'Testing',
    },
    'view': {
        name: 'Viewing',
    }
};

// If true, requires the Snap users to select an assignment before
// proceeding. Assignments can be pre-specified by using the url
// snap.html?assignment=id
window.requireAssignment = true;
// Allows the user to change their assignment by clicking on project title
window.allowChangeAssignment = true;

// If true, users are required to login before they can use the system
window.requireLogin = true;

// If true, allow new user to login
window.allowNewUser = false;

// Specify to override the default Snap cloud URL
// window.snapCloudURL = 'https://snap.apps.miosoft.com/SnapCloud';

// Specify the login header's logo and title text
window.loginHeader = {
    logo: 'login/NCStateLogoWhite.png',
    description: 'Epidemics Simulation Activities'
};

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
