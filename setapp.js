var bean = require('bean');
var bonzo = require('bonzo');

var deck = new Array(81);
var in_play = new Array(12);
var selected = new Array();
var groups = 0;

var updateStats = function() {
  $('#sets').text('Groups: ' + groups);
  $('#left').text('Deck: ' + deck.length);
  $('#time').text('');
}

var cardId = function(card) {
  return '' + card.number + card.fill + card.color + card.shape;
}

var deselectAll = function() {
  while (selected.length) {
    var id = selected.shift();
    bonzo(document.getElementById(id)).removeClass('selected');
    bonzo(document.getElementById(id)).addClass('incorrect');
    setTimeout(function(removeid) {
      bonzo(document.getElementById(removeid)).removeClass('incorrect');
    }, 500, id);
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
  for (var i = 0; i < in_play.length; i++) {
    for (var j = 0; j < in_play.length; j++) {
      if (i == j) continue;
      for (var k = 0; k < in_play.length; k++) {
        if (i == k || j == k) continue;
        if (cardsMatch([in_play[i].id, in_play[j].id, in_play[k].id])) {
          return [in_play[i].id, in_play[j].id, in_play[k].id];
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

  groups++;

  while (selected.length) {
    var id = selected.shift();
    bonzo(document.getElementById(id)).remove();
    for (var i = 0; i < in_play.length; i++) {
      if (in_play[i] && in_play[i].id === id) {
        in_play[i] = undefined;
        break;
      }
    }
  }

  if (in_play.length == 15) {
    // Compact to the standard 12 squares
    var overIndex = 0;
    var overflows = in_play.splice(12, 3);
    for (var i = 0; i < in_play.length; i++) {
      if (!in_play[i]) {
        while (!in_play[i]) {
          overIndex++;
          in_play[i] = overflows.shift();
        }

        bonzo(document.getElementById(in_play[i].id)).remove();
        bonzo(document.getElementById('card' + i)).append(cardDiv(in_play[i]));
      }
    }
  } else {
    deal();
  }
}

var selectCard = function(ev, id) {
  bonzo(document.getElementById(id)).removeClass('cheat');

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
      $(document.getElementById('card' + i)).append(cardDiv(in_play[i]));
    }
  }

  setTimeout(function() {
    var goodDeal = setExists();
    if (!goodDeal) {
      for (var i = 12; i < 15; i++) {
        in_play[i] = deck.pop();
        $(document.getElementById('over' + (i - 12))).append(cardDiv(in_play[i]));
      }
    }

    updateStats();
  }, 0);
};

var cheat = function() {
  var set = setExists();
  console.log(set);
  for (var i = 0; i < set.length; i++) {
    $('#' + set[i]).addClass('cheat');
  }
}

var printInPlay = function() {
  for (var i = 0; i < in_play.length; i++) {
    console.log(printCard(in_play[i]));
  }
}

$.domReady(function() {
  $('#hint').click(cheat);
  genCards();
  deal();
});
