const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { connectDB } = require("./src/utility/dB.connection");
const { authRouter } = require("./src/routes/auth-routes");
const { startupProfileRouter } = require("./src/routes/start-up-profile-route");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());
connectDB();

app.use("/users", authRouter);
app.use("/startupProfile", startupProfileRouter);

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);
  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
