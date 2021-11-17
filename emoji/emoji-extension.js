WardrobeMorph.prototype.emojiNew = function () {
    ide.importEmojis();
};

IDE_Morph.prototype.importEmojis = function () {

    fetch("Emojis/EMOJIS").then(f => {
        f.text().then(txt => {
            var emojis = this.parseEmojiFile(txt);
            new EmojiImportDialogMorph(this, emojis).popUp();
        })
    })

    /*
    this.getURL(
        this.resourceURL('Emojis', 'EMOJIS'),
        txt => {
            var emojis = this.parseEmojiFile(txt);
            new EmojiImportDialogMorph(this, emojis).popUp();
        }
    );
    */
};

IDE_Morph.prototype.parseEmojiFile = function (text) {
    // A Resource File lists all the files that could be loaded in a submenu
    // Examples are libraries/LIBRARIES, Costumes/COSTUMES, etc
    // The file format is tab-delimited, with unix newlines:
    // file-name, Display Name, Help Text (optional)
    // items = [
    //     {
    //         category : '',
    //         emojis : [
    //             {
    //                 fileName : '',
    //                 ascii : '',
    //                 description : '',
    //                 alternatives : []
    //             }
    //         ]
    //     }
    // ]
    var parts,
        items = [],
        cat = "Smileys & Emotions",
        emojiList =[];

    text.split('\n').map(line =>
        line.trim()
    ).filter(line =>
        line.length > 0
    ).forEach((line, index) => {
        if (line.startsWith('#') && index != 0) {
            items.push({
                category : cat,
                emojis :  emojiList
            });
            cat = line.slice(2);
            emojiList = [];
        } else {
            parts = line.split('\t').map(str => str.trim());
            if (index != 0) {
                var alt = [];
                if (parts[3]) {
                    alt = parts[3].toLowerCase().split(' ').map(str => str + ".png");
                }
                alt.unshift(parts[0].toLowerCase() + ".png");
                emojiList.push({
                    fileName: parts[0].toLowerCase() + ".png",
                    ascii: parts[1],
                    description: parts[2],
                    alternatives: alt
                });
            }

        }
    });
    console.log(items);
    return items;
};

IDE_Morph.prototype.droppedEmojiSVG = function (anImage, name) {
    Trace.log("IDE.droppedSVG", name);
    var costume = new SVG_Costume(anImage, '');
    this.currentSprite.addCostume(costume);
    this.currentSprite.wearCostume(costume);
    this.spriteBar.tabBar.tabTo('costumes');
    this.hasChangedMedia = true;
};

// EmojiImportDialogMorph ///////////////////////////////////////////
// I am preview dialog shown before importing a library.
// I inherit from a DialogMorph but look similar to
// ProjectDialogMorph, and BlockImportDialogMorph
// Author: Nathan Stout

EmojiImportDialogMorph.prototype = new DialogBoxMorph();
EmojiImportDialogMorph.prototype.constructor = EmojiImportDialogMorph;
EmojiImportDialogMorph.uber = DialogBoxMorph.prototype;

// EmojiImportDialogMorph instance creation:

function EmojiImportDialogMorph(ide, emojisData) {
    this.init(ide, emojisData);
}

EmojiImportDialogMorph.prototype.init = function (ide, emojisData) {
    // initialize inherited properties:
    EmojiImportDialogMorph.uber.init.call(
        this,
        this, // target
        null, // function
        null  // environment
    );

    this.ide = ide;
    this.key = 'importLibrary';
    this.emojisData = emojisData; // [{name: , fileName: , description:}]
    this.selectedIcon = null;
    this.scope = this;

    this.handle = null;
    this.listField = null;
    this.palette = null;
    this.notesText = null;
    this.notesField = null;

    this.labelString = 'Import emoji';
    this.createLabel();

    this.buildContents();
};

EmojiImportDialogMorph.prototype.buildContents = function () {
    this.addBody(new Morph());
    this.body.color = this.color;

    this.initializePalette();
    this.initializeAlternatives();
    this.installEmojiList();

    this.addButton('importEmoji', 'Import');
    this.addButton('cancel', 'Cancel');

    this.setExtent(new Point(460, 455));
    this.fixLayout();
};

EmojiImportDialogMorph.prototype.initializePalette = function () {
    // I will display a scrolling list of blocks.
    if (this.palette) {this.palette.destroy(); }

    this.palette = new ScrollFrameMorph(
        null,
        null,
        SpriteMorph.prototype.sliderColor
    );
    this.palette.color = SpriteMorph.prototype.paletteColor;
    this.palette.padding = 4;
    this.palette.isDraggable = false;
    this.palette.acceptsDrops = false;
    this.palette.contents.acceptsDrops = false;

    this.body.add(this.palette);
};

