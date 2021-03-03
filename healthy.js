class Healthy extends Molecules {
    constructor(_i){
        super(molecules)
        this.attribute = "healthy";
        this.index = _i;
        this.fillColor = color(0, 255, 100);
        this.currentColor = this.fillColor;
    }
}