modules.scribbleObjects = '2013-August-2';

/*********************************************************************/
/******************************* HOOKS *******************************/
/*********because sometimes you HAVE to mod the original file*********/
/*********************************************************************/

/*
 * Hooks into SpriteMorph.blockTemplates
 * 
 * Adds the blocks to the UI
 */
SpriteMorph.prototype.snapappsHookBlockTemplates = function(blocks, block, cat, helpMenu)
{
    if (cat === 'motion')
    {
        blocks.splice(16, 0, '-', block('gotoRandomLocation'));
    }
    if (cat === 'operators')
    {
        blocks.push(block('reportExpression'));
    }
    if (cat === 'variables')
    {
        blocks.splice(blocks.length - 2, 0, block('reportCopyList'), block('reportListText'));
    }
    if (cat === 'shapes') { 
        blocks.push(block('startShape'));
        blocks.push(block('endShape'));
        blocks.push('-');
        blocks.push(block('setShapeColor'));
        blocks.push(block('setFillNumber'));
        blocks.push('-');
        blocks.push(block('changeShapeHue'));
        blocks.push(block('setShapeHue'));
        blocks.push('-');
        blocks.push(block('changeShapeBrightness'));
        blocks.push(block('setShapeBrightness'));
        blocks.push('-');
        blocks.push(block('changeShapeAlpha'));
        blocks.push(block('setShapeAlpha'));
        blocks.push('-');
        blocks.push(block('getShapeHue'));
        blocks.push(block('getShapeBrightness'));
        blocks.push(block('getShapeAlpha'));
        blocks.push(block('getFillNumber'));
        blocks.push('-');
        blocks.push(block('drawCircle'));
        blocks.push(block('drawOval'));
        blocks.push(block('drawRectangle'));
    }
    if (cat === 'text') { 
        blocks.push(block('setFont'));
        blocks.push(block('setFontSize'));
        blocks.push(block('drawText'));
        blocks.push('-');
        blocks.push(block('setTextColor'));
        blocks.push(block('setTextFillNumber'));
        blocks.push('-');
        blocks.push(block('changeTextHue'));
        blocks.push(block('setTextHue'));
        blocks.push('-');
        blocks.push(block('changeTextBrightness'));
        blocks.push(block('setTextBrightness'));
        blocks.push('-');
        blocks.push(block('changeTextAlpha'));
        blocks.push(block('setTextAlpha'));
        blocks.push('-');
        blocks.push(block('getTextHue'));
        blocks.push(block('getTextBrightness'));
        blocks.push(block('getTextAlpha'));
        blocks.push(block('getTextFillNumber'));
    }
    if (cat === 'pen') { 
        blocks.push('-');
        blocks.push(block('getPenAlpha'));
        blocks.push(block('changePenAlpha'));
        blocks.push(block('setPenAlpha'));
        blocks.push('-');
        blocks.push(block('getPenNumber'));
        blocks.push(block('setPenNumber'));
        blocks.push('-');
        blocks.push(block('reportPenDown'));
    }
}

/*********************************************************************/
/***************************** OVERRIDES *****************************/
/*********************************************************************/

/*
 * Add the shape category
 */
SpriteMorph.prototype.blockColor.shapes = new Color(215, 45, 45);
SpriteMorph.prototype.categories.push("shapes");
SpriteMorph.prototype.blockColor.text = new Color(223, 0, 124);
SpriteMorph.prototype.categories.push("text");

/*
 * Override for the default implementation of SpriteMorph.initBlocks
 * 
 * We must add scribble's blocks to the menus!
 */
var override_spriteMorph_prototype_initBlocks = SpriteMorph.prototype.initBlocks;

SpriteMorph.prototype.initBlocks = function () {
    override_spriteMorph_prototype_initBlocks.call(this);
    this.addScribbleBlocks();
}

