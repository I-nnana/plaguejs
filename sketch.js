//molecules& grid are two arrays, the first stores n molecules while the second will store our grid (see gridify())
let molecules = [];
let colWidth, rowHeight;
let percentOfInfected = 0.25;

function setup() {
    createCanvas(575, 575);

    //  columns width & height are determined by the canvas width & height divided by the number x of columns and y of rows
    colWidth = width / obj.numCols;
    rowHeight = height / obj.numRows;

    // each time setup is called, molecules is clear to accept a new array of n molecules
    molecules = [];

    // molecules will store x amount of molecules determinded by numOfMolecules in gui.js
    for (let i = 0; i < obj.numOfMolecules; i++) {
        let randNum = random();
        (percentOfInfected > randNum) ? molecules.push(new Infected(i)) : molecules.push(new Healthy(i));
    }

    gridify();
    checkLoop();
}

function draw() {
    // background() determines the canvas backgroung colour
    background(255);

    // reset() is a function from molecule's class, that draws the molecules with their orignal colour 
    // once they are nomore intersecting with another molecule
    molecules.forEach((molecule) => {
        molecule.reset();
    });

    // splitObjectIntoGrid (or checkIntersectionsOld) checks whether or not molecules are intersecting
    splitObjectIntoGrid();
    // checkIntersectionsOld();

    // the follwing if conditional determines wheteher or not the grid shall be drawn
    obj.gridState ? drawGrid() : null;

    // render() and step() are both function frm the molecule's class, one draw the molecules i the canvas, while the second 'moves' the molecules
    molecules.forEach((molecule) => {
        molecule.render();
        molecule.step();
    });
    // console.log(frameRate());
}

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

function checkIntersections(_collection) {

    let index;

    for (let a = 0; a < _collection.length; a++) {
        for (let b = a + 1; b < _collection.length; b++) {

            let moleculeA = molecules[_collection[a]];
            let moleculeB = molecules[_collection[b]];

            if (obj.lineState) {
                stroke(125, 100);
                line(moleculeA.position.x, moleculeA.position.y, moleculeB.position.x, moleculeB.position.y);
            };

            moleculeA.isIntersecting(moleculeB) ? (
                moleculeA.changeColor(), 
                moleculeB.changeColor(),
                index = moleculeA.infection(moleculeB),
                infected(index)
            ) : null;
        }
    }

}

function infected(_index){
    if (_index){

        (_index == 1) ? console.log("hit") : null;
        
        let moleculeA = molecules[_index];
        // console.log(`Molecule A index: ${moleculeA.index}, \nPosition: ${moleculeA.position}, \nVelocity: ${moleculeA.velocity}`)
        
        let moleculeB = new Infection(moleculeA.index, moleculeA.position, moleculeA.velocity);
        // console.log(`Molecule B index: ${moleculeB.index}, \nPosition: ${moleculeB.position}, \nVelocity: ${moleculeB.velocity}`);

        molecules.splice(_index, 1, moleculeB);
    }
}


// (percentOfInfected > randNum) ? molecules.push(new Infected(i)) : molecules.push(new Healthy(i));


// The function splitObjectIntoGrid creates for each iteration an array moleculeCollection that is sent to checkIntersections().
// for each draw() iteration, splitObjectIntoGrid will iterate for n times, determined x the numRows.
// Each individual array holds y number of molecules indexes determined as such.
// moleculeCollection filters molecules array with molecule objects whose positions are framed within the current colWidth & rowHeight
// determinded by i & j. After filter was completed, moleculeCollection maps the objects indexes and is sent to checkIntersections().

function splitObjectIntoGrid() {
    // console.time("new method:");

    for (let j = 0; j < obj.numRows; j++) {
        for (let i = 0; i < obj.numCols; i++) {

            let moleculeCollection = molecules.filter(molecule =>
                molecule.position.x > (i * colWidth) &&
                molecule.position.x < ((i + 1) * colWidth) &&
                molecule.position.y > j * rowHeight &&
                molecule.position.y < (j + 1) * rowHeight
            ).map(molecule => molecule.index);

            checkIntersections(moleculeCollection);
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
    let spacing = (width - 60) / numDivision;

    molecules.forEach((molecule, index) => {

        let colPos = (index % numDivision) * spacing;
        let rowPos = floor(index / numDivision) * spacing;
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

    for (let j = 0; j < obj.numRows; j++) {
        for (let i = 0; i < obj.numCols; i++) {
            //
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