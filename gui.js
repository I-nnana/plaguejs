let obj = {
    dashboardHeight: 30,
    numOfMolecules: 100,
    numRows: 7,
    numCols: 7,
    showText: true,
    loopState: false,
    gridState: true,
    lineState: true,
    minMoleculeSize: 10,
    maxMoleculeSize: 15
};

var gui = new dat.gui.GUI();

gui.remember(obj);

section01 = gui.addFolder('Layout');
section01.add(obj, 'dashboardHeight').min(0).max(50).step(5).onChange(function() {
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