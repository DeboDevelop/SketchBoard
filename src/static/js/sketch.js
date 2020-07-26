let cv;
let socket;
let sweight = 5;

function setup() {
  cv = createCanvas( document.body.clientWidth, windowHeight);
  cv.parent('myContainer');
  background(51);

  socket = io.connect('http://localhost:3000');
}

function mouseDragged() {
  stroke(255);
  strokeWeight(sweight)
	line(mouseX, mouseY, pmouseX, pmouseY)
}
