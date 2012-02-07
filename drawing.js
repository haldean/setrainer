/**
 * Draws a rounded rectangle using the current state of the canvas. 
 * If you omit the last three params, it will draw a rectangle 
 * outline with a 5 pixel border radius 
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate 
 * @param {Number} width The width of the rectangle 
 * @param {Number} height The height of the rectangle
 * @param {Number} radius The corner radius.
 *
 * Thanks to http://js-bits.blogspot.com/2010/07/canvas-rounded-corner-rectangles.html
 */
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

var ellipse = function(ctx) {
  roundRect(ctx, 25, 12, 150, 50, 25, true, true);
}

var squiggle = function(ctx) {
  ctx.beginPath();
  ctx.moveTo(50, 12);
  ctx.bezierCurveTo(100, 0, 100, 37, 150, 12);
  ctx.bezierCurveTo(175, 7, 200, 37, 150, 63);
  ctx.bezierCurveTo(100, 75, 100, 37, 50, 63);
  ctx.bezierCurveTo(25, 68, 0, 37, 50, 12);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

var diamond = function(ctx) {
  ctx.beginPath();
  ctx.moveTo(25, 37);
  ctx.lineTo(100, 12);
  ctx.lineTo(175, 37);
  ctx.lineTo(100, 63);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

var drawCard = function(card) {
  var canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 75;

  var ctx = canvas.getContext('2d');

  var color;
  switch (card.color) {
    case 0: color = "rgb(59,75,160)"; break;
    case 1: color = "rgb(85,185,72)"; break;
    case 2: color = "rgb(240,77,35)"; break;
  }

  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  if (card.fill == 0) {
    ctx.fillStyle = color;
  } else if (card.fill == 1) {
    switch (card.color) {
      case 0: ctx.fillStyle = "rgb(141,154,207)"; break;
      case 1: ctx.fillStyle = "rgb(158,229,149)"; break;
      case 2: ctx.fillStyle = "rgb(240,161,141)"; break;
    }
  } else {
    ctx.fillStyle = "rgb(255, 255, 255)";
  }

  switch (card.shape) {
    case 0: ellipse(ctx); break;
    case 1: squiggle(ctx); break;
    case 2: diamond(ctx); break;
  }
  
  return canvas;
}
