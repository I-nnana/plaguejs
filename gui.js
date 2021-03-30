let obj = {
    dashboardHeight: 0,
    numOfMolecules: 100,
    numRows: 10,
    numCols: 10,
    showText: true,
    loopState: false,
    gridState: true,
    lineState: true,
    minMoleculeSize: 12,
    maxMoleculeSize: 16,
    reproductiveRate: 0.5,
    counterMeasure: 0.5,
    maskProtection: 0.10,
};

var gui = new dat.gui.GUI();

gui.remember(obj);

// LAYOUT
section01 = gui.addFolder('Layout');
section01.add(obj, 'dashboardHeight').min(0).max(30).step(30).onChange(function() {
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
// section02.addColor(obj, 'ballColor').onChange(function() {
//     draw()
// });
// section02.addColor(obj, 'intersectingColor').onChange(function() {
//     draw()
// });
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