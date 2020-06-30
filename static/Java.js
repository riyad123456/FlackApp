document.addEventListener('DOMContentLoaded',()=>{
    var socket = io.connect('http://127.0.0.1:5000');
    socket.on('connect',()=>{
      document.querySelector("#create-channel-button").onclick= ()=>{
        const NewChannel = document.querySelector("#channel-input").value;
        socket.emit("channel created",{"channel_name":NewChannel});
        document.querySelector("#channel-input").value="";
        socket.emit("joined");
        alert("/channel/"+`${NewChannel}`);
      };
    });

      socket.on("announce channel", data =>{
            const li = document.createElement("p");
            li.innerHTML= `${data.channel_name}`;
            li.class="dropdown-item";
            const link= document.createElement("a");
            link.href="/channel/"+`${data.channel_name}`;
            link.append(li);
            document.querySelector(".channels-box").append(link);
            return false;
    });

  });
