let cv;
let socket;

function setup() {
  cv = createCanvas( document.body.clientWidth, windowHeight);
  cv.parent('myContainer');
  background(51);

  socket = io.connect('http://localhost:3000');
}

function draw() {
}
