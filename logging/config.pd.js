
// A list of assignments that users can select from when using Snap
// The assignmentID will be logged with each statement
// 'test' and 'view' will not show up on the selection menu
// Assignment name needs to be the same as example name in EXAMPLES file
window.assignments = {
    // 'LoginAndAccount': {
    //     name: 'Create Snap Account',
    // },
    // 'Activity1': {
    //     name: 'Activity 1: Click Alonzo Game',
    // },
    // 'Activity2Part1': {
    //     name: 'Activity 2 Part 1: Gossip and Greet',
    // },
    // 'Activity2Part2': {
    //     name: 'Activity 2 Part 2: Gossip and Greet',
    // },
    'Day1Activity1': {
        name: 'Draw Square Starter',
        hint: 'Day 1 Activity 1',
        quizURLs: {
            'Reflection Questions': 'https://ncsu.qualtrics.com/jfe/form/SV_7P3HuJ4SrGhvd09',
        }
    },
    'Day1Activity2': {
        name: 'Introduce Yourself Starter',
        hint: 'Day 1 Activity 2',
        quizURLs: {
            'Reflection Questions': 'https://ncsu.qualtrics.com/jfe/form/SV_8dCmxOCqxqYECnH',
        }
    },
    'Day2Activity1': {
        name: 'Balancing Scales Starter',
        hint: 'Day 2 Activity 1',
        quizURLs: {
            'Reflection Questions': 'https://ncsu.qualtrics.com/jfe/form/SV_bBdnDSlEuIIy6gJ',
        }
    },
    'Day2Activity2': {
        name: 'Graphing Coordinates Starter',
        hint: 'Day 2 Activity 2',
        quizURLs: {
            'Reflection Questions': 'https://ncsu.qualtrics.com/jfe/form/SV_3KwUkMNg2OyfY8d',
        }
    },
    'Day3Activity1': {
        name: 'Epidemics Starter',
        hint: 'Day 3 Activity 1',
    },
    'Day3Activity2': {
        name: 'Foodwebs Starter',
        hint: 'Day 3 Activity 1',
        quizURLs: {
            'Reflection Questions': 'https://ncsu.qualtrics.com/jfe/form/SV_cuJDf4IGqIf0d2R',
        }
    },
    'Create': {
        name: 'Create my own',
        hint: 'Create Session',
    },
    'viewing': {
        name: 'Viewing',
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
window.isPairProgramming = true;

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