EmojiImportDialogMorph.prototype.initializeAlternatives = function () {
    if (this.notesField) {this.notesField.destroy(); }

    this.notesField = new ScrollFrameMorph(
        null,
        null,
        SpriteMorph.prototype.sliderColor
    );
    this.notesField.color = SpriteMorph.prototype.paletteColor;
    this.notesField.padding = 4;
    this.notesField.isDraggable = false;
    this.notesField.acceptsDrops = false;
    this.notesField.contents.acceptsDrops = false;

    this.body.add(this.notesField);

    // if (this.notesField) {this.notesField.destroy(); }

    // this.notesField = new ScrollFrameMorph();
    // this.notesField.fixLayout = nop;

    // this.notesField.edge = InputFieldMorph.prototype.edge;
    // this.notesField.fontSize = InputFieldMorph.prototype.fontSize;
    // this.notesField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    // this.notesField.contrast = InputFieldMorph.prototype.contrast;
    // this.notesField.render = InputFieldMorph.prototype.render;
    // this.notesField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    // this.notesField.acceptsDrops = false;
    // this.notesField.contents.acceptsDrops = false;

    // // this.notesText = new ScrollFrameMorph(
    // //     null,
    // //     null,
    // //     SpriteMorph.prototype.sliderColor
    // // );

    // this.notesField.isTextLineWrapping = true;
    // this.notesField.padding = 3;
    // // this.notesField.setContents(this.notesText);
    // this.notesField.setHeight(100);

    // this.body.add(this.notesField);
};

EmojiImportDialogMorph.prototype.installEmojiList = function () {
    if (this.listField) {this.listField.destroy(); }

    this.listField = new ListMorph(
        this.emojisData,
        element => element.category,
        null,
        null
    );

    this.fixListFieldItemColors();

    this.listField.fixLayout = nop;
    this.listField.edge = InputFieldMorph.prototype.edge;
    this.listField.fontSize = InputFieldMorph.prototype.fontSize;
    this.listField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.listField.contrast = InputFieldMorph.prototype.contrast;
    this.listField.render = InputFieldMorph.prototype.render;
    this.listField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    // Click on category, display corresponsing emojis
    this.listField.action = (item) => {
        if (isNil(item)) {return; }

        // this.notesText.text = localize('');
        // this.notesText.rerender();
        // this.notesField.contents.adjustBounds();

        this.showMessage(localize('Loading') + '\n' + localize(item.category));
        this.initializeAlternatives();
        this.displayEmojis(item.emojis);
    };

    this.listField.setWidth(140);
    this.body.add(this.listField);

    this.fixLayout();
};

EmojiImportDialogMorph.prototype.popUp = function () {
    var world = this.ide.world();
    if (world) {
        EmojiImportDialogMorph.uber.popUp.call(this, world);
        this.handle = new HandleMorph(
            this,
            300,
            300,
            this.corner,
            this.corner
        );
    }
};

EmojiImportDialogMorph.prototype.fixListFieldItemColors =
    ProjectDialogMorph.prototype.fixListFieldItemColors;

EmojiImportDialogMorph.prototype.clearDetails =
    ProjectDialogMorph.prototype.clearDetails;

EmojiImportDialogMorph.prototype.fixLayout = function () {
    var titleHeight = fontHeight(this.titleFontSize) + this.titlePadding * 2,
        thin = this.padding / 2;

    if (this.body) {
        this.body.setPosition(this.position().add(new Point(
            this.padding,
            titleHeight + this.padding
        )));
        this.body.setExtent(new Point(
            this.width() - this.padding * 2,
            this.height()
                - this.padding * 3 // top, bottom and button padding.
                - titleHeight
                - this.buttons.height()
        ));

        this.listField.setExtent(new Point(
            140,
            this.body.height()
        ));
        this.notesField.setExtent(new Point(
            this.body.width() - this.listField.width() - thin,
            100
        ));
        // this.notesField.contents.children[0].adjustWidths();

        this.palette.setExtent(new Point(
            this.body.width() - this.listField.width() - thin,
            this.body.height() - this.notesField.height() - thin
        ));
        this.listField.contents.children[0].adjustWidths();

        this.listField.setPosition(this.body.position());
        this.palette.setPosition(this.listField.topRight().add(
            new Point(thin, 0)
        ));
        this.notesField.setPosition(
            this.palette.bottomLeft().add(new Point(0, thin))
          );
    }

    if (this.label) {
        this.label.setCenter(this.center());
        this.label.setTop(
            this.top() + (titleHeight - this.label.height()) / 2
        );
    }

    if (this.buttons) {
        this.buttons.fixLayout();
        this.buttons.setCenter(this.center());
        this.buttons.setBottom(this.bottom() - this.padding);
    }

    // refresh shadow
    this.removeShadow();
    this.addShadow();
};

