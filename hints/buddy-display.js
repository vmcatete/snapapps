require('hint-display');
require('../logging/assignment');


function BuddyDisplay() {
    window.buddyDisplay = this;
    this.snapViewerDialog = new Dialog("snap-viewer", "Snap Viewer", nop);// set callback function later
}

BuddyDisplay.prototype = Object.create(HintDisplay.prototype);

BuddyDisplay.prototype.initDisplay = function() {
    this.button = window.ide.controlBar.addCustomButton('shareButton', localize("Share My Work"), BuddyDisplay.showShareDialog);
    this.button = window.ide.controlBar.addCustomButton('viewButton', localize("View Other's Work"), BuddyDisplay.showViewDialog);
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

BuddyDisplay.showViewDialog = function() {
    var url = 'localhost/buddy-viewer/snap.html?username=ydong2&view=rcmms-demo';
    var viewDialog = new DialogBoxMorph();
    var inp = new AlignmentMorph('column', 2);
    var txtbox = new InputFieldMorph();
    var myself = this;
    var txt = new TextMorph(
        "Who's project you want to view?",
        12,
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
    txtbox.setWidth(200);
    inp.setColor(new Color(255, 255, 255, 1));
    inp.add(txt);
    inp.add(txtbox);
    viewDialog.addBody(inp);

    txt.drawNew();
    txtbox.drawNew();
    inp.drawNew();
    txtbox.fixLayout();
    inp.fixLayout();

    viewDialog.addButton("ok", "Go");
    viewDialog.addButton("cancel", "Cancel");
    viewDialog.labelString = "View Project";
    viewDialog.createLabel();
    viewDialog.action = function() {
        $.post('../php/getUser.php', {
            'user_name': txtbox.getValue()
        }, function(data, status) {
            // if new user, display user doesn't exist message.
            if (data == "new user") {
                ide.inform("Invalid User", "We have never seen '" + txtbox.getValue() + "' before. \n Please verify the user name."); // might be able to 
            }
            // if existing user, log into snap account.
            else {
                window.alert("openning new window")
            }
        }).fail(function(xhr, status, error) {
            window.alert(xhr.responseText);
        });
    }
    viewDialog.drawNew();
    viewDialog.fixLayout();

    viewDialog.popUp(window.world);
    txtbox.edit();
}

BuddyDisplay.showShareDialog = function() {
    var code = BuddyDisplay.serializer.serialize(ide.stage);
    var user = window.userID;
    var xhr = new XMLHttpRequest();
    var myself = this;
    var dialog = new DialogBoxMorph();
    var xhr = new XMLHttpRequest();
    var url = "" // Left off here

    dialog.askYesNo("Share My Work", "Are you sure you want to share this project? \n" +
        "(This will replace the project that you shared before)", window.world);

    dialog.action = function() {
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
    }
    dialog.drawNew();
    dialog.fixLayout();
    dialog.popUp();
}


