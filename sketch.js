//molecules& grid are two arrays, the first stores n molecules while the second will store our grid (see gridify())
let molecules = [];
let colWidth, rowHeight;
let percentOfInfected = 0.10;
let counter = 1;

function setup() {
    textSize(30);
    frameRate(60);
    createCanvas(600, 600);

    //  columns width & height are determined by the canvas width & height divided by the number x of columns and y of rows
    colWidth = width / obj.numCols;
    rowHeight = (height * (100 - obj.dashboardHeight) / 100) / obj.numRows;

    // each time setup is called, molecules is clear to accept a new array of n molecules
    molecules = [];

    // molecules will store x amount of molecules determinded by numOfMolecules in gui.js
    for (let i = 0; i < obj.numOfMolecules; i++) {
        let randNum = random();
        (randNum < percentOfInfected) ? molecules.push(new Infected(i)) : molecules.push(new Healthy(i));
    }

    gridify();
    checkLoop();
}

function draw() {
    // background() determines the canvas backgroung colour
    background(33,33,33);

    dashboard();

    pandemicEvolution();

    // reset() is a function from molecule's class, that draws the molecules with their orignal colour 
    // once they are nomore intersecting with another molecule
    molecules.forEach((molecule) => {
        molecule.reset();
    });

    // splitObjectIntoGrid (or checkIntersectionsOld) checks whether or not molecules are intersecting
    splitObjectIntoGrid();
    // checkIntersectionsOld();

    // the following if conditional determines wheteher or not the grid shall be drawn
    obj.gridState ? drawGrid() : null;

    // render() and step() are both function frm the molecule's class, one draw the molecules i the canvas, while the second 'moves' the molecules
    molecules.forEach((molecule) => {
        molecule.render();
        molecule.step();
    });

}

/* PANDEMIC EVOLUTION  */

function pandemicEvolution(){
    if(frameCount % 60 == 0) {

        let infected = molecules.filter(molecule =>
            molecule.attribute == "infected"
        ).map(({index, daysOfInfection}) => ({index, daysOfInfection}));

        infectionTimespan(infected);
        infected = [];

        let immuned = molecules.filter(molecule =>
            molecule.daysOfInfection > 15
        ).map(({index, daysOfInfection}) => ({index, daysOfInfection}));
        
        gainImmunity(immuned);
        immuned = [];

        frameCount = 0;
    };
}

function infectionTimespan(_infected){
    _infected.forEach(molecule => {
        molecules[molecule.index].daysOfInfection++
        (molecules[molecule.index].daysOfInfection == 3) ? molecules[molecule.index].reproductiveNumber += obj.reproductiveRate : null;
    })
}

function gainImmunity(_immuned){
    _immuned.forEach(molecule => {
        let moleculeA = molecules[molecule.index];        
        let moleculeB = new Immuned(
            moleculeA.index, moleculeA.position.x, moleculeA.position.y, moleculeA.velocity.x, moleculeA.velocity.y, moleculeA.radius
        );
        molecules.splice(molecule.index, 1, moleculeB);
        
        // console.log(`Molecule A index: ${moleculeA.index}, Position: ${moleculeA.position}, Velocity: ${moleculeA.velocity}, Day of infection: ${moleculeA.daysOfInfection}`);
        // console.log(`Molecule B index: ${moleculeB.index}, Position: ${moleculeB.position}, Velocity: ${moleculeB.velocity}, Day of infection: ${moleculeA.daysOfInfection}`);
    })
}

/* DASHBOARD */

function dashboard(){
    let dashboard = new Dashboard(width, height);
}

/* CHECK INTERSECTION */

// The Function checkIntersectionsOld() checks whether of molecules are interecting regardless is they are sharing a cell or not
// using nested for loop using moleculeA and moleculeB storing a molecules object via molecules[a/b].*
// If the molecules are intersecting, then the molecules render a new colour determined by the function changeColor() or the molecule class
// Whether or not lineState returns true or false, the script will draw the grid on the canvas

function checkIntersectionsOld() {
    // console.time(checkIntersectionsOld);
    for (let a = 0; a < molecules.length; a++) {
        for (let b = a + 1; b < molecules.length; b++) {
            let moleculeA = molecules[a];
            let moleculeB = molecules[b];
            if (obj.lineState) {
                stroke(125, 100);
                line(moleculeA.position.x, moleculeA.position.y, moleculeB.position.x, moleculeB.position.y);
            };
            moleculeA.isIntersecting(moleculeB) ? (moleculeA.changeColor(), moleculeB.changeColor()) : null;
        }
    }
    // console.timeEnd(checkIntersectionsOld);
}

// checkIntersections gets an array of indexes via '_collection' from splitObjectIntoGrid() and checks whether or not,
// two or more molecules are intersecting withing a cell. checkIntersections() is using a nested for loop. a and b are two molecule's indexes
// which checkIntersections() needs to determine whether or not they are intersecting.
// For each iteration moleculeA & moleculeB retrieve via the _collection indexes, the mathcing molecules object in molecules[] array.
// If the molecules are intersecting, then the molecules render a new colour determined by the function changeColor() or the molecule class
// Whether or not lineState returns true or false, the script will draw the grid on the canvas

