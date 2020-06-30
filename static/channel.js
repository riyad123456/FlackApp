document.addEventListener('DOMContentLoaded',()=>{
    var socket = io.connect('http://127.0.0.1:5000');
    socket.on('connect',()=>{
      socket.emit('joined');

        document.getElementById("logout").addEventListener("click", () => {
            localStorage.clear();
            window.location.replace("/");
          });
        document.getElementById("leave").addEventListener("click", () => {
            localStorage.removeItem("last-channel");
            socket.emit('left');
            window.location.replace("/channel");
        });
        document.getElementById("join").addEventListener("click", () => {
            socket.emit('joined');

        });
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


      socket.on('joining',data =>{
        localStorage.setItem("last-channel",data.channel);
        if(localStorage.getItem("last-channel")==data.channel){
          let row = '<' + `${data.msg}` + '>';
          document.querySelector("#chat").value+= row + "\n";
        } else{
          return false;
        }

      });
      socket.on('leaving',data =>{
        alert("dezt");
        let row = '<' + `${data.msg}` + '>';
        document.querySelector("#chat").value+= row + "\n";
        window.location.replace("/channel");
      });
      socket.on("message", data =>{
          if(localStorage.getItem("last-channel")==data.room){
          let row = '<' + `${data.timestamp}` + '> - ' + '[' + `${data.username}` + ']:  ' + `${data.msg}`;
          document.querySelector("#chat").value+= row + "\n";
        } else{
          return false;
        }
      });

    });
