class CanvasCtx {
    constructor(w, h, id) {
        this.ctx = this.createContext(w, h, id)

    }

    createContext(width, height, id) {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.id = id
        document.getElementById("ROOTDIV").appendChild(canvas)
        return canvas.getContext("2d");
    }

    clearCanvas() {
        //  Select the colour to fill the drawing
        this.ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
        //  Select the colour for the border of the canvas
        this.ctx.strokestyle = CANVAS_BORDER_COLOUR;
        // Draw a "filled" rectangle to cover the entire canvas
        this.ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        // Draw a "border" around the entire canvas
        this.ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
    }
}