function checkIntersections(_collection, _oneByOneSquare) {

    for (let a = 0; a < _oneByOneSquare.length; a++) {
        for (let b = a + 1; b < _oneByOneSquare.length; b++) {

            let moleculeA = molecules[_collection[a]];
            let moleculeB = molecules[_collection[b]];

            if (obj.lineState) {
                stroke(200, 200, 200);
                line(moleculeA.position.x, moleculeA.position.y, moleculeB.position.x, moleculeB.position.y);
            };
        }
    }

    for (let a = 0; a < _collection.length; a++) {
        for (let b = a + 1; b < _collection.length; b++) {
            let index;

            let moleculeA = molecules[_collection[a]];
            let moleculeB = molecules[_collection[b]];

            moleculeA.isIntersecting(moleculeB) ? (
                moleculeA.changeColor(), 
                moleculeB.changeColor(),
                contact = moleculeA.infection(moleculeB),
                infection(contact)
            ) : null;
        }
    }

}

/* MOLECULE INFECTION */

function infection(_contact){
    if (_contact.index || _contact.index == 0){
        let randNum = random();
        if(randNum <= _contact.rate ){
            let moleculeA = molecules[_contact.index];
            let moleculeB = new Infected(
                moleculeA.index, moleculeA.position.x, moleculeA.position.y, moleculeA.velocity.x, moleculeA.velocity.y, moleculeA.radius
            );
            molecules.splice(_contact.index, 1, moleculeB);
            
            // console.log(`Molecule A index: ${moleculeA.index}, \nPosition: ${moleculeA.position}, \nVelocity: ${moleculeA.velocity}`);
            // console.log(`Molecule B index: ${moleculeB.index}, \nPosition: ${moleculeB.position}, \nVelocity: ${moleculeB.velocity}`);
        }            
    }
}

// The function splitObjectIntoGrid creates for each iteration an array moleculeCheck & oneByOneSquare that are sent to checkIntersections().
// for each draw() iteration, splitObjectIntoGrid will iterate for n times, determined x the numRows.
// Each array holds a number n of molecules within a given square. The script will then check whether the molecules intersect.
// To check whether a given molecule is intersecting another one outside of its square, the script checks in an area of shape L and distance half less than a block,
// whether a collision is possible and save those molecules in twoByOneSquare & oneByTwoSquare.

function splitObjectIntoGrid() {
    // console.time("new method:");

    for (let j = 0; j < obj.numRows; j++) {
        for (let i = 0; i < obj.numCols; i++) {

            let oneByOneSquare = molecules.filter(molecule =>
                molecule.position.x > (i * colWidth) &&
                molecule.position.x < ((i + 1) * colWidth) &&
                molecule.position.y > j * rowHeight &&
                molecule.position.y < (j + 1) * rowHeight 
            ).map(molecule => molecule.index);

            let twoByOneSquare = molecules.filter(molecule =>
                molecule.position.x > ((i -1) * colWidth) &&
                molecule.position.x < ((i + 1) * colWidth) &&
                molecule.position.y > ((j - 1) * rowHeight) &&
                molecule.position.y < j * rowHeight
            ).map(molecule => molecule.index);

            let oneByTwoSquare = molecules.filter(molecule =>
                molecule.position.x > ((i - 1) * colWidth) &&
                molecule.position.x < (i * colWidth) &&
                molecule.position.y > (j * rowHeight) &&
                molecule.position.y < ((j + 2) * rowHeight)
            ).map(molecule => molecule.index);
            
            // console.log(`1x1 square: ${oneByOneSquare}: 2x1 square: ${twoByOneSquare}, 1x2 square: ${oneByTwoSquare}`);

            let moleculeCheck = [...oneByOneSquare, ...twoByOneSquare, ...oneByTwoSquare];
            checkIntersections(moleculeCheck, oneByOneSquare);
        }
    }
    // console.timeEnd("new method:");
}


// The function gridify() ensures that each molecules original position aren't overlapping with one to another.
// numDivision is calculated by ceiling the square root of numOfMolecules and spacing is the product
// of the canvas width (-40px) divided by the former variable. Each molecule is given a x & y position.
// Their column position (colPos) is determined by the product of 'spacing' by the rest of their indexes modulo numDivision.
// Their row position (rowPos) is determined by the product of 'spacing' by flooring their indexes divided by numDivision.
// 20 px are added to the x and y positions to insure that the molecule won't overlap with the canvas borders due to the radiuses 

function gridify() {
    let numDivision = ceil(Math.sqrt(obj.numOfMolecules));
    let spacing = (width) / numDivision;

    molecules.forEach((molecule, index) => {

        let colPos = (index % numDivision) * spacing;
        let rowPos = floor(index / numDivision) * (spacing * (100 - obj.dashboardHeight) / 100);
        //console.log(`The col pos ${colPos} and the row pos ${rowPos}`);
        molecule.position.x = colPos + obj.maxMoleculeSize;
        molecule.position.y = rowPos + obj.maxMoleculeSize;
    });
}

// The function drawGrid draws a grid using a nested loop iterating columns(i) 
// within rows(j). colWidth and rowWidth are calculated in the setup(). The style 
// of grid is defined by fill, stroke and strokeWeight. There
// are no parameters required to fulfil the function and no returns

function drawGrid() {
    noFill();
    stroke(155, 155, 155, 50);
    strokeWeight(1);
    let cellCounter = 0;

    for (let j = 0; j < obj.numRows; j++) {
        for (let i = 0; i < obj.numCols; i++) {
            rect(i * colWidth, j * rowHeight, colWidth, rowHeight)
        }
    }
}

// depending wheter checkLoop gets true or false, the animation is paused or playing
function checkLoop() {
    if (obj.loopState) {
        loop();
    } else {
        noLoop();
    }
}