SpriteMorph.prototype.addScribbleBlocks = function () {
    SpriteMorph.prototype.blocks.startShape = {
        type: 'command',
        category: 'shapes',
        spec: 'start shape'
    };
    
    SpriteMorph.prototype.blocks.endShape = {
        type: 'command',
        category: 'shapes',
        spec: 'end shape'
    };
    
    SpriteMorph.prototype.blocks.setShapeColor = {
        type: 'command',
        category: 'shapes',
        spec: 'set fill color to %clr',
    };

    SpriteMorph.prototype.blocks.changeShapeHue = {
        type: 'command',
        category: 'shapes',
        spec: 'change fill hue by %n',
        defaults: [10]
    };
    
    SpriteMorph.prototype.blocks.setShapeHue = {
        type: 'command',
        category: 'shapes',
        spec: 'set fill hue to %n',
        defaults: [0]
    };
    
    SpriteMorph.prototype.blocks.getShapeHue = {
        type: 'reporter',
        category: 'shapes',
        spec: 'get fill hue'
    };
    
    SpriteMorph.prototype.blocks.changeShapeBrightness = {
        type: 'command',
        category: 'shapes',
        spec: 'change fill shade by %n',
        defaults: [10]
    };
    
    SpriteMorph.prototype.blocks.getShapeBrightness = {
        type: 'reporter',
        category: 'shapes',
        spec: 'get fill shade'
    };
    
    SpriteMorph.prototype.blocks.setShapeBrightness = {
        type: 'command',
        category: 'shapes',
        spec: 'set fill shade to %n',
        defaults: [100]
    };
    
    SpriteMorph.prototype.blocks.changeShapeAlpha = {
        type: 'command',
        category: 'shapes',
        spec: 'change fill alpha by %n',
        defaults: [10]
    };
    
    SpriteMorph.prototype.blocks.getShapeAlpha = {
        type: 'reporter',
        category: 'shapes',
        spec: 'get fill alpha'
    };
    
    SpriteMorph.prototype.blocks.setShapeAlpha = {
        type: 'command',
        category: 'shapes',
        spec: 'set fill alpha to %n',
        defaults: [100]
    };
    
    SpriteMorph.prototype.blocks.drawCircle = {
        type: 'command',
        category: 'shapes',
        spec: 'draw circle radius %n',
        defaults: [50]
    };
    
    SpriteMorph.prototype.blocks.drawOval = {
        type: 'command',
        category: 'shapes',
        spec: 'draw oval radius %n by %n',
        defaults: [25, 50]
    };
    
    SpriteMorph.prototype.blocks.drawRectangle = {
        type: 'command',
        category: 'shapes',
        spec: 'draw rectangle %n by %n',
        defaults: [50, 50]
    };
    
    /* The lambda expression*/
    SpriteMorph.prototype.blocks.reportExpression = {
        type: 'reporter',
        category: 'operators',
        spec: '\u03BB %s'
    };
    
    SpriteMorph.prototype.blocks.gotoRandomLocation = {
        type: 'command',
        category: 'motion',
        spec: 'go to random location'
    };
    
    SpriteMorph.prototype.blocks.changePenAlpha = {
        type: 'command',
        category: 'pen',
        spec: 'change pen alpha by %n',
        defaults: [10]
    };
    
    SpriteMorph.prototype.blocks.getPenAlpha = {
        type: 'reporter',
        category: 'pen',
        spec: 'get pen alpha'
    };
    
    SpriteMorph.prototype.blocks.setPenAlpha = {
        type: 'command',
        category: 'pen',
        spec: 'set pen alpha to %n',
        defaults: [100]
    };
    
    SpriteMorph.prototype.blocks.reportPenDown = {
        type: 'predicate',
        category: 'pen',
        spec: 'pen down?'
    };
    
    SpriteMorph.prototype.blocks.getPenNumber = {
        type: 'reporter',
        category: 'pen',
        spec: 'get pen number'
    };
    
    SpriteMorph.prototype.blocks.setPenNumber = {
        type: 'command',
        category: 'pen',
        spec: 'set pen number %n'
    };
    
    SpriteMorph.prototype.blocks.getFillNumber = {
        type: 'reporter',
        category: 'shapes',
        spec: 'get fill color number'
    };
    
    SpriteMorph.prototype.blocks.setFillNumber = {
        type: 'command',
        category: 'shapes',
        spec: 'set fill color number %n'
    };
    
    SpriteMorph.prototype.blocks.reportCopyList = {
        type: 'reporter',
        category: 'lists',
        spec: 'copy of %l'
    };
    
    SpriteMorph.prototype.blocks.reportListText = {
        type: 'reporter',
        category: 'lists',
        spec: 'get text from %l seperated by %s'
    };
    
    /*
    ** Text Blocks
    */
    
    SpriteMorph.prototype.blocks.drawText = {
        type: 'command',
        category: 'text',
        spec: 'draw text %s'
    };
    
    SpriteMorph.prototype.blocks.setFont = {
        type: 'command',
        category: 'text',
        spec: 'set font to %font'
    };
    
    SpriteMorph.prototype.blocks.setFontSize = {
        type: 'command',
        category: 'text',
        spec: 'set font size to %n'
    };
    
    SpriteMorph.prototype.blocks.getTextFillNumber = {
        type: 'reporter',
        category: 'text',
        spec: 'get text color number'
    };
    
    SpriteMorph.prototype.blocks.setTextFillNumber = {
        type: 'command',
        category: 'text',
        spec: 'set text color number %n'
    };
    
    SpriteMorph.prototype.blocks.setTextColor = {
        type: 'command',
        category: 'text',
        spec: 'set text color to %clr',
    };

    SpriteMorph.prototype.blocks.changeTextHue = {
        type: 'command',
        category: 'text',
        spec: 'change text hue by %n',
        defaults: [10]
    };
    
    SpriteMorph.prototype.blocks.setTextHue = {
        type: 'command',
        category: 'text',
        spec: 'set text hue to %n',
        defaults: [0]
    };
    
    SpriteMorph.prototype.blocks.getTextHue = {
        type: 'reporter',
        category: 'text',
        spec: 'get text hue'
    };
    
    SpriteMorph.prototype.blocks.changeTextBrightness = {
        type: 'command',
        category: 'text',
        spec: 'change text shade by %n',
        defaults: [10]
    };
    
    SpriteMorph.prototype.blocks.getTextBrightness = {
        type: 'reporter',
        category: 'text',
        spec: 'get text shade'
    };
    
    SpriteMorph.prototype.blocks.setTextBrightness = {
        type: 'command',
        category: 'text',
        spec: 'set text shade to %n',
        defaults: [100]
    };
    
    SpriteMorph.prototype.blocks.changeTextAlpha = {
        type: 'command',
        category: 'text',
        spec: 'change text alpha by %n',
        defaults: [10]
    };
    
    SpriteMorph.prototype.blocks.getTextAlpha = {
        type: 'reporter',
        category: 'text',
        spec: 'get text alpha'
    };
    
    SpriteMorph.prototype.blocks.setTextAlpha = {
        type: 'command',
        category: 'text',
        spec: 'set text alpha to %n',
        defaults: [100]
    };
}

