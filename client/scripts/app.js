var app = {};

$(document).ready(function() {
  var message = {
    username: "hsadwa",
    text: "trolo",
    roomname: "4chan"
  };
  // YOUR CODE HERE:
  app.init = function() {
    $( "#target" ).submit(function(event) {
      app.renderMessage();
      event.preventDefault(); 
    });
  };

  app.renderMessage = function() {
    message.text = $('#textBox').val();
    $('#chats').prepend(createDiv(message));
  };

  app.renderRoom = function (roomName) {
    $('#roomSelect').prepend($('<option>' + roomName + '</option'));
  };

  app.clearMessages = function() {
    $("#chats").empty();
  }

  app.send = function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        data.username = message.username;
        data.text = message.text;
        data.roomname = message.roomname;
        console.log(data);
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  };

  app.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
  app.fetch = function() {
    $.ajax({
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'GET',
      contentType: 'application/json',
      data: {order: '-createdAt'},
      dataType: 'json',
      success: function (data) {
        var messages = data.results;
        for (var i = 0; i < messages.length; i++) {
          $('#chats').append(createDiv(messages[i]));
          if ($.contains($('#roomSelect'), $('<option>' + messages[i].roomname + '</option>'))) {
            app.renderRoom(messages[i].roomname);         
          }
        }
      },
      error: function (data) {
        console.error('chatterbox: Failed to retrieve message', data);
      }
    });
  };

  //create a function that displays messages retrieved from parse server
  $('.display').on('click', function() {
    // trigger the ajax method to retrieve messages
    var tempDiv = $('<div>');
    var callResult = app.fetch();
  });

  $('.clear').on('click', function() {
    app.clearMessages();
  });

  app.init();
});

var parseString = function (obj) { // takes in a obj
  //takes in an obj with name id etc
  //check the .text key to see if it's value contains <script>
  //if so skip or return "bad input"
  //else just pass it into our messages.
  var keys = Object.keys(obj);
  var text;
  for (var i = 0; i < keys.length; i++) {
    if (keys[i].includes('<script>')) {
      return 'bad input';
    } else {
    // debugger;
      text = JSON.stringify(obj.username) + '\n' + JSON.stringify(obj.createdAt) + '\n' + JSON.stringify(obj.text) + '\n' + "room: " + JSON.stringify(obj.roomname);
    }
  }
  return text;
};

var createDiv = function(obj) {
  var text = $('<div class="individualMessages">').text(parseString(obj));
  return text;
};
