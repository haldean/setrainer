var bean = require('bean');
var bonzo = require('bonzo');

deck = new Array(81);
in_play = new Array(12);
selected = new Array();

var fillName = function(fill) {
  switch (fill) {
    case 0: return 'solid';
    case 1: return 'shaded';
    case 2: return 'hollow';
    default: return '(fill ' + fill + ')';
  }
};

var colorName = function(color) {
  switch (color) {
    case 0: return 'blue';
    case 1: return 'green';
    case 2: return 'red';
    default: return '(color ' + color + ')';
  }
};

var shapeName = function(shape) {
  switch (shape) {
    case 0: return 'ellipse';
    case 1: return 'squiggle';
    case 2: return 'diamond';
    default: return '(shape ' + shape + ')';
  }
};

var cardId = function(card) {
  return '' + card.number + card.fill + card.color + card.shape;
}

var printCard = function(card) {
  return (card.number + 1) + ' x ' +
    fillName(card.fill) + ' ' +
    colorName(card.color) + ' ' +
    shapeName(card.shape);
};

var deselectAll = function() {
  while (selected.length) {
    var id = selected.shift();
    bonzo(document.getElementById(id)).removeClass('selected');
  }
}

var cardsMatch = function(deck) {
  var checkMatch = function(index) {
    var match = (
        deck[0][index] === deck[1][index] &&
        deck[0][index] === deck[2][index])
    || (
        deck[0][index] !== deck[1][index] &&
        deck[0][index] !== deck[2][index] &&
        deck[1][index] !== deck[2][index]);
    return match;
  }

  return checkMatch(0) && checkMatch(1) && checkMatch(2) && checkMatch(3);
}

var setExists = function() {
  console.log(in_play.length);
  console.log(in_play);
  for (var i = 0; i < in_play.length; i++) {
    for (var j = 0; j < in_play.length; j++) {
      if (i == j) continue;
      for (var k = 0; k < in_play.length; k++) {
        if (i == k || j == k) continue;
        if (cardsMatch([in_play[i].id, in_play[j].id, in_play[k].id])) {
          //return [in_play[i].id, in_play[j].id, in_play[k].id];
          return [
            printCard(in_play[i]), 
            printCard(in_play[j]),
            printCard(in_play[k])];
        }
      }
    }
  }
  return false;
}

var checkForSet = function() {
  if (!cardsMatch(selected)) {
    deselectAll();
    return;
  }

  while (selected.length) {
    var id = selected.shift();
    bonzo(document.getElementById(id)).remove();
    for (var i = 0; i < in_play.length; i++) {
      if (in_play[i].id === id) {
        in_play.splice(i, 1);
        break;
      }
    }
  }

  deal();
}

var selectCard = function(ev, id) {
  if (selected.indexOf(id) != -1) {
    for (var i = selected.indexOf(id); i < selected.length - 1; i++) {
      selected[i] = selected[i+1];
    }

    selected.pop();
    bonzo(document.getElementById(id)).removeClass('selected');
    return true;
  }

  for (var i = 0; i < selected.length; i++) {
    if (selected[i] == id) {
      
    }
  }
  if (selected.length >= 3) {
    var oldId = selected.shift();
    bonzo(document.getElementById(oldId)).removeClass('selected');
  }

  selected.push(id);
  bonzo(document.getElementById(id)).addClass('selected');

  if (selected.length == 3) checkForSet();
}

var cardDiv = function(card) {
  var div = document.createElement('div');

  $(div).addClass('card');
  $(div).attr('id', card.id);

  // For vertical centering.
  var inner = document.createElement('div');
  for (var i = 0; i <= card.number; i++) {
    $(inner).append(drawCard(card));
  }
  $(div).append(inner);
  $(div).click(selectCard, card.id);

  return div;
}

var genCards = function() {
  var i = 0;
  for (var shape = 0; shape < 3; shape++) {
    for (var color = 0; color < 3; color++) {
      for (var fill = 0; fill < 3; fill++) {
        for (var number = 0; number < 3; number++) {
          deck[i] = {
            'shape':  shape,
            'color':  color,
            'fill':   fill,
            'number': number,
            'selected': false,
          };

          deck[i]['id'] = cardId(deck[i]);
          deck[i]['name'] = printCard(deck[i]);

          i++;
        }
      }
    }
  }

  var i, j, t;
  for (i = 1; i < deck.length; i++) {
    j = Math.floor(Math.random()*(1+i));
    if (j != i) {
      t = deck[i];
      deck[i] = deck[j];
      deck[j] = t;
    }
  }
};

var deal = function() {
  for (var i = 0; i < 12; i++) {
    if (!in_play[i] && deck.length) {
      in_play[i] = deck.pop();
      $('#mat').append(cardDiv(in_play[i]));
    }
  }

  console.log(setExists());
};

var printInPlay = function() {
  for (var i = 0; i < in_play.length; i++) {
    console.log(printCard(in_play[i]));
  }
}

$.domReady(function() {
  genCards();
  deal();
});
