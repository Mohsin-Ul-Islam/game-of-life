const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const btn = document.getElementById('btn');
const tickTimeInput = document.getElementById('speed');
const clrBtn = document.getElementById('clr');

let simulationMode = false;
let simulationFunction = null;

let startTime;

ctx.fillStyle = 'lightgreen';

const debug = false;

const blockSize =  {
  x: 40,
  y: 40
};

const offset = 2;

const rows = canvas.height / blockSize.y;
const columns = canvas.width / blockSize.x;

if (debug) console.log(`Rows: ${rows} | Columns: ${columns}`);

let table = new Array(rows).fill(0).map(() => new Array(columns).fill(0));

if (debug) console.table(table);


//listeners
window.addEventListener('load', draw);


canvas.addEventListener('mousemove', function(evt) {

  if (evt.buttons) {

    let x = Math.round((evt.offsetY - blockSize.y/2) / blockSize.y);
    let y = Math.round((evt.offsetX - blockSize.x/2) / blockSize.x);

    if (debug) console.log(`(${x},${y})`);

    ctx.fillStyle = 'lightgreen';
    ctx.fillRect(y*blockSize.y,x*blockSize.x,blockSize.y - offset,blockSize.x - offset);
    table[x][y] = 1;

    if (debug) console.table(table);
  }

});

clrBtn.addEventListener('click', function(evt) {
  table.forEach(row => row.fill(0));
  draw();
});

btn.addEventListener('click', function(evt) {

  simulationMode = !simulationMode;

  evt.target.innerHTML = simulationMode ? 'Stop Simulation' : 'Start Simulation';

  if (!simulationMode) return window.cancelAnimationFrame(simulationFunction);

  const tickTime = 800; //ms

  simulationFunction = window.requestAnimationFrame(loop);

});

function createGrid() {

}

function loop(timeNow) {

  if (startTime === undefined) {
    startTime = timeNow;
  }

  const elapsedTime = timeNow - startTime;

  if (elapsedTime > (tickTimeInput.value || 150)) {
    processGeneration();
    startTime = timeNow;
  }

  simulationFunction = window.requestAnimationFrame(loop);

}

function getNeighbours(i,j) {

  let _total = 0;

  for (let k = i - 1; k <= i + 1; k++) {
    for (let l = j - 1; l <= j + 1; l++) {
      try {
        if(k === i && l === j) continue;
        if(table[k][l] === 1) _total += 1;
      }
      catch(err) {

      }
    }
  }

  return _total;

}

function processGeneration() {

  let newGeneration = new Array(rows).fill(0).map(() => new Array(columns).fill(0));

  for (let i = 0; i < table.length; i++) {
    for (let j = 0; j < table[i].length; j++) {

      //count neighbours of table[i][j]
      let neighbours = getNeighbours(i,j);

      //rule number two
      if (table[i][j] === 1 && (neighbours === 2 || neighbours === 3)) {
        newGeneration[i][j] = 1;
      };

      // rule number four
      if (table[i][j] === 0 && neighbours === 3) {
        newGeneration[i][j] = 1;
        continue;
      }

    }
  }

  table = newGeneration;

  draw();

}


function draw() {
  for (let i = 0; i < table.length; i++) {
    for (let j = 0; j < table[i].length; j++) {
      if (table[i][j]) {
        ctx.fillStyle = 'lightgreen';
      }
      else {
        ctx.fillStyle = 'white';
      }
      ctx.fillRect(j*blockSize.y,i*blockSize.x,blockSize.y - offset,blockSize.x - offset);
    }
  }
}