/*
 * Override for the default implementation of SpriteMorph.drawLine
 * 
 * Simply updates the current shape that the spritemorph holds when ever
 * the pen should be updated.
 */
var override_spriteMorph_prototype_drawLine = SpriteMorph.prototype.drawLine;

SpriteMorph.prototype.drawLine = function (start, dest) {
    override_spriteMorph_prototype_drawLine.call(this, start, dest);
    
    if (this.currentShape != null)
    {
        this.currentShape.addPoint(dest.x, dest.y);
    }
}

/*
 * Override for the default implementation of SpriteMorph.init
 * 
 * Called when a spritemorph is initialised.
 */
var override_spriteMorph_prototype_init = SpriteMorph.prototype.init
SpriteMorph.prototype.init = function(globals)
{
    override_spriteMorph_prototype_init.call(this, globals);
    
    //Black initially
    this.fillColor = new Color(0,0,0);
    this.textColor = new Color(0,0,0);
}

/*********************************************************************/
/****************************** OBJECTS ******************************/
/*********************************************************************/

/*
 * ScribbleShape
 * 
 * Simple container for a set of points. May grow in future, but for now,
 * it's just an array
 */
var ScribbleShape = function()
{
    this.points = [];
};

ScribbleShape.prototype.addPoint = function (x, y)
{
    this.points.push(new Point(x,y));
}

/*********************************************************************/
/**************************** BLOCK LOGIC ****************************/
/*********************************************************************/

/*
 * SpriteMorph.startShape
 * 
 * Implements block logic that clears the current shape and makes 
 * a new one
 */
SpriteMorph.prototype.startShape = function () {
    var stage = this.parent,
        context = stage.penTrails().getContext('2d');

    this.currentShape = new ScribbleShape();
    
    //Place the initial point
    var rotCentre = this.rotationCenter();
    this.currentShape.addPoint(rotCentre.x, rotCentre.y);

    this.changed();
};

var SCRIBBLE_LAMBDA_FUNCTIONS_NAME = "SCRIBBLE_LAMBDA_FUNCTIONS";
var SCRIBBLE_LAMBDA_GETVAR_NAME = "SCRIBBLE_LAMBDA_GETVAR";
var SCRIBBLE_LAMBDA_GETLIST_NAME = "SCRIBBLE_LAMBDA_GETLIST";
var SCRIBBLE_LAMBDA_PREFIX_ARGS = "spritemorph,";
var SCRIBBLE_LAMBDA_PREFIX_ARGS_COUNT = 1;

function scribble_lambda_random(spriteMorph, n)
{
    if (typeof n === "undefined")
        return Math.random();
    return Math.random() * n;
}
function scribble_lambda_lengthOf(spriteMorph, s)
{
    var type = typeof s;
    if (type !== "string")
        throw { name: "Type Mismatch", message: "You can only use strings with lengthOf!" };
    return s.length;
}

function makeNumber(n) {
    var result = parseFloat(n);
    if (!isNaN(result) && isFinite(n) && /^[\d.]+$/.test(n))
    {
        return result;
    }
    else
    {
        return n;
    }
}

