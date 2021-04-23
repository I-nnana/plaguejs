// The simulation rules goes as such: there are, by default 100 molecules.
// Each healthy molecule can get infected, each infected molecule will eventually revover and the immuned molecules can't get infected again.
// During the first three days, the infected can infect other balls (the incumabiton is highlighted by a dark red colour), after which, the molecules are infectious
// If the share of the populaion exceed infectionShare, then the population takes counter measuers against the pandemic. The molecules where masks and the molecules
// that were infected for more than 5 days are put into lockdown. 
// After the virus lyfe span is exceeded, the molecul gain the immuned attribute.

//  molecules& grid are two arrays, the first stores n molecules while the second will store our grid (see gridify())
// colWidth & rowHeight will help us determine the cells width & height (L. 16 & 17)
// percentOfInfected will help us alonside infectionShare trigger the counter measures (by defaul 50%), see pandemicEvolution()
//  And daysCounter counts the day passed (see dashboard)
let molecules, graphArray = [];
let colWidth, rowHeight;
let percentOfInfected = 0.1;
let infectionShare = false;
let daysCounter = 0;

function setup() { 
    frameRate(60);
    createCanvas(700, 700);

    //  columns width & height are determined by the canvas width & height divided by the number x of columns and y of rows
    // the height can shrink if the users decides to enable the dashboard. Its height s determined in gui.js, and will always be 30% of the canvas height
    colWidth = width / obj.numCols;
    rowHeight = (height * (100 - obj.dashboardHeight) / 100) / obj.numRows;

    // each time setup is called, molecules is clear to accept a new array of n molecules, thus increading the efficiency of the script
    molecules = [];

    // molecules will store x amount of molecules determined by numOfMolecules in gui.js
    // a certain number of molecules will start as "infected". Their percent is determined by random
    for (let i = 0; i < obj.numOfMolecules; i++) {
        let randNum = random();
        (randNum < percentOfInfected) ? molecules.push(new Infected(i)) : molecules.push(new Healthy(i));
    }

    // for gridify, see L.250 and 288 for checkLoop
    gridify();
    checkLoop();
}

function draw() {
    // background() determines the canvas backgroung colour
    background(33,33,33);

    // If obj.dashboard is true, then the scripts triggers drawDashboard(), otherwise it sets daysCounter back to 0
    obj.dashboard ? drawDashboard() :  daysCounter = 0;

    // reset() is a function from molecule's class, that draws the molecules with their orignal colour 
    // once they are no more intersecting with another molecule
    molecules.forEach((molecule) => {
        molecule.reset();
    });

    // splitObjectIntoGrid (or checkIntersectionsOld) checks whether or not molecules are intersecting
    // checkIntersectionsOld();
    splitObjectIntoGrid();
    
    // pandemicEvolution checks which molecules are infected and which aren't, and the lifecycle of an infected molecule (see L.69)
    pandemicEvolution();

    // the following if conditional determines wheteher or not the grid shall be drawn
    obj.gridState ? drawGrid() : null;

    // render() and step() are both function form the molecule's class, one draw the molecules i the canvas, while the second 'moves' the molecules
    molecules.forEach((molecule) => {
        molecule.render();
        molecule.step();
    });


}

/* PANDEMIC EVOLUTION  */

// During each iteration, pandemicEvolution will create a new array (infected[]) made out of infected molecules, storing their indexes and daysOfInfection
// infected is then passed into infectionTimespan()
// It does the same with infected molecules which were infected and reach the limit of the infection life span (obj.virusLifespan) with the array immuned
// passed to gainImmunity()
// on line 80, the script checks the percentage of infected. If it reaches the threshold "obj.counterMeasure", then the molecules will modify their behaviour
function pandemicEvolution(){

        let infected = molecules.filter(molecule =>
            molecule.attribute == "infected"
        ).map(({index, daysOfInfection}) => ({index, daysOfInfection}));
        
        ((infected.length * obj.numOfMolecules) / 100 >= obj.counterMeasure * 100) ? infectionShare = true : null;

        infectionTimespan(infected);
        infected = [];

        let immuned = molecules.filter(molecule =>
            molecule.daysOfInfection == obj.virusLifespan
        ).map(({index, daysOfInfection}) => ({index, daysOfInfection}));
        
        gainImmunity(immuned);
        immuned = [];

}

