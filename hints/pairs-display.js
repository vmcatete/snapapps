require('hint-display');
require('../logging/assignment');


// TODO: Rename to VectorHintDispplay or something
function PairsDisplay() {
    window.pairsDisplay = this;
}

PairsDisplay.prototype = Object.create(HintDisplay.prototype);

PairsDisplay.prototype.initDisplay = function() {

};

PairsDisplay.prototype.show = function() {
    if (!Assignment.isPairProgramming()) {
        this.hide();
        this.active = false;
        return;
    }

    window.currentRole = sessionStorage.initRole;
    Trace.log('PairsDisplay.show', window.currentRole);

    // this.hintButton = this.addHintButton(localize('Swap Roles'), PairsDisplay.showSwapDialog, false); // the third parameter is for setting the isHitnButton false.
    this.pairsButton = window.ide.controlBar.addCustomButton('pairsButton', localize('Swap Roles'), PairsDisplay.showSwapDialog)

    this.changeRoleTo(window.currentRole);
};

PairsDisplay.prototype.hide = function() {
    if (this.pairsButton) this.pairsButton.destroy();
};

PairsDisplay.prototype.alwaysActive = function() {
    return Assignment.isPairProgramming();
};

PairsDisplay.prototype.getHintType = function() {
    return 'pairs';
};

PairsDisplay.prototype.clear = function() {
};

PairsDisplay.serializer = new SnapSerializer();

PairsDisplay.showSwapDialog = function() {
    var code = PairsDisplay.serializer.serialize(ide.stage);
    var users = Assignment.getUsers();
    if (!code || users.length != 2) {
        new DialogBoxMorph().inform('Not Pair Programming',
        'We do not detect a pair programming partner.')
    }

    var user1 = users[0];
    users.sort();
    var userA = users[0];
    var userB = users[1];
    var fromUserA = (user1 == userA) ? 1 : 0;
    var guid = newGuid();

    var url = 'logging/checkpoint.php?userIDA=' + encodeURI(userA) +
        '&userIDB=' + encodeURI(userB) +
        '&fromUserA=' + encodeURI(fromUserA) +
        '&guid=' + encodeURI(guid);

    var xhr = new XMLHttpRequest();
    var myself = this;

    var dialog = new DialogBoxMorph();
    dialog.addText(localize('Swap Roles?'),
        localize('If you were just writing code as the Driver, SAVE your code now.\n' +
        'If you are about to write code as the Driver, LOAD your partner\'s\n' +
        'code after they have saved it.'));

    var logData = {
        userIDA: userA,
        userIDB: userB,
        fromUserA: fromUserA,
        guid: guid,
    };

    if (window.currentRole == 'driver') {
        var button = dialog.addButton(function() {
            logData.newRole = 'Navigator';
            Trace.log('PairsDisplay.roleSwapTo', logData);
            this.destroy();
    
            // Make sure in the php.ini file, increase the "max_allowed_packet" so that mysql allow the transmission
            xhr.onreadystatechange = function() {
                if (!(xhr.status === 200 && xhr.readyState === 4)) return;
                Trace.log('PairsDisplay.savedProject');
                new DialogBoxMorph().inform('Project Saved',
                    'Project saved! Now your partner should Load the project.',
                    window.world);

                window.pairsDisplay.changeRoleTo('navigator');
            };
    
            xhr.open('POST', url, true);
            xhr.send(code);
        }, 'Save (start Nagivating)');

        // change the button color to reflect navigator
        button.labelColor = new Color(0,0,255,1);
        button.drawNew();
        button.fixLayout();
    }
    else {
        var button = dialog.addButton(function() {
            logData.newRole = 'Driver';
            Trace.log('PairsDisplay.roleSwapTo', logData);
            this.destroy();
    
            xhr.onreadystatechange = function() {
                if (!(xhr.status === 200 && xhr.readyState === 4)) return;
                Trace.log('PairsDisplay.receivedProject');
                var response = xhr.responseText;
                if (!response || !response.startsWith('<project')) {
                    new DialogBoxMorph().inform('No Pair Project Saved',
                        'We could not find a recent project to load from your partner.\n' +
                        'Make sure they saved recently by switching to Navigator.',
                        window.world);
                    Trace.log('PairsDisplay.noProjectToLoad');
                    return;
                }
    
                new DialogBoxMorph(this, function() {
                    Trace.log('PairsDisplay.loadProject');
                    window.ide.openProjectString(response);

                    window.pairsDisplay.changeRoleTo('driver');
                }).askYesNo('Overwrite Code?',
                'This will load your partner\'s project and overwrite your own.\n' +
                'Are you sure you want to continue?',
                window.world);
            };
    
            xhr.open('GET', url, true);
            xhr.send();
        }, 'Load (start Driving)');

        // change the button color to reflect navigator
        button.labelColor = new Color(255,0,0,1);
        button.drawNew();
        button.fixLayout();
    }

    dialog.addButton('cancel', 'Cancel');
    dialog.drawNew();
    dialog.fixLayout();
    dialog.popUp(window.world);
};

// change the role button to new row and update window.currentRole
PairsDisplay.prototype.changeRoleTo = function(newRole) {
    window.currentRole = newRole;

    if (newRole == 'driver') {
        this.pairsButton.labelColor = new Color(255, 0, 0, 1);
        this.pairsButton.labelString = "Driver (swap role)";
    }
    else {
        this.pairsButton.labelColor = new Color(0, 0, 255, 1);
        this.pairsButton.labelString = "Navigator (swap role)";
    }

    this.pairsButton.drawNew();
    this.pairsButton.fixLayout();
}

DialogBoxMorph.prototype.addText = function (
    title,
    textString
) {
    var txt = new TextMorph(
        textString,
        this.fontSize,
        this.fontStyle,
        true,
        false,
        'center',
        null,
        null,
        MorphicPreferences.isFlat ? null : new Point(1, 1),
        new Color(255, 255, 255)
    );

    if (!this.key) {
        this.key = 'inform' + title + textString;
    }

    this.labelString = title;
    this.createLabel();
    if (textString) {
        this.addBody(txt);
    }
};