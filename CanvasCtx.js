class CanvasCtx {
    constructor(w, h, id) {
        this.width = w;
        this.height = h;
        this.ctx = this.createContext(w, h, id);
    }

    createContext(width, height, id) {
        if (document.getElementById(id)) { return document.getElementById(id).getContext("2d"); }
        let canvasWrapper = document.createElement('div');
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.id = id
        canvasWrapper.appendChild(canvas)

        document.getElementById("ROOTDIV").appendChild(canvasWrapper)
        return canvas.getContext("2d");
    }
 
    clearCanvas() {
        //  Select the colour to fill the drawing
        this.ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
        //  Select the colour for the border of the canvas
        this.ctx.strokestyle = CANVAS_BORDER_COLOUR;
        // Draw a "filled" rectangle to cover the entire canvas
        this.ctx.fillRect(0, 0, this.width, this.height);
        // Draw a "border" around the entire canvas
        this.ctx.strokeRect(0, 0, this.width, this.height);
    }
}