class Molecules {
    // The parent constructor will determine a molecule's postion, velocity, radius, the intersecting colour. A molecule's index is passed from sketch at its creation.
    // the constructor accepts data a parameters sonce some of the data is passed by the child components. The parameters aregiven random values nonetheless.
    constructor({
        _i, posX = 0, posY = 0, volX = random(-1,1), volY = random(-1,1), radius = random(obj.minMoleculeSize, obj.maxMoleculeSize)
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
            textSize(9),
            textAlign(CENTER ),
            text(this.index, this.position.x, this.position.y + 3)) : null;
    }

    // isIntersecting() is the function that checks the molecules intersection. p5.js comes with the dist() function 
    // that calculates for us the distance bewteen two objects by passign their x & y positions.
    // If the gap (calculated by the distance - both radiuses) between the two objects is smaller than 0, this, the molecules 
    // are intersecting. isIntersecting() returns either true or false which in turn, will trigger or not changeColor()
    // Futhermore, is colision is set to true, then bounce() is triggered
    isIntersecting(_molecule) {
        let distance = dist(this.position.x, this.position.y, _molecule.position.x, _molecule.position.y);
        let gap = distance - this.radius - _molecule.radius;
        let collision = false;

        (gap <= 0) ? (collision = true, this.bounce(_molecule, distance)) : collision = false;

        return collision;
    }

    // socialDistancing is an attempt to add social distancing to the simulation.
    // the idea was that when the molecules distance matched a certain threshold, the function was triggered
    // My idea was to predict if the molecules woud colide by calculating the possible positions the ball would take in a near future
    // calculate the gap, and if the gaps was under 0, then, trigger the bounce method
    socialDistancing(_molecule, _distance){

        let posX = this.position.x;
        let posY = this.position.y; 

        let velX = this.velocity.x;
        let velY = this.velocity.y;

        let newPosX = posX + velX * 10;
        let newPosY = posY + velY * 10;

        let _posX = _molecule.position.x;
        let _posY = _molecule.position.y; 

        let _velX = _molecule.velocity.x;
        let _velY = _molecule.velocity.y;

        let _newPosX = _posX + _velX * 10;
        let _newPosY = _posY + _velY * 10;

        let distance = dist(newPosX, newPosY, _newPosX, _newPosY)
        // console.log(distance);
        let gap = distance - this.radius - _molecule.radius;
        // console.log(gap);

        (gap <= 0) ?  this.bounce(_molecule, _distance) : null;

    }

    // the bounce method is divide in two. First, if a ball collides with a ball that is under lockdown (thus, the daysOfInfection property is greater ir equal 5 and infectionSHare is true)
    // then, the script calculates the previous position of the ball. With the past and curent position of the said ball, I calculate a vector (L 96), find its angle in degrees. And with that angle
    // I get the matching x & y vectors with Cosine and Sine and apply the appropriate vectors to the ball.
    bounce(_molecule, _distance){

        this.repulse(_molecule);

        if (this.daysOfInfection >= 5 && infectionShare){

            let currentVelX = _molecule.velocity.x;
            let currentVelY = _molecule.velocity.y;
            // console.log(`X: ${currentVelX}, Y: ${currentVelY}`);

            let reverseX = currentVelX * -1;
            let reverseY = currentVelY * -1;
            // console.log(`reverseX: ${reverseX}, reverseY: ${reverseY}`);

            // console.log(`x: ${_molecule.position.x}, y: ${_molecule.position.y}`);
            let oldPosX = _molecule.position.x + reverseX;
            let oldPosY = _molecule.position.y + reverseY;            
            // console.log(`x: ${ oldPosX }, y: ${ oldPosY }`);

            let oldPosition = createVector(oldPosX, oldPosY);
            let resultantV = p5.Vector.sub(this.position, oldPosition);
            let angle = ((resultantV.heading()) *  180 / Math.PI);

            // console.log(ang+"°");

            let newVelX = Math.cos(180 - angle);
            let newVelY = Math.sin(180 - angle);

            let constrainX = constrain(newVelX, -1, 1);
            let constrainY = constrain(newVelY, -1, 1);

            _molecule.velocity.x = constrainX;
            _molecule.velocity.y = constrainY;
   
        } else if (_molecule.daysOfInfection >= 5 && infectionShare){

            let currentVelX = this.velocity.x;
            let currentVelY = this.velocity.y;

            let reverseX = currentVelX * -1;
            let reverseY = currentVelY * -1;

            let oldPosX = this.position.x + reverseX;
            let oldPosY = this.position.y + reverseY;         

            let oldPosition = createVector(oldPosX, oldPosY);
            let resultantV = p5.Vector.sub(this.position, oldPosition);
            let angle = ((resultantV.heading()) *  180 / Math.PI);

            let newVelX = Math.cos(180 - angle);
            let newVelY = Math.sin(180 - angle);

            let constrainX = constrain(newVelX, -1, 1);
            let constrainY = constrain(newVelY, -1, 1);

            this.velocity.x = constrainX;
            this.velocity.y = constrainY;
 
        } else {
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

            // constrain limits the velocities between -1 & 1
            let constrainX = constrain(dvx, -1, 1);
            let constrainY = constrain(dvy, -1, 1);

            this.velocity.x -= constrainX;
            this.velocity.y -= constrainY;

            _molecule.velocity.x += constrainX;
            _molecule.velocity.y += constrainY;
        }
            
    }

