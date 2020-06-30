document.addEventListener('DOMContentLoaded',()=>{
    var socket = io.connect('http://127.0.0.1:5000');
    socket.on('connect',()=>{
      document.querySelector('#message').addEventListener("keydown", event => {
          if (event.key == "Enter") {
              document.getElementById("send-message").click();
          }

      });
      document.getElementById("send-message").addEventListener("click", () => {
        let timestamp = new Date;
        timestamp = timestamp.toLocaleTimeString();

        let msg= document.getElementById("message").value;
        socket.emit('send message',msg,timestamp);
        document.getElementById("message").value="";
        return false;
        });
      });
      socket.on("message", data =>{
        alert(localStorage.getItem("last-channel"));
        if(localStorage.getItem("last-channel")==data.room){
          let row = '<' + `${data.timestamp}` + '> - ' + '[' + `${data.username}` + ']:  ' + `${data.msg}`;
          document.querySelector("#chat").value+= row + "\n";
          return false;
      }
        else{
          return false;
        }
      });
    });
