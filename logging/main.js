// Logs things. Not a morphic.

require('console-logger.js');
require('diff-logger.js');
require('db-logger.js');

var Trace;

// Setup
(function () {
    // surpress init or redirect because does not require login.
    // Assignment.initOrRedirect();
    window.assignment = {};
    window.assignment.assignment_id = getSearchParameters()['view'] + '*' + getSearchParameters()['projectid'];

    if (window.createLogger) {
        Trace = window.createLogger(Assignment.getID());
    } else {
        Trace = new Logger(50);
    }

    if (window.easyReload && window.easyReload(Assignment.getID())) {
        setTimeout(function() {
            window.onbeforeunload = null;
        }, 2000);
    }

    window.onerror = function(msg, url, line, column, error) {
        Trace.logError({
            'message': msg,
            'fileName': url,
            'lineNumber': line,
            'columnNumber': column,
            'stack': error ? error.stack : null,
        });
    };
})();