    // repulse insures that the molecules  aren't overlaping by calculating  the distance by which they may overlap based on 
    // the resultant vector between them malus the sum of their radius.
    repulse(_molecule){

        if (this.daysOfInfection >= 5 && infectionShare){

            let resultant = p5.Vector.sub(this.position, _molecule.position);
            let vHeading = resultant.heading();
            let vDistance = resultant.mag() - this.radius - _molecule.radius;

            let moveX = cos(vHeading) * vDistance;
            let moveY = sin(vHeading) * vDistance;

            _molecule.position.x += moveX;
            _molecule.position.y += moveY;
   
        } else if (_molecule.daysOfInfection >= 5 && infectionShare){

            let resultant = p5.Vector.sub(this.position, _molecule.position);
            let vHeading = resultant.heading();
            let vDistance = resultant.mag() - this.radius - _molecule.radius;

            let moveX = cos(vHeading) * vDistance;
            let moveY = sin(vHeading) * vDistance;

            this.position.x -= moveX;
            this.position.y -= moveY;
 
        } else {

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

            _molecule.position.x += moveX;
            _molecule.position.y += moveY;

            this.position.x -= moveX;
            this.position.y -= moveY;

        }
    }

    // checkInfection occurs when two balls collide. If one ball is healthy and the other one is infected, then the function returns both ids to sketch.js
    // that will in turn determine if the healthy ball is infected via infection.
    checkInfection(_molecule){ 
        let healthyId; 
        let infectedId; 

        if(this.attribute != "immuned" &&  _molecule.attribute != "immuned" && this.attribute !=  _molecule.attribute ){
            if(this.attribute == "healthy"){
                healthyId = this.index;
                infectedId = _molecule.index;
            } else {
                healthyId = _molecule.index
                infectedId = this.index;
            }
        }

        return {
            healthyId: healthyId, 
            infectedId: infectedId
        };
    }

    //  step() switches the direction a molecules is heading to if it hits the borders of the canvas or the dashboard).
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

    //COLOUR PATTERN

    // changeColor() gives a new colour scheme to our molecules is they are intersecting
    changeColor() {
        this.currentColor = this.intersectingColor;
    }

    // reset() is a function that sets back the original colour of the molecules once they are no more intersecting
    reset() {
        this.currentColor = this.fillColor;
    }

    // Infection color switched an infected colour from dark to light red
    infectionColor(){
        this.fillColor = color(255, 0, 0);
    }

}

// MOLECULE CLASSES - STRT

// Healthy only accepts an index parameter that i passed via super to the parent class
class Healthy extends Molecules {
    constructor(_i){
        super({_i});
        this.attribute = "healthy";
        this.fillColor = color(150, 255, 67);
        this.currentColor = this.fillColor;
    }
}

// Infected gets its parameters from infection() in sketch, those parameters are then passed to the parent class
// some of its properties are unique: daysOfInfection & frames are used for the molecul's lifecycle, and reproductionNumber sets the probability for a molecule to infect another one
class Infected extends Molecules {
    constructor(_i, posX, posY, volX, volY, radius){
        super({_i, posX, posY, volX, volY, radius});
        this.attribute = "infected";
        this.fillColor = color(175, 0, 0);
        this.currentColor = this.fillColor;
        this.frames = 0;
        this.daysOfInfection = 0;
        this.reproductionNumber = 0;
    }
}

// Immuned gets its parameters from gainImmunity() in sketch, those parameters are then passed to the parent class
class Immuned extends Molecules {
    constructor(_i, posX, posY, volX, volY, radius){
        super({_i, posX, posY, volX, volY, radius});
        this.attribute = "immuned";
        this.fillColor = color(9, 125, 255);
        this.currentColor = this.fillColor;
    }
}

// MOLECULE CLASSES - END