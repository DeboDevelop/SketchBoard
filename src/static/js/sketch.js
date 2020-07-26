let cv;
let socket;
let sweight;
let red,green,blue;

//Function to setup everything
function setup() {
  cv = createCanvas( document.body.clientWidth, windowHeight);
  cv.parent('myContainer');
  background(51);
  sweight = 5;
  red=255;
  green=255;
  blue=255;

  socket = io.connect('http://localhost:3000');
  socket.on('mouse', newDrawing);

  socket.on('clear', () => {
    background(51);
  });
}

//Function to draw the receiving data
function newDrawing(data) {
  stroke(`rgba(${red}, ${green}, ${blue}, 0.8)`);
  strokeWeight(data.weight)
	line(data.x, data.y, data.px, data.py)
}

//Function to clear the canvas
function clearDrawing() {
  background(51);
  socket.emit('clear');
}

//Function to change the stroke
function changeWeight() {
  sweight  = document.getElementById("weight").value;
}

//Function to Change color
function changeColour() {
  let selectedColour = document.getElementById("lineColor").value;
  if(selectedColour==='White') {
    red=255;
    green=255;
    blue=255;
  } else if (selectedColour==='Sky Blue')
  {
    red=0;
    green=128;
    blue=255;
  } else if(selectedColour==='Pink')
  {
    red=255;
    green=153;
    blue=255;
  } else if(selectedColour==='Yellow')
  {
    red=255;
    green=255;
    blue=0;
  } else if(selectedColour==='Green')
  {
    red=0;
    green=255;
    blue=0;
  }
}

//Function to draw
function mouseDragged() {
  
  let data = {
    x: mouseX,
    y: mouseY,
    px: pmouseX,
    py: pmouseY,
    weight: sweight
  };

  socket.emit('mouse', data);

  stroke(red,green,blue);
  strokeWeight(sweight)
	line(mouseX, mouseY, pmouseX, pmouseY)
}
