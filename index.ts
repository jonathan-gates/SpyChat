import express from "express";
import { engine } from "express-handlebars";
import { createServer } from "http";
import { Server } from "socket.io";
import fs from "fs";
const DEBUG = process.env.NODE_ENV !== "production";
const MANIFEST: Record<string, any> = DEBUG
  ? {}
  : JSON.parse(fs.readFileSync("static/.vite/manifest.json").toString());

const app = express();
const server = createServer(app);
const io = new Server(server);
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

if (!DEBUG) {
  app.use(express.static("static"));
} else {
  app.use((req, res, next) => {
    if (req.url.includes(".")) {
      res.redirect(`http://localhost:5173${req.url}`);
    } else {
      next();
    }
  });
}

console.log(MANIFEST);
app.get("/", (req, res) => {
  res.render("index", {
    debug: DEBUG,
    jsBundle: DEBUG ? "" : MANIFEST["src/main.jsx"]["file"],
    cssBundle: DEBUG ? "" : MANIFEST["src/main.jsx"]["css"][0],
    layout: false,
  });
});

io.on("connection", (socket) => {
  socket.on("send_message", (data) => {
    io.emit("receive_message", { ...data, id: socket.id });
  });
});

server.listen(3000, () => {
  console.log("Listening on port 3000...");
});
