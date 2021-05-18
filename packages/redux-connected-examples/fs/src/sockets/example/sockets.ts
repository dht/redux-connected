const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.get("/", (req: any, res: any) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket: any) => {
  console.log("a user connected");

  socket.on("chat message", (msg: string) => {
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
http.listen(3000, () => {
  console.log("listening on *:3000");
});