function SCRIBBLE_LAMBDA_GETLIST(spriteMorph, v, i)
{
    var bob = spriteMorph.callingProcess.context.variables.getVar(v);
    if (bob == undefined || bob == null)
        throw { name: "Not a variable", message: "Tried accessing \"" + v + "\" which is not a variable"};
    if (!( bob instanceof List ))
        throw { name: "Not a list", message: "Tried accessing \"" + v + "\" which is not a list"};
    if (i <= 0 || i > bob.length())
        throw { name: "Out of bounds", message: "Tried accessing index " + i + " of \"" + v + "\" which has " + bob.length + " elements" };
    return makeNumber(bob.at(i));
}

function SCRIBBLE_LAMBDA_GETVAR(spriteMorph, v)
{
    var bob = spriteMorph.callingProcess.context.variables.getVar(v);
    if (bob == undefined || bob == null)
        throw { name: "Not a variable", message: "Tried accessing \"" + v + "\" which is not a variable"};
    if (bob instanceof List)
        throw { name: "Variable is a list", message: "Tried accessing \"" + v + "\" which is a list. You need to use array notation to access an element: aList[1], aList[2]..."};
    return makeNumber(bob);
}

var SCRIBBLE_LAMBDA_FUNCTIONS = {
    lengthOf: scribble_lambda_lengthOf,
    random: scribble_lambda_random,
}

/*
 * SpriteMorph.lambdas
 * 
 * Caches compiled functions for speed
 */
SpriteMorph.prototype.lambdas = { }

/*
 * SpriteMorph.reportExpression
 * 
 * Implements lambdas
 */
SpriteMorph.prototype.reportExpression = function (str) {
    var found = this.lambdas[str];
    if (typeof found === "undefined" || found === null)
    {
        var parser = new lambda.Parser();
        var evalMe = parser.parse(str);
        this.lambdas[str] = found = eval("(function(spritemorph){return ("+evalMe+");})");
    }
    return found(this);
};

/*
 * SpriteMorph.gotoRandomLocation
 * 
 * Implements block logic that goes to a random position
 */
SpriteMorph.prototype.gotoRandomLocation = function (num) {
    var stage = this.parentThatIsA(StageMorph);
    this.gotoXY(
    stage.image.width / stage.scale * (Math.random() - 0.5),
    stage.image.height / stage.scale * (Math.random() - 0.5));
};

/*
 * SpriteMorph.setShapeHue
 * 
 * Implements block logic that sets the hue of the shape
 */
SpriteMorph.prototype.setShapeHue = function (num) {
    var hsv = this.fillColor.hsv();

    hsv[0] = Math.max(Math.min(+num || 0, 100), 0) / 100;
    hsv[1] = 1;    
    this.fillColor.set_hsv.apply(this.fillColor, hsv);
};

/*
 * SpriteMorph.getShapeHue
 * 
 * Implements block logic that gets the hue of the shape
 */
SpriteMorph.prototype.getShapeHue = function () {
    return this.fillColor.hsv()[0] * 100;
};

/*
 * SpriteMorph.getShapeHue
 * 
 * Implements block logic that changes the hue of the shape
 * relative to its previous value
 */
SpriteMorph.prototype.changeShapeHue = function (delta) {
    this.setShapeHue(this.getShapeHue() + (+delta || 0));
};

/*
 * SpriteMorph.setShapeBrightness
 * 
 * Implements block logic that sets the brightness of the shape
 */
SpriteMorph.prototype.setShapeBrightness = function (num) {
    var hsv = this.fillColor.hsv();

    hsv[1] = Math.max(Math.min(+num || 0, 100), 0) / 100;
    hsv[2] = 1;
    this.fillColor.set_hsv.apply(this.fillColor, hsv);
};

/*
 * SpriteMorph.getShapeBrightness
 * 
 * Implements block logic that gets the brightness of the shape
 */
SpriteMorph.prototype.getShapeBrightness = function () {
    return this.fillColor.hsv()[1] * 100;
};
    
/*
 * SpriteMorph.changeShapeBrightness
 * 
 * Implements block logic that changes the brightness of the shape
 * relative to its previous value
 */
SpriteMorph.prototype.changeShapeBrightness = function (delta) {
    this.setShapeBrightness(this.getShapeBrightness() + (+delta || 0));
};

/*
 * SpriteMorph.setShapeAlpha
 * 
 * Implements block logic that sets the alpha(alpha) of the shape
 */
SpriteMorph.prototype.setShapeAlpha = function (num) {
    this.fillColor.a = Math.max(0,Math.min(num, 100)) / 100;
};

/*
 * SpriteMorph.getShapeAlpha
 * 
 * Implements block logic that gets the alpha(alpha) of the shape
 */
