class Infection extends Molecules {
    constructor(_index, _position, _velocity){
        super(molecules);
        this.position = createVector(_position.x, _position.y);
        this.velocity = createVector(_velocity.x, _velocity.y);
        this.attribute = "infected";
        this.index = _index;
        this.fillColor = color(255, 0, 100);
        this.currentColor = this.fillColor;
    }
}