/* INFECTION TIME SPAN  */

//  First, the function increments the objects "frames" property by one foreach frame iteration.
// when the sum of those frames modulo 60 is equal to 0, a second or a day has passed. The property daysOfInfection is incremented by one.
// The property is important as is triggers the different lifecycle events of an infected molecule. We saw above that after a certain time, the molecule gains immunity.
// But, before that, the infected molecule will change its color, from a dark red, highlighting the incumabtion period, to a lighter red, showing that the molecule is infectious.
// if infectionShare (the percentage of infected in a given population) is set to true, and daysOfInfection is equal to 5 days, then, the molecule is considered to be in lockdown
function infectionTimespan(_infected){
    _infected.forEach(molecule => {
        
        moleculeA = molecules[molecule.index];
        moleculeA.frames++;

        (moleculeA.frames % 60 == 0) ? moleculeA.daysOfInfection++: null;

        if (moleculeA.frames ==  obj.endIncumbation){
            moleculeA.reproductionNumber = obj.reproductiveRate;
            moleculeA.infectionColor();
        }

        (infectionShare == true && moleculeA.daysOfInfection == 5) ? (moleculeA.velocity.x = 0, moleculeA.velocity.y = 0): null;
    })
}

/* GAIN IMMUNITY  */

// if daysOfInfection reaches the threshold set by obj.virusLifespan, the molecule gains immunity.
// To do that, the script catches the molecule and save it under moleculeA, passes the required parameters to the class "Immuned" and creates moleculeB:
// it gives random velocities to the new object, the immuned colours, the same index, positions and radius (see Immuned class)
// The final step it to take out moleculeA from the molecules[] and replace it with moleculeB via splice(). splice takes three arguments.
// First, the position's index of moleculeA in molecules[], second, the number of objects to 'splice', and third, the object that takes the place of moleculeA.
function gainImmunity(_immuned){
    _immuned.forEach(molecule => {
        let moleculeA = molecules[molecule.index];        
        let moleculeB = new Immuned(
            moleculeA.index, moleculeA.position.x, moleculeA.position.y, random(-1, 1), random(-1, 1), moleculeA.radius
        );
        molecules.splice(molecule.index, 1, moleculeB);
    })
}

/* CHECK INTERSECTION OLD*/

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

/* CHECK INTERSECTIONS  */

// checkIntersections Has two jobs. First, if obj.lineState is true, the simulation draws the lines between each molecules sharing the same cell, as determined by _oneByOneSquare
// Second, checkIntersections checks whether the ball from _collection && _oneByOneSquare are intersecting.
// As a side note. We determine what molecules must be checked as such. If a molecule shares the same cell, or is close to molecules near her cell (in a reversed L shape area), then checkIntersections must
// check whether the balls are intersecting. The L shape area was determined in splitObjectIntoGrid.
// If isIntersecting, the molecules function returns true, then the molecules collided, thus, the script has to change their colours and check whether one of the ball becomes infected via checkInfection
// that if is true, return an object holding two indexes that are passed to infection
// checkIntersections will run x through _collection where x is the length of _oneByOneSquare
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

    for (let a = 0; a < _oneByOneSquare.length; a++) {
        for (let b = a + 1; b < _collection.length; b++) {

            let moleculeA = molecules[_collection[a]];
            let moleculeB = molecules[_collection[b]];

            moleculeA.isIntersecting(moleculeB) ? (
                moleculeA.changeColor(), 
                moleculeB.changeColor(),
                contact = moleculeA.checkInfection(moleculeB),
                infection(contact)
            ) : null;
        }
    }

}

/* MOLECULE INFECTION */