SpriteMorph.prototype.getShapeAlpha = function () {
    return this.fillColor.a * 100;
};
      
/*
 * SpriteMorph.getShapeBrightness
 * 
 * Implements block logic that changes the alpha(alpha) of the shape
 * relative to its previous value
 */
SpriteMorph.prototype.changeShapeAlpha = function (delta) {
    this.setShapeAlpha(this.getShapeAlpha() + (+delta || 0));
};

/*
 * SpriteMorph.setShapeColor
 * 
 * Implements block logic that sets the color of the shape
 */
SpriteMorph.prototype.setShapeColor = function (col) {
    this.fillColor = col;
};
   
/*
 * SpriteMorph.startShape
 * 
 * Implements block logic that clears the current shape and makes 
 * a new one
 */
SpriteMorph.prototype.startShape = function () {
    var stage = this.parent,
        context = stage.penTrails().getContext('2d');

    this.currentShape = new ScribbleShape();
    
    //Place the initial point
    var rotCentre = this.rotationCenter();
    this.currentShape.addPoint(rotCentre.x, rotCentre.y);

    this.changed();
};

/*
 * SpriteMorph.endShape
 * 
 * Implements block logic that closes the current shape and draws
 * it to the canvas
 */
SpriteMorph.prototype.endShape = function () {
    var stage = this.parent,
        context = stage.penTrails().getContext('2d')
        currentShape = this.currentShape
        fillColor = this.fillColor;
    
    if (currentShape == null || currentShape.points.length == 0)
        return;
       
    //This code draws the path to the canvas
    var minX = currentShape.points[0].x, 
    maxX = minX, 
    minY = currentShape.points[0].y, 
    maxY = minY;
    
    //Save current transform
    context.save();
    
    //Update transform
    //The pen draws to a bitmap that does not change size,
    //so we must scale the real coordinates down to it.
    context.scale(1 / stage.scale, 1 / stage.scale);
    context.translate(-stage.left(), -stage.top());
    
    context.beginPath();
    for (var i=0; i<currentShape.points.length; i++) {
        var x = currentShape.points[i].x,
            y = currentShape.points[i].y;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;        
        if (y > maxY) maxY = y;
        context.lineTo(x, y);
    }
    var stringy = "rgba("+Math.round(fillColor.r)+","+Math.round(fillColor.g)+","+Math.round(fillColor.b)+","+fillColor.a+")";

    context.fillStyle = stringy;
    context.closePath();
    context.fill();
    
    //Restore transform
    context.restore();
    
    //Dirty area
    this.world().broken.push(
        new Rectangle(minX, minY, maxX, maxY)
            .intersect(this.parent.visibleBounds())
                    .spread() /* Snaps to integral coordinates */);

    this.changed();
};

/*
 * SpriteMorph.getPenAlpha
 * 
 * Implements block logic that gets the alpha of the pen
 */
SpriteMorph.prototype.getPenAlpha = function () {
    return this.color.a * 100;
};

/*
 * SpriteMorph.getPenAlpha
 * 
 * Implements block logic that adds to the alpha of the pen
 */
SpriteMorph.prototype.changePenAlpha = function (delta) {
    this.setPenAlpha(this.getPenAlpha() + (+delta || 0));
};
    
/*
 * SpriteMorph.getPenAlpha
 * 
 * Implements block logic that sets the alpha of the pen
 */
SpriteMorph.prototype.setPenAlpha = function (num) {
    var x = this.xPosition(),
        y = this.yPosition();
        
    this.color.a = Math.max(0,Math.min(num, 100)) / 100;
    if (!this.costume) {
        this.drawNew();
        this.changed();
    }
    this.gotoXY(x, y);
};
    
/*
 * SpriteMorph.getPenAlpha
 * 
 * Implements block logic that tells if the pen is down
 */
SpriteMorph.prototype.reportPenDown = function () {
    return this.isDown;
};

/*
 * SpriteMorph.drawCircle
 * 
 * Implements block logic that draws a circle centered at the current position
 */
SpriteMorph.prototype.drawCircle = function (radius)
{
    var stage = this.parent,
        context = stage.penTrails().getContext('2d'),
        fillColor = this.fillColor,
        x = this.rotationCenter().x,
        y = this.rotationCenter().y;
    
    //Save current transform
    context.save();
    
    //Update transform
    //The pen draws to a bitmap that does not change size,
    //so we must scale the real coordinates down to it.
    context.scale(1 / stage.scale, 1 / stage.scale);
    context.translate(-stage.left(), -stage.top());
    
    var stringy = "rgba("+Math.round(fillColor.r)+","+Math.round(fillColor.g)+","+Math.round(fillColor.b)+","+fillColor.a+")";
    context.fillStyle = stringy;
    context.beginPath();
    context.arc(x, y, radius * stage.scale, 0, 2 * Math.PI, false);
    context.fill();
    
    //Restore transform
    context.restore();
    
    var minX = x - radius * stage.scale,
        maxX = x + radius * stage.scale,
        minY = y - radius * stage.scale,
        maxY = y + radius * stage.scale;
    
    //Dirty area
    this.world().broken.push(
        new Rectangle(minX, minY, maxX, maxY)
            .intersect(this.parent.visibleBounds())
                    .spread() /* Snaps to integral coordinates */);

    this.changed();
}

