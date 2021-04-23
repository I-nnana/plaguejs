// dat.gui is as JS library providing a GUI taht lets its users change the varaibles stored within the object "obj" L.4
// One may arrange the varaibles within set sections.

let obj = {
    dashboardHeight: 0,
    numOfMolecules: 100,
    numRows: 10,
    numCols: 10,
    dashboard: false,
    showText: true,
    loopState: false,
    gridState: true,
    lineState: true,
    minMoleculeSize: 9,
    maxMoleculeSize: 12,
    reproductiveRate: 0.5,
    counterMeasure: 0.5,
    maskProtection: 0.10,
    virusLifespan: 17,
    endIncumbation: 180,
};

var gui = new dat.gui.GUI();

gui.remember(obj);

// LAYOUT
section01 = gui.addFolder('Layout');

// calling setup() and  draw() means that when the user toggles dashboard to either true or false, 
// those functions are triggered alongside checkDashboard()
section01.add(obj, 'dashboard').onChange(function() {
    checkDashboard();
    setup();
    draw();
});
section01.add(obj, 'numOfMolecules').min(0).max(1000).step(1).onChange(function() {
    setup();
    draw();
});
section01.add(obj, 'numRows').min(1).max(20).step(1).onChange(function() {
    setup();
    draw();
});
section01.add(obj, 'numCols').min(1).max(20).step(1).onChange(function() {
    setup();
    draw();
});
section01.add(obj, 'showText').onChange(function() {
    draw()
});
section01.add(obj, 'loopState').onChange(function() {
    checkLoop()
});
section01.add(obj, 'gridState').onChange(function() {
    draw()
});
section01.add(obj, 'lineState').onChange(function() {
    draw()
});

// DESIGN
section02 = gui.addFolder('Design');

section02.add(obj, 'minMoleculeSize').min(1).max(50).step(1).onChange(function() {
    setup();
    draw()
});
section02.add(obj, 'maxMoleculeSize').min(1).max(50).step(1).onChange(function() {
    setup();
    draw()
});

// INFECTION SPREAD
section03 = gui.addFolder('Pandemic');

section03.add(obj, 'reproductiveRate').min(0.05).max(1).step(0.05).onChange(function() {
    setup();
    draw()
});
section03.add(obj, 'counterMeasure').min(0.1).max(0.8).step(0.05).onChange(function() {
    setup();
    draw()
});
section03.add(obj, 'maskProtection').min(0.1).max(0.5).step(0.05).onChange(function() {
    setup();
    draw()
});
section03.add(obj, 'virusLifespan').min(10).max(20).step(1).onChange(function() {
    setup();
    draw()
});
section03.add(obj, 'endIncumbation').min(180).max(360).step(60).onChange(function() {
    setup();
    draw()
});