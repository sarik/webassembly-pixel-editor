//ERROR in ./pkg/index_bg.wasm
//WebAssembly module is included in initial chunk.
//This is not allowed, because WebAssembly download and compilation must happen asynchronous.
//Add an async splitpoint (i. e. import()) somewhere between your entrypoint and the WebAssembly module:

//const { Sarik } = require("../pkg/index.js");

//import * as wasm from "../pkg/index.js";
import("../pkg/index.js")
  .catch(console.error)
  .then((wasm) => {
    //let result = wasm.addsome(4+4);
    //console.log("loaded", wasm.addsome(3, 45));
    //window.addsome = wasm.addsome;
    window.mainmock = wasm.mainmock;
    //use like new sarik()
    //window.sarik = wasm.Sarik;

    //drawToCanvas(wasm.mulbyhundred);

    let internalState = new wasm.InternalState(10, 10);
    let state = {
      internalState,
      currentColor: [200, 255, 200],
      //prevColor: [200, 200, 255],
      dragging: false,
    };
    setUpCanvas(state);
    drawToCanvas(state);
    //mainmock();
  });

function setUpCanvas(state) {
  const image = state.internalState.getCurrent();
  const c = document.getElementById("my-canvas");

  let palette = ["red", "green", "blue", /* "prev",*/ "undo", "redo"];
  palette.forEach((color) => {
    let colorButton = document.getElementById(color);
    colorButton.addEventListener("click", (e) => {
      switch (e.target.innerText) {
        case "prev":
          //state.currentColor = state.prevColor;
          break;
        case "undo":
          //state.currentColor = state.prevColor;
          state.internalState.undo();
          drawToCanvas(state);
          break;
        case "redo":
          //state.currentColor = state.prevColor;
          state.internalState.redo();
          drawToCanvas(state);
          break;
        case "red":
          //state.prevColor = state.currentColor;
          state.currentColor = [255, 0, 0];
          break;
        case "blue":
          //state.prevColor = state.currentColor;

          state.currentColor = [0, 0, 255];
          break;
        case "green":
          //state.prevColor = state.currentColor;

          state.currentColor = [0, 255, 0];
      }
    });
  });

  const cellSize = 50;

  c.addEventListener("mousedown", (e) => {
    state.dragging = true;
    state.internalState.start_dragging();
  });

  c.addEventListener("mouseup", (e) => {
    state.dragging = false;
    state.internalState.stop_dragging();
  });

  c.addEventListener("mousemove", (e) => {
    if (!state.dragging) return;
    const rect = c.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = Math.floor(x / cellSize);
    y = Math.floor(y / cellSize);

    state.internalState.brush(x, y, state.currentColor);

    drawToCanvas(state);
  });

  c.addEventListener("click", (e) => {
    const rect = c.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    //which offset to change the rgb value at
    x = Math.floor(x / cellSize);
    y = Math.floor(y / cellSize);

    state.internalState.brush(x, y, state.currentColor);
    drawToCanvas(state);
  });
}

function drawToCanvas(state) {
  const image = state.internalState.getCurrent();

  const c = document.getElementById("my-canvas");
  const context = c.getContext("2d");
  const cellSize = 50;

  context.strokeStyle = "black";
  context.lineWidth = 1;

  const width = image.getWidth();
  const height = image.getHeight();
  const cells = image.getCells();
  /* context.fillStyle = "red";
  //first two values,offset from where to start drawing
  context.fillRect(0,0,50,50);*/

  let isRed = false;
  let x = 1;

  //vertical
  for (let x = 0; x < width; x++) {
    //horizontaol
    for (let y = 0; y < height; y++) {
      const index = (y * width + x) * 3;

      let color = `rgb(${cells[index + 0]}, ${cells[index + 1]}, ${
        cells[index + 2]
      })`;

      //color = isRed ? "red" : "black";

      context.fillStyle = color;
      //first two values,offset from where to start drawing
      context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
    isRed = !isRed;
  }

  for (let x = 0; x < 10; x++) {
    context.beginPath();
    context.moveTo(x * cellSize + 0.5, 0);
    context.lineTo(x * cellSize + 0.5, height * cellSize);
    context.stroke();
  }

  for (let y = 0; y < 10; y++) {
    context.beginPath();
    context.moveTo(0, y * cellSize + 0.5);
    context.lineTo(width * cellSize, y * cellSize + 0.5);
    context.stroke();
  }

  /*let x = 34;
  var first = document.getElementById("first");
  var second = document.getElementById("second");
  console.log(second)
  var ctx = c.getContext("2d");
  ctx.fillStyle = "red"
  ctx.moveTo(100, 0);
  ctx.lineTo(200, 100);
  //ctr.strokeStyle="red"
  ctx.stroke();
  ctx.moveTo(200, 0);
  ctx.lineTo(200, 100);
  
  ctx.stroke();

  second.addEventListener("input", e => {
      x++;
      value=e.target.value
      let lastdigit = Number(value.substring(value.length-1));
      ctx.moveTo(mulbyhundred(lastdigit)+x, 0);
      ctx.lineTo(200, 100);
      ctx.stroke();
     
  })*/
}

function drawToCanvas2(state) {
  const image = state.image;

  const c = document.getElementById("my-canvas");
  const context = c.getContext("2d");

  context.strokeStyle = "black";
  context.lineWidth = 1;

  const width = 10;
  const height = 10;
  const cellSize = 50;

  for (let x = 0; x < width; x++) {
    context.beginPath();
    context.moveTo(x * cellSize + 0.5, 0);
    context.lineTo(x * cellSize + 0.5, height * cellSize);
    context.stroke();
  }

  for (let y = 0; y < 10; y++) {
    context.beginPath();
    context.moveTo(0, y * cellSize + 0.5);
    context.lineTo(width * cellSize, y * cellSize + 0.5);
    context.stroke();
  }

  /*let x = 34;
      var first = document.getElementById("first");
      var second = document.getElementById("second");
      console.log(second)
      var ctx = c.getContext("2d");
      ctx.fillStyle = "red"
      ctx.moveTo(100, 0);
      ctx.lineTo(200, 100);
      //ctr.strokeStyle="red"
      ctx.stroke();
      ctx.moveTo(200, 0);
      ctx.lineTo(200, 100);
      
      ctx.stroke();
    
      second.addEventListener("input", e => {
          x++;
          value=e.target.value
          let lastdigit = Number(value.substring(value.length-1));
          ctx.moveTo(mulbyhundred(lastdigit)+x, 0);
          ctx.lineTo(200, 100);
          ctx.stroke();
         
      })*/
}
