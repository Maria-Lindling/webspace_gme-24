function main( event ) {
  window.chatText  = document.getElementById('chat-text');
  window.chatInput = document.getElementById('chat-input');
  window.chatForm  = document.getElementById('chat-form');
  window.socket = io();
  window.typing = false;

  //add a chat cell to our chat list view, and scroll to the bottom
  window.socket.on('addToChat',function(data){
            
    console.log('got a chat message');
    window.chatText.innerHTML += '<div class="chatCell">' + data + '</div>';
    window.chatText.scrollTop = window.chatText.scrollHeight;
            
  });


  window.chatForm.onsubmit = function(e){
    //prevent the form from refreshing the page
    e.preventDefault();
    console.log( window.chatInput.value ) ;
    //call sendMsgToServer socket function, with form text value as argument
    window.socket.emit('sendMsgToServer', window.chatInput.value);
    window.chatInput.value = "";
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('chat-input')
      .addEventListener('focus', function() { window.typing = true; });
    document.getElementById('chat-input')
      .addEventListener('blur', function() { window.typing = false; });
  });

  document.onkeyup = function(event){
    //user pressed and released enter key
    if(event.keyCode === 13){
      if(!typing){
          //user is not already typing, focus our chat text form
          window.chatInput.focus();
      } else {
          //user sent a message, unfocus our chat form 
          window.chatInput.blur();
      }
    }
  }
}