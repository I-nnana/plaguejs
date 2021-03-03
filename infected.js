class Infected extends Molecules {
    constructor(_i){
        super(molecules)
        this.attribute = "infected";
        this.index = _i;
        this.fillColor = color(255, 0, 100);
        this.currentColor = this.fillColor;
    }
}