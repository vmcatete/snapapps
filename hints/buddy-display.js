require('hint-display');
require('../logging/assignment');


function BuddyDisplay() {
    window.buddyDisplay = this;
}

BuddyDisplay.prototype = Object.create(HintDisplay.prototype);

BuddyDisplay.prototype.initDisplay = function() {
    this.button = window.ide.controlBar.addCustomButton('buddyButton', localize("View Other's Work"), BuddyDisplay.showSwapDialog);
};

BuddyDisplay.prototype.show = function() {
    if (this.button) {
        this.button.show();
    }
};

BuddyDisplay.prototype.hide = function() {
    if (this.button) {
        this.button.hide();
    }
};

BuddyDisplay.prototype.alwaysActive = function() {
    return true;
};

BuddyDisplay.prototype.getHintType = function() {
    return 'buddy';
};

BuddyDisplay.prototype.clear = function() {
};

BuddyDisplay.serializer = new SnapSerializer();

BuddyDisplay.showSwapDialog = function() {
    var code = BuddyDisplay.serializer.serialize(ide.stage);
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
            Trace.log('BuddyDisplay.roleSwapTo', logData);
            this.destroy();
    
            // Make sure in the php.ini file, increase the "max_allowed_packet" so that mysql allow the transmission
            xhr.onreadystatechange = function() {
                if (!(xhr.status === 200 && xhr.readyState === 4)) return;
                Trace.log('BuddyDisplay.savedProject');
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
            Trace.log('BuddyDisplay.roleSwapTo', logData);
            this.destroy();
    
            xhr.onreadystatechange = function() {
                if (!(xhr.status === 200 && xhr.readyState === 4)) return;
                Trace.log('BuddyDisplay.receivedProject');
                var response = xhr.responseText;
                if (!response || !response.startsWith('<project')) {
                    new DialogBoxMorph().inform('No Pair Project Saved',
                        'We could not find a recent project to load from your partner.\n' +
                        'Make sure they saved recently by switching to Navigator.',
                        window.world);
                    Trace.log('BuddyDisplay.noProjectToLoad');
                    return;
                }
    
                new DialogBoxMorph(this, function() {
                    Trace.log('BuddyDisplay.loadProject');
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
BuddyDisplay.prototype.changeRoleTo = function(newRole) {
    window.currentRole = newRole;

    if (newRole == 'driver') {
        this.button.labelColor = new Color(255, 0, 0, 1);
        this.button.labelString = "Driver (swap role)";
    }
    else {
        this.button.labelColor = new Color(0, 0, 255, 1);
        this.button.labelString = "Navigator (swap role)";
    }

    this.button.drawNew();
    this.button.fixLayout();
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

window.test = function() {
    var a = new DialogBoxMorph();
    var inp = new AlignmentMorph('column', 2);
    var bdy = new AlignmentMorph('column', this.padding);
    var pw1 = new InputFieldMorph();
    var txt = new TextMorph(
        "view who?",
        10,
        null, // style
        false, // bold
        null, // italic
        null, // alignment
        null, // width
        null, // font name
        MorphicPreferences.isFlat ? null : new Point(1, 1),
        new Color(255, 255, 255) // shadowColor
    );
    var msg = new TextMorph(
        "what message??",
        10,
        null, // style
        false, // bold
        null, // italic
        null, // alignment
        null, // width
        null, // font name
        MorphicPreferences.isFlat ? null : new Point(1, 1),
        new Color(255, 255, 255) // shadowColor
    );

    inp.alignment = 'left';
    pw1.setWidth(200);
    inp.setColor(new Color(255, 255, 255, 1));
    inp.add(txt);
    inp.add(pw1);
    bdy.add(inp);
    // bdy.add(msg);
    inp.fixLayout();
    bdy.fixLayout();
    a.addBody(bdy);

    txt.drawNew();
    pw1.drawNew();
    msg.drawNew();
    inp.drawNew();
    bdy.fixLayout();
    

    // a.addText("hellow", "alalalalalala");
    a.addButton("ok", "View");
    a.addButton("cancel", "Bye");
    a.action = function() {
        window.alert("view");
    }
    a.drawNew();
    a.fixLayout();

    window.a = a;
}