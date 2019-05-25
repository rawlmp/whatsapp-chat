var express = require("express");
var mongoose = require("mongoose");
var app = express();
var bodyParser = require("body-parser");
var server = app.listen(3000);
var io = require("socket.io")(server);

var dbUrl = "mongodb://raul:8deFebrero@ds261136.mlab.com:61136/chatnode";
var Message = mongoose.model("Message", {
  name: String,
  message: String,
  time: String
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname));

app.get("/messages", (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  });
});

app.post("/messages", (req, res) => {
  var message = new Message(req.body);
  message.save(err => {
    if (err) sendStatus(500);
    io.emit("message", req.body);
    res.sendStatus(200);
  });
});

mongoose.connect(dbUrl, { useNewUrlParser: true }, err => {
  console.log("mongodb connected");
});

io.on("connection", socket => {
  socket.join("ubiqum");
  io.emit("user", io.sockets.adapter.rooms["ubiqum"].length);

  socket.on("disconnect", () => {
    io.emit("exit", io.sockets.adapter.rooms["ubiqum"].length);
  });
});