/*
 * SpriteMorph.drawOval
 * 
 * Implements block logic that draws an oval centered at the current position
 */
SpriteMorph.prototype.drawOval = function (radiusX, radiusY)
{
    //Many thanks to http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas
    function pathEllipse(ctx, x, y, w, h) {
        var kappa = .5522848,
            ox = (w / 2) * kappa, // control point offset horizontal
            oy = (h / 2) * kappa, // control point offset vertical
            xe = x + w,           // x-end
            ye = y + h,           // y-end
            xm = x + w / 2,       // x-middle
            ym = y + h / 2;       // y-middle

        ctx.beginPath();
        ctx.moveTo(x, ym);
        ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        ctx.closePath();
    }

    var stage = this.parent,
        context = stage.penTrails().getContext('2d'),
        fillColor = this.fillColor,
        x = this.rotationCenter().x,
        y = this.rotationCenter().y;
    
    //Save current transform
    context.save();
    
    //Update transform
    //The pen draws to a bitmap that does not change size,
    //so we must scale the real coordinates down to it.
    context.scale(1 / stage.scale, 1 / stage.scale);
    context.translate(-stage.left(), -stage.top());
    var rxS = radiusX * stage.scale, ryS = radiusY * stage.scale;
    
    var stringy = "rgba("+Math.round(fillColor.r)+","+Math.round(fillColor.g)+","+Math.round(fillColor.b)+","+fillColor.a+")";
    context.fillStyle = stringy;
    pathEllipse(context, x - rxS, y - ryS, 2 * rxS, 2 * ryS);
    context.fill();
    
    //Restore transform
    context.restore();
    
    var minX = x - rxS,
        maxX = x + rxS,
        minY = y - ryS,
        maxY = y + ryS;
    
    //Dirty area
    this.world().broken.push(
        new Rectangle(minX, minY, maxX, maxY)
            .intersect(this.parent.visibleBounds())
                    .spread() /* Snaps to integral coordinates */);

    this.changed();
}

/*
 * SpriteMorph.drawRectangle
 * 
 * Implements block logic that draws a rectangle centered at the current position
 */
SpriteMorph.prototype.drawRectangle = function (w, h)
{
    var stage = this.parent,
        context = stage.penTrails().getContext('2d'),
        fillColor = this.fillColor,
        x = this.rotationCenter().x,
        y = this.rotationCenter().y;
    
    //Save current transform
    context.save();
    
    //Update transform
    //The pen draws to a bitmap that does not change size,
    //so we must scale the real coordinates down to it.
    context.scale(1 / stage.scale, 1 / stage.scale);
    context.translate(-stage.left(), -stage.top());
    var wS = w * stage.scale, hS = h * stage.scale;
    
    var stringy = "rgba("+Math.round(fillColor.r)+","+Math.round(fillColor.g)+","+Math.round(fillColor.b)+","+fillColor.a+")";
    context.fillStyle = stringy;
    context.beginPath();
    context.rect(x - wS, y - hS, 2 * wS, 2 * hS);
    context.fill();
    
    //Restore transform
    context.restore();
    
    var minX = x - wS,
        maxX = x + wS,
        minY = y - hS,
        maxY = y + hS;
    
    //Dirty area
    this.world().broken.push(
        new Rectangle(minX, minY, maxX, maxY)
            .intersect(this.parent.visibleBounds())
                    .spread() /* Snaps to integral coordinates */);

    this.changed();
}

function getNumberFromColor(col)
{
    //RRR_GGG_BBB.AAA in DECIMAL so it is easier for newbz!!1!!1111
    var rv = 
     + (Math.round(col.r / 255 * 999) *    100000000.000)
    /*///////////////////////////////////RRR GGG BBB.AAA*/
     + (Math.round(col.g / 255 * 999) *        10000.000)
    /*///////////////////////////////////RRR GGG BBB.AAA*/
     + (Math.round(col.b / 255 * 999) *            1.000)
    /*///////////////////////////////////RRR GGG BBB.AAA*/
     + (Math.round(col.a       * 999) *            0.001);
    /*///////////////////////////////////RRR GGG BBB.AAA*/
    return rv;
}

