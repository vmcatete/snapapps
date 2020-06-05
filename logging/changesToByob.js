BlockExportDialogMorph.prototype.popUp = function (wrrld) {
    var world = wrrld || this.target.world();

    //deselect all blocks
    this.selectNone();

    if (world) {
        BlockExportDialogMorph.uber.popUp.call(this, world);
        this.handle = new HandleMorph(
            this,
            200,
            220,
            this.corner,
            this.corner
        );
    }
};