// infection determines how a molecule gets infected. To see how an infected molecule replaces an healthy one, please, refer to gainImmunity.
// I needed an if statement at the beginning for some reason, because it wouldn't check the molecule with index 0 for some reason, hence _contact.healthyId == 0
// An infection is decided randomly. If the rate of infection is higher than randNum, then the infection occurs.
// If infectionShare is true, then the mask protection value will lower the chances of a molecule to be infected.
// To see how a healthy molecule is replaced by an infected one, plese refer to gainImmunity
function infection(_contact){
    if (_contact.healthyId || _contact.healthyId == 0){

        let randNum = random();
        let rateOfInfection = molecules[_contact.infectedId].reproductionNumber;
        let masks = obj.maskProtection;

        if(randNum <= (rateOfInfection - masks) && infectionShare){
            let moleculeA = molecules[_contact.healthyId];            
            let moleculeB = new Infected(
                moleculeA.index, moleculeA.position.x, moleculeA.position.y, moleculeA.velocity.x, moleculeA.velocity.y, moleculeA.radius
            );
            molecules.splice(_contact.healthyId, 1, moleculeB);  

        } else if (randNum <= rateOfInfection && !infectionShare){
            let moleculeA = molecules[_contact.healthyId];            
            // console.log(`Molecule A index: ${moleculeA.index}, \nPosition: ${moleculeA.position}, \nVelocity: ${moleculeA.velocity}`);

            let moleculeB = new Infected(
                moleculeA.index, moleculeA.position.x, moleculeA.position.y, moleculeA.velocity.x, moleculeA.velocity.y, moleculeA.radius
            );
            molecules.splice(_contact.healthyId, 1, moleculeB);            
            // console.log(`Molecule B index: ${moleculeB.index}, \nPosition: ${moleculeB.position}, \nVelocity: ${moleculeB.velocity}`);

        }
    }
}

/* SPLIT INTO GRID  */

// The function splitObjectIntoGrid creates for each iteration an array moleculeCheck & oneByOneSquare that are sent to checkIntersections().
// for each draw() iteration, splitObjectIntoGrid will iterate for n times, determined by x the numRows.
// Each array holds a number n of molecules within a given square. The script will then check whether the molecules intersect.
// To check whether a given molecule is intersecting another one outside of its square, the script checks in an area of shape L and distance half less than a block,
// whether a collision is possible and save those molecules in twoByOneSquare & oneByTwoSquare.
// Each array is then concatenated into a single array moleculeCheck which is ten passed with oneByOneSquare to checkIntersections()
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

            let numOfBalls = oneByOneSquare.length;

            // oneByOneSquare is also used to print the number of balls present on the same cell at the same time. 
            if(obj.gridState){
                textSize(12);
                fill(200, 200, 200);
                text(numOfBalls, (i + 0.90) * colWidth,j * rowHeight  + 15);
            } 

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

/* GRIDIFY  */

// The function gridify() ensures that each molecules original position aren't overlapping with one to another.
// numDivision is calculated by ceiling the square root of numOfMolecules and spacing is the product
// of the canvas width (-40px) divided by the former variable. Each molecule is given a x & y position.
// Their column position (colPos) is determined by the product of 'spacing' by the rest of their indexes modulo numDivision.
// Their row position (rowPos) is determined by the product of 'spacing' by flooring their indexes divided by numDivision.
// 20 px are added to the x and y positions to insure that the molecule won't overlap with the canvas borders due to the radiuses 
// rowPos is dynamic as it may be affected whteher the dashboard is drawn or not.
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

/* DRAW GRID  */

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
            rect(i * colWidth, j * rowHeight, colWidth, rowHeight)
        }
    }
}

/* CHECK LOOP  */

// depending wheter checkLoop gets true or false, the animation is paused or playing
function checkLoop() {
    if (obj.loopState) {
        loop();
    } else {
        noLoop();
    }
}

/* CHECK DASHBOARD  */

// depending wheter checkDashboard gets true or false, the dashboard is drawn
// if obj.dashboard is true, then obj.dashboardHeight is given the percent height the dashboard gets
function checkDashboard() {
    if (obj.dashboard == true) {
        obj.dashboardHeight = 30
        drawDashboard()
    } else {
        obj.dashboardHeight = 0
    }
}