// Needs to be grayed out when no emoji selected,
EmojiImportDialogMorph.prototype.importEmoji = function () {
    console.log(this.selectedIcon);
    if (this.selectedIcon) {
        ide.droppedImage(
            this.selectedIcon.object.contents,
            this.selectedIcon.labelString
        );
    }
};

EmojiImportDialogMorph.prototype.displayAlternatives = function (items, description) {
    this.initializeAlternatives();
    if (!items || !items.length) {
        this.notesField.contents.adjustBounds();
        this.fixLayout();
        return;
    }

    var scope = this;
    console.log(scope.selectedIcon);

    var turtle = new SymbolMorph('turtle', 60);
    items.forEach(item => {
        // Caution: creating very many thumbnails can take a long time!
        //var url = "https://twemoji.maxcdn.com/v/13.1.0/72x72/" + item.fileName,
        var url = ide.resourceURL('Emojis', item),
            img = new Image(),
            icon = new CostumeIconMorph(
                new Costume(turtle.image, description)
            );
        console.log(url);
        icon.isDraggable = false;
        icon.userMenu = nop;
        icon.action = function () {
            if (scope.selectedIcon === icon) {return; }
            var prevSelected = scope.selectedIcon;
            scope.selectedIcon = icon;
            console.log(scope.selectedIcon);
            if (prevSelected) {prevSelected.refresh(); }
        };
        icon.doubleClickAction = function () {
            ide.droppedImage(
                scope.selectedIcon.object.contents,
                scope.selectedIcon.labelString
            );
        }
        icon.query = function () {
            return icon === scope.selectedIcon;
        };
        this.notesField.addContents(icon);
        img.onload = function () {
            var canvas = newCanvas(new Point(img.width, img.height), true);
            canvas.getContext('2d').drawImage(img, 0, 0);
            icon.object = new Costume(canvas, description);
            icon.refresh();
        };
        img.src = url;
    });

    var fp = this.notesField.position(),
        fw = 285,
        x = this.notesField.left(),
        y = this.notesField.top();
    // console.log(fw);
    this.notesField.contents.children.forEach(function (icon) {
        icon.setPosition(fp.add(new Point(x, y)));
        x += icon.width();
        if (x + icon.width() > fw) {
            x = 0;
            y += icon.height();
        }
    });
    this.notesField.contents.adjustBounds();
    this.fixLayout();
}

EmojiImportDialogMorph.prototype.displayEmojis = function (items) {
    if (!items.length) {return; }
    this.initializePalette();

    var scope = this;
    scope.selectedIcon = null;
    console.log(scope.selectedIcon);

    var turtle = new SymbolMorph('turtle', 60);
    items.forEach(item => {
        // Caution: creating very many thumbnails can take a long time!
        //var url = "https://twemoji.maxcdn.com/v/13.1.0/72x72/" + item.fileName,
        var url = ide.resourceURL('Emojis', item.fileName),
            img = new Image(),
            icon = new CostumeIconMorph(
                new Costume(turtle.image, item.description)
            );
        icon.isDraggable = false;
        icon.userMenu = nop;
        icon.action = function () {
            if (scope.selectedIcon === icon) {return; }
            var prevSelected = scope.selectedIcon;
            scope.selectedIcon = icon;
            if (prevSelected) {prevSelected.refresh(); }
            scope.displayAlternatives(item.alternatives, item.description);
        };
        icon.doubleClickAction = function () {
            ide.droppedImage(
                scope.selectedIcon.object.contents,
                scope.selectedIcon.labelString
            );
        }
        icon.query = function () {
            return icon === scope.selectedIcon;
        };
        this.palette.addContents(icon);
        img.onload = function () {
            var canvas = newCanvas(new Point(img.width, img.height), true);
            canvas.getContext('2d').drawImage(img, 0, 0);
            icon.object = new Costume(canvas, item.description);
            icon.refresh();
        };
        img.src = url;
    });

    var fp = this.palette.position(),
        fw = 285,
        x = this.palette.left(),
        y = this.palette.top();
    // console.log(fw);
    this.palette.contents.children.forEach(function (icon) {
        icon.setPosition(fp.add(new Point(x, y)));
        x += icon.width();
        if (x + icon.width() > fw) {
            x = 0;
            y += icon.height();
        }
    });
    this.palette.contents.adjustBounds();
    this.fixLayout();
}

EmojiImportDialogMorph.prototype.showMessage = function (msgText) {
    var msg = new MenuMorph(null, msgText);
    this.initializePalette();
    this.fixLayout();
    msg.popUpCenteredInWorld(this.palette.contents);
};