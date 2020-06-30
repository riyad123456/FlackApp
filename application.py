import os

from flask import Flask
from flask_socketio import SocketIO, emit,join_room, leave_room, send
from flask import Flask, session,render_template,request,redirect,url_for,Markup
from flask_session import Session
from helpers import login_required
from collections import deque
app = Flask(__name__)
app.config["SECRET_KEY"] = "my secret key"
socketio = SocketIO(app)
channelsCreated = []

usersLogged = []

channelsMessages = dict()
@app.route("/")
def index():
    return render_template("layout.html")
@app.route("/channel",methods=["POST","GET"])

def usersession():
        session.clear()
        display_name= request.form.get("display-name")
        if display_name in usersLogged :
            return render_template("errorlayout.html")
        usersLogged.append(display_name)
        session['username'] = display_name
        # Remember the user session on a cookie if the browser is closed.
        session.permanent = True
        channels=[]
        return render_template("join.html",channels=channelsCreated,username=session["username"])
@socketio.on("channel created")
def createchannel(data):
    newchannel = data["channel_name"]
    if newchannel in channelsCreated:
        return redirect("/channel")
    channelsCreated.append(newchannel)
    session["current channel"] = newchannel
    channelsMessages[newchannel]=[]
    emit("announce channel",{"channel_name":newchannel},broadcast=True)
@app.route("/logout",methods=["GET"])
def logout():
    try:
        usersLogged.remove(session['username'])
    except ValueError:
        pass
    session.clear()
    return redirect("/")
@app.route("/channel/<channel>",methods=["GET","POST"])
def enterchannel(channel):
    session['current_channel'] = channel
    return render_template("channel.html",channels=channelsCreated,channeltitle=session.get('current_channel'),messages=channelsMessages[channel],id=session.get("username"))
@socketio.on("joined",namespace='/')
def join():
    room = session.get("current_channel")
    join_room(room)
    emit('joining',
    {"channel": room,
    "username":session.get("username"),
    "msg":session.get("username")+" has joined the channel"},
    room=room
    )
@socketio.on('left', namespace='/')
def leave():
    room = session.get("current_channel")
    print(session.get("username"))
    emit('leaving',
    {'channel': room,
    'username':session.get('username'),
    'msg':session.get('username')+" has left the channel"},
    room=room
    )
@socketio.on('send message')
def sendmsg(msg,timestamp):
    room = session.get('current_channel')
    channelsMessages[room].append([timestamp, session.get('username'), msg])
    socketio.send({
        "username":session.get('username'),
        "timestamp":timestamp,
        "msg":msg,
        "room":room}
        )

if __name__ == '__main__':
	socketio.run(app)
