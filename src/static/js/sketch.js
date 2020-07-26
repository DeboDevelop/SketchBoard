let cv;
let socket;
let sweight;

//Function to setup everything
function setup() {
  cv = createCanvas( document.body.clientWidth, windowHeight);
  cv.parent('myContainer');
  background(51);
  sweight = 5;

  socket = io.connect('http://localhost:3000');
  socket.on('mouse', newDrawing);

  socket.on('clear', () => {
    background(51);
  });
}

//Function to draw the receiving data
function newDrawing(data) {
  stroke(255, 0, 100);
  strokeWeight(sweight)
	line(data.x, data.y, data.px, data.py)
}

//Function to clear the canvas
function clearDrawing() {
  background(51);
  socket.emit('clear');
}

function changeWeight() {
  sweight  = document.getElementById("weight").value;
}

//Function to draw
function mouseDragged() {
  
  let data = {
    x: mouseX,
    y: mouseY,
    px: pmouseX,
    py: pmouseY
  };

  socket.emit('mouse', data);

  stroke(255);
  strokeWeight(sweight)
	line(mouseX, mouseY, pmouseX, pmouseY)
}
