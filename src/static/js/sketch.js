let cv;
let socket;
let sweight;
let button;
let hexColor;
let click;
let backup_color;

$(document).ready(function(){
  //Function to show toolbox
  $('.start-btn').click(function(){
    click = false;
    $('.modal-box').toggleClass("show-modal");
    $('.start-btn').toggleClass("show-modal");
  });
  //Function to Hide Toolbox
  $('.stop-btn').click(function(){
    click = true;
    $('.modal-box').toggleClass("show-modal");
    $('.start-btn').toggleClass("show-modal");
  });
  //Function to Change color
  $("#colorpicker").spectrum({
      color: "#fff",
      change: function(color) {
          hexColor = color.toHexString();
      }
  });
});

//Function to setup everything
function setup() {
  cv = createCanvas( document.body.clientWidth, windowHeight);
  cv.parent('myContainer');
  background(51);
  sweight = 5;
  hexColor='#ffffff';
  backup_color=hexColor;
  click=true;

  button = createButton('→');
  button.addClass('start-btn');
  button.addClass('arrow');
  button.addClass('arrow-left');
  button.position(20, 20);

  socket = io.connect('http://localhost:3000');
  socket.on('mouse', newDrawing);

  socket.on('clear', () => {
    background(51);
  });
}

//Function to draw the receiving data
function newDrawing(data) {
  stroke(data.color);
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



//Function to draw
function mouseDragged() {
  if (click===true) {
    let data = {
      x: mouseX,
      y: mouseY,
      px: pmouseX,
      py: pmouseY,
      weight: sweight,
      color: hexColor
    };
  
    socket.emit('mouse', data);
  
    stroke(hexColor);
    strokeWeight(sweight)
    line(mouseX, mouseY, pmouseX, pmouseY)
  }
}

//Function to Select Eraser
function changeEraser() {
  backup_color = hexColor;
  hexColor= '#333333';
}

//Function to Select Pen
function changePen() {
  hexColor = backup_color;
}