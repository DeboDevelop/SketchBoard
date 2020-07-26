let cv;
let socket;
let sweight = 5;

//Function to setup everything
function setup() {
  cv = createCanvas( document.body.clientWidth, windowHeight);
  cv.parent('myContainer');
  background(51);

  socket = io.connect('http://localhost:3000');
  socket.on('mouse', newDrawing);
}

//Function to draw the receiving data
function newDrawing(data) {
  stroke(255, 0, 100);
  strokeWeight(sweight)
	line(data.x, data.y, data.px, data.py)
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
