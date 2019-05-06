class CanvasCtx {
    constructor(w, h, id) {
        this.width = w
        this.height = h
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
    makeGrid() {
        let w = this.w

        for (let i = 0; i < w; i += 10) {
            for (let j = 0; j < w; j += 10)
                this.ctx.strokeRect(i, j, gameCanvas.width, gameCanvas.height);

        }

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