/* DRAW DASHBOARD  */

// drawDashboard draws a dashboard, depending whether obj.dashboard is set to true or not
// heightLimit draws a line to delimit the simulation from the dashboard. It is also used to position the data and graph in relation to the dashboard limit
function drawDashboard() {

    let heightLimit = (height * (100  - obj.dashboardHeight) / 100);
    let graphPos = (height- heightLimit) /2;

    // border styling rules
    stroke(255, 255, 255);
    strokeWeight(2);
    line(0, heightLimit, width, heightLimit);

    // Data styling rules
    strokeWeight(0);
    textSize(14);
    textAlign(LEFT);
    fill(255, 255, 255);

    // for each frame that stacks, the script checks whether a day has passed. If so, daysCounter increments by 1, which is then primpt on the dashboard
    let frames = frameCount;
    (frames % 60 == 0) ? daysCounter++ : null;

    text(`Days passed: ${daysCounter}`, 50, heightLimit + 50);
    text(`Reproductive rate: ${obj.reproductiveRate * 100}% `, 50, heightLimit + 75);
    text(`Counter measures: ${obj.counterMeasure * 100}% `, 50, heightLimit + 100);
    text(`Mask protection: ${obj.maskProtection * 100}% `, 50, heightLimit + 125);
    text(`Virus lifespan: ${obj.virusLifespan} days`, 50, heightLimit + 150);
    text(`Days of incubation: ${obj.endIncumbation / 60} days`, 50, heightLimit + 175);

    // GRAPH
    // To draw the graphs, three arrays are created by filtering from molecules[] each objects by their attributes
    // The graph is drawn as such: during each iteration, the script draws a first rectangle of position x: 0 (the starting position is determined by translate()) and y: 0
    // The rectangles that represent the infected molecules start at the same starting point as the healthy one, overwriting the healthy rectangles. 
    // However, the immuned fall from top to bottom, By stating "data.mHeight - j" on their y coordinates, with state that we ant the rectangle to be drawn from top top bottom.
    // The maximum height the rectangle may take is set by j = 100.

    let i = 0;
    let j = 100;

    let numInfected = molecules.filter(molecule => molecule.attribute == "infected");
    let numHealthy = molecules.filter(molecule => molecule.attribute == "healthy");
    let numImmuned = molecules.filter(molecule => molecule.attribute == "immuned");
    let iHeight = map(numInfected.length, i, obj.numOfMolecules, 0, j);
    let hHeight = map(numHealthy.length, i, obj.numOfMolecules, 0, j);
    let mHeight = map(numImmuned.length, i, obj.numOfMolecules, 0, j);

    // According to Mozilla developper: the shift() method removes the first element from an array and returns that removed element. This method changes the length of the array.
    // In short, if the array length exceeds 300, then, the script takes out the first element of the array.
    if (graphArray.length >= 300) {
        graphArray.shift();
    }

    // graphArray is given all the data that need/help to render on the graph
    graphArray.push({
        numInfected: numInfected.length
        , numHealthy: numHealthy.length
        , numImmuned: numImmuned.length
        , iHeight: iHeight
        , hHeight: hHeight
        , mHeight: mHeight
    })

    // console.log(graphArray);

    // pop() removes an item from  the end of an array, while push adds one.
    // translate replace the graph on the canvas by setting its new x and y coordiantes of origin
    // (heightLimit + graphPos + graphPos /2) allows us to set the graph roughly on the middle of the graph y axis
    push();
    translate(width/2 + 25,  (heightLimit + graphPos + graphPos /2));
    graphArray.forEach(function (data, index) {
        noStroke();
        fill(255, 0, 0)
        rect(index, 0, 1, -data.iHeight);
        fill(0, 255, 0);
        rect(index, -data.iHeight, 1, -data.hHeight);
        fill(9, 125, 255);
        rect(index, data.mHeight - j, 1, -data.mHeight);
    })
    pop();

    


}