function getColorFromNumber(num)
{
    function firstThreeDecimalDigits(bob)
    {
        bob = bob - Math.floor(bob); //Truncate everything above the decimal point
        bob = bob * 1000; //Move everything up 3 digits
        return Math.floor(bob); //Trucate everything below the decimal point
    }
    
    var color = new Color();
    color.a = firstThreeDecimalDigits(num) / 999.0;
    num /= 1000; //Move blue into the decimal part
    color.b = firstThreeDecimalDigits(num) / 999.0 * 255;
    num /= 10000; //Move green into the decimal part
    color.g = firstThreeDecimalDigits(num) / 999.0 * 255;
    num /= 10000; //Move red into the decimal part
    color.r = firstThreeDecimalDigits(num) / 999.0 * 255;
    return color;
}

/*
 * SpriteMorph.getPenNumber
 * 
 * Implements block logic that gets the number of the pen
 */
SpriteMorph.prototype.getPenNumber = function () {
    return getNumberFromColor(this.color);
};

/*
 * SpriteMorph.getPenNumber
 * 
 * Implements block logic that sets the number of the pen
 */
SpriteMorph.prototype.setPenNumber = function (num) {
    this.setColor(getColorFromNumber(num));
};

/*
 * SpriteMorph.getFillNumber
 * 
 * Implements block logic that gets the number of the fill
 */
SpriteMorph.prototype.getFillNumber = function () {
    return getNumberFromColor(this.fillColor);
};

/*
 * SpriteMorph.getFillNumber
 * 
 * Implements block logic that sets the number of the fill
 */
SpriteMorph.prototype.getFillNumber = function (num) {
    this.setShapeColor(getColorFromNumber(num));
};

/*
 * SpriteMorph.reportCopyList
 * 
 * Implements block logic that returns an exact (unlinked) copy of the list supplied
 */
SpriteMorph.prototype.reportCopyList = function (listToCopy)
{
    if (!(listToCopy instanceof List))
        throw new TypeError("You must give a list to copy, not something else!");
    var retn = new List();
    var next = listToCopy;
    while (next != null) {
        if (next.isLinked) {
            if (next.first !== undefined)
                retn.contents.push(next.first);
            if (next.rest !== undefined && next.rest instanceof List)
                next = next.rest;
            else
                next = null;
        }
        else
        {
            retn.contents.push.apply(retn.contents, next.contents);
            break;
        }
    }
    retn.isLinked = false;
    return retn;
}

/*
 * SpriteMorph.reportListText
 * 
 * Implements block logic that returns a list with text splitting up the items in between.
 */
SpriteMorph.prototype.reportListText = function (list, splitWith)
{
    if (!(list instanceof List))
        throw new TypeError("You must give a list to turn to text, not something else!");
    if (!(splitWith instanceof String))
        throw new TypeError("You must give a string to split the list with, not something else!");
    var l = list.length();
    var retn = "";
    for (var i=0; i<l; i++)
    {
        retn += list.at(i + 1).toString();
        if (i != l - 1)
            retn += splitWith;
    }
    return retn;
}

/*
 * SpriteMorph.reportListText
 * 
 * Implements block logic that returns a list with text splitting up the items in between.
 */
SpriteMorph.prototype.reportListText = function (list, splitWith)
{
    if (!(list instanceof List))
        throw new TypeError("You must give a list to turn to text, not something else!");
    var l = list.length();
    var retn = "";
    for (var i=0; i<l; i++)
    {
        retn += list.at(i + 1).toString();
        if (i != l - 1)
            retn += splitWith.toString();
    }
    return retn;
}

/*
 * SpriteMorph.setFont
 * 
 * Implements block logic that sets the current font
 */
SpriteMorph.prototype.currentFont = "Arial"
SpriteMorph.prototype.setFont = function (font)
{
    this.currentFont = font[0];
}

/*
 * SpriteMorph.setFont
 * 
 * Implements block logic that sets the current font size
 */
SpriteMorph.prototype.currentFontSize = 16;
SpriteMorph.prototype.setFontSize = function (fontSize)
{
    this.currentFontSize = Math.floor(parseFloat(fontSize));
}

/*
 * SpriteMorph.drawText
 * 
 * Implements block logic that draws some text at the current position
 */
