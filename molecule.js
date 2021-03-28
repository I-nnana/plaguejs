class Molecules {
    // the constructor determines the vectors position/velocity of each balls, their min/max radiuses, colour and indexes
    // that is passed by the draw() function
    constructor({
        _i, posX = 0, posY = 0, volX = random(-1, 1), volY = random(-1, 1), radius = random(obj.minMoleculeSize, obj.maxMoleculeSize)
        }){
            this.index = _i;
            this.position = createVector(posX, posY);
            this.velocity = createVector(volX, volY);
            this.radius = radius;
            this.intersectingColor = color(255, 255, 255);
    }

    // render() is the function that draws the molecules in the canvas, with no stroke, a certain coulour (see gui.js), molecules figure
    // and if showText is set to true, text prompting the molecules indexes with a black colour, with a centered alignment
    render() {
        noStroke()
        fill(this.currentColor);
        ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2);
        fill(0);
        (obj.showText) ? (
            textSize(10),
            textAlign(CENTER ),
            text(this.index, this.position.x, this.position.y + 6)) : null;
    }

    // isIntersecting() is the function that checks the molecules intersection. p5.js comes with the dist() function 
    // that calculates for us the distance bewteen two objects by passign their x & y positions.
    // If the gap (calculated by the distance - both radiuses) between the two objects is smaller than 0, this, the molecules 
    // are intersecting. isIntersecting() returns either true or false which in turn, will trigger or not changeColor()
    isIntersecting(_molecule) {
        let distance = dist(this.position.x, this.position.y, _molecule.position.x, _molecule.position.y)
        let gap = distance - this.radius - _molecule.radius;
        let check = (gap <= 0) ? true : false;

        if (check){
            this.repulse(_molecule);
            this.bounce(_molecule, distance);
        }
        return check;
    }

    // repulse insures that the molecules  aren't overlaping by calculating  the distance by which they may overlap based on 
    // the resultant vector between them malus the sum of their radius.
    repulse(_molecule){

        // we create a new vector which angle and magnitude (length) are equal to the vector between two molecules
        let resultant = p5.Vector.sub(this.position, _molecule.position);

        // we save the magnitude (length) of the vector resultant
        let vHeading = resultant.heading();

        // vDistance is equal to the distance between two vector, if the vector is inferior to 0, then our molecules are overlapping
        let vDistance = (resultant.mag() - this.radius - _molecule.radius) / 2;

        // we then get the distance necessary for the molecules to repulse each other so they do not overlap anymore, but instead touch themselves.
        // the placement in the x axis is got by using the cosine and by the sine in the y axis as we replace the molecules in a cartesian space
        let moveX = cos(vHeading) * vDistance;
        let moveY = sin(vHeading) * vDistance;

        this.position.x -= moveX;
        this.position.y -= moveY;

        _molecule.position.x += moveX;
        _molecule.position.y += moveY;
    }

    bounce(_molecule, _distance){
        // dx & dy derivate  are equal to the difference of our molecules x & y coordinates
        let dx = this.position.x - _molecule.position.x;
        let dy = this.position.y - _molecule.position.y;

        // normalX & normalY are equal to theirs respective derivates divided by the distance
        let normalX = dx / _distance;
        let normalY = dy / _distance;

        // dVector is the vector which determine how the molecules will move appropiately on  x & y axis
        let dVector = (this.velocity.x - _molecule.velocity.x) * normalX;
        dVector += (this.velocity.y - _molecule.velocity.y) * normalY;

        // the molecules velocity is then  determined by the product of dVector by normalX & normalY
        let dvx = dVector * normalX;
        let dvy = dVector * normalY;

        let constrainX = constrain(dvx, -1, 1);
        let constrainY = constrain(dvy, -1, 1);

        this.velocity.x -= constrainX;
        this.velocity.y -= constrainY;

        _molecule.velocity.x += constrainX;
        _molecule.velocity.y += constrainY;
    }

    infection(_molecule){ 
        let id;        
        (this.attribute === "healthy" &&  _molecule.attribute === "infected" || this.attribute === "infected" &&  _molecule.attribute === "healthy") ? 
            ((this.attribute === "healthy") ? id = this.index :  id = _molecule.index)
            : null;
        
        return id;
    }

    // changeColor() gives a new colour scheme to our molecules is they are intersecting
    changeColor() {
        this.currentColor = this.intersectingColor
    }

    // reset() is a function that sets back the original colour of the molecules once they are no more intersecting
    reset() {
        this.currentColor = this.fillColor
    }

    //  step() switches the direction a molecules is heading to if it hits the borders of the canvas.
    //  however, if a molecule's position exceeds the result of the canvas's width malus the radius (or is below radius malus 1),
    //  then the molecule is out the canvas the boundaries. If so, step() reposition the ball to be in the canvas before switching the velocity's direction.
    step() {
        let heightLimit = (height * (100  - obj.dashboardHeight) / 100);

        (this.position.x > width - this.radius) ? (this.position.x = width - this.radius) :
        (this.position.x < this.radius - 1) ? (this.position.x = this.radius) : 
        (this.position.y > heightLimit - this.radius) ? (this.position.y = heightLimit - this.radius) : 
        (this.position.y < this.radius - 1) ? (this.position.y = this.radius) : null ;

        (this.position.x >= width - this.radius || this.position.x <= 0 + this.radius) ? this.velocity.x *= -1: null;
        (this.position.y >= heightLimit - this.radius || this.position.y <= 0 + this.radius) ? this.velocity.y *= -1: null;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

}

class Healthy extends Molecules {
    constructor(_i){
        super({_i});
        this.attribute = "healthy";
        this.fillColor = color(150, 255, 67);
        this.currentColor = this.fillColor;
    }
}

class Infected extends Molecules {
    constructor(_i, posX, posY, volX, volY, radius){
        super({_i, posX, posY, volX, volY, radius});
        this.attribute = "infected";
        this.fillColor = color(255, 30, 30);
        this.currentColor = this.fillColor;
        this.daysOfInfection = 0;
    }    
}

class Immuned extends Molecules {
    constructor(_i, posX, posY, volX, volY, radius){
        super({_i, posX, posY, volX, volY, radius});
        this.attribute = "immuned";
        this.fillColor = color(9, 125, 255);
        this.currentColor = this.fillColor;
    }
}