SpriteMorph.prototype.drawText = function (text)
{
    var stage = this.parent,
        context = stage.penTrails().getContext('2d'),
        textColor = this.textColor,
        currentFontSize = this.currentFontSize,
        currentFont = this.currentFont,
        x = this.rotationCenter().x,
        y = this.rotationCenter().y;
    
    var ok = false;
    for (var prop in validFonts){
        if (validFonts[prop] == currentFont)
        {
            ok = true;
        }
    }
    if (!ok)
        return;
    
    //Save current transform
    context.save();
    
    //Update transform
    //The pen draws to a bitmap that does not change size,
    //so we must scale the real coordinates down to it.
    context.scale(1 / stage.scale, 1 / stage.scale);
    context.translate(-stage.left(), -stage.top());
    
    context.font = currentFontSize + "px \"" + currentFont + "\"";
    var stringy = "rgba("+Math.round(textColor.r)+","+Math.round(textColor.g)+","+Math.round(textColor.b)+","+textColor.a+")";
    context.fillStyle = stringy;
    context.fillText(text, x, y);
    var textWidth = context.measureText(text).width;
    
    //Restore transform
    context.restore();
    
    var minX = x,
        maxX = x + textWidth * stage.scale,
        minY = y - currentFontSize * stage.scale,
        maxY = y + currentFontSize * stage.scale;
    
    //Dirty area
    this.world().broken.push(
        new Rectangle(minX, minY, maxX, maxY)
            .intersect(this.parent.visibleBounds())
                    .spread() /* Snaps to integral coordinates */);

    this.changed();
}
/*
 * SpriteMorph.setTextHue
 * 
 * Implements block logic that sets the hue of the text
 */
SpriteMorph.prototype.setTextHue = function (num) {
    var hsv = this.textColor.hsv();

    hsv[0] = Math.max(Math.min(+num || 0, 100), 0) / 100;
    hsv[1] = 1;    
    this.textColor.set_hsv.apply(this.textColor, hsv);
};

/*
 * SpriteMorph.getTextHue
 * 
 * Implements block logic that gets the hue of the text
 */
SpriteMorph.prototype.getTextHue = function () {
    return this.textColor.hsv()[0] * 100;
};

/*
 * SpriteMorph.getTextHue
 * 
 * Implements block logic that changes the hue of the text
 * relative to its previous value
 */
SpriteMorph.prototype.changeTextHue = function (delta) {
    this.setTextHue(this.getTextHue() + (+delta || 0));
};

/*
 * SpriteMorph.setTextBrightness
 * 
 * Implements block logic that sets the brightness of the text
 */
SpriteMorph.prototype.setTextBrightness = function (num) {
    var hsv = this.textColor.hsv();

    hsv[1] = Math.max(Math.min(+num || 0, 100), 0) / 100;
    hsv[2] = 1;
    this.textColor.set_hsv.apply(this.textColor, hsv);
};

/*
 * SpriteMorph.getTextBrightness
 * 
 * Implements block logic that gets the brightness of the text
 */
SpriteMorph.prototype.getTextBrightness = function () {
    return this.textColor.hsv()[1] * 100;
};
    
/*
 * SpriteMorph.changeTextBrightness
 * 
 * Implements block logic that changes the brightness of the text
 * relative to its previous value
 */
SpriteMorph.prototype.changeTextBrightness = function (delta) {
    this.setTextBrightness(this.getTextBrightness() + (+delta || 0));
};

/*
 * SpriteMorph.setTextAlpha
 * 
 * Implements block logic that sets the alpha(alpha) of the text
 */
SpriteMorph.prototype.setTextAlpha = function (num) {
    this.textColor.a = Math.max(0,Math.min(num, 100)) / 100;
};

/*
 * SpriteMorph.getTextAlpha
 * 
 * Implements block logic that gets the alpha(alpha) of the text
 */
SpriteMorph.prototype.getTextAlpha = function () {
    return this.textColor.a * 100;
};
      
/*
 * SpriteMorph.changeTextAlpha
 * 
 * Implements block logic that changes the alpha(alpha) of the text
 * relative to its previous value
 */
SpriteMorph.prototype.changeTextAlpha = function (delta) {
    this.setTextAlpha(this.getTextAlpha() + (+delta || 0));
};

/*
 * SpriteMorph.setTextColor
 * 
 * Implements block logic that sets the color of the text
 */
SpriteMorph.prototype.setTextColor = function (col) {
    this.textColor = col;
};

/*
 * SpriteMorph.getTextFillNumber
 * 
 * Implements block logic that gets the number of the text fill
 */
SpriteMorph.prototype.getTextFillNumber = function () {
    return getNumberFromColor(this.textColor);
};

/*
 * SpriteMorph.getTextFillNumber
 * 
 * Implements block logic that sets the number of the text fill
 */
SpriteMorph.prototype.getTextFillNumber = function (num) {
    this.setTextColor(getColorFromNumber(num));
};

/*********************************************************************/
/****************************** STATICS ******************************/
/*********************************************************************/
//Snap calls this after initBlocks is defined. We call addScribbleBlocks to add the new blocks.
SpriteMorph.prototype.addScribbleBlocks();
