const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { connectDB } = require("./src/utility/dB.connection");
const { authRouter } = require("./src/routes/auth-routes");
const { startupProfileRouter } = require("./src/routes/start-up-profile-route");
const {
  investmentOfferRouter,
} = require("./src/routes/investment-offer-route");
const { chatRouter } = require("./src/routes/chat-routes");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const corsOptions = {
  origin: "*", // Or specify your client URL for better security
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers",
    "X-CSRF-Token",
    "X-API-Key",
  ],
  exposedHeaders: ["Content-Length", "X-Request-ID", "X-Response-Time"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("/", cors(corsOptions));
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());
connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to the Investment Platform API");
});
app.use("/users", authRouter);
app.use("/startupProfile", startupProfileRouter);
app.use("/investment-offers", investmentOfferRouter);
app.use("/pitchRoom", chatRouter);

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  // Handle "join" event: Let the user join a chat room based on pitchRoom._id
  socket.on("join", (roomId) => {
    console.log(`User ${socket.id} joined room: ${roomId}`);
    socket.join(roomId); // Join the room based on the pitchRoom._id
  });

  // Handle "newMessage" event: Broadcast message to room
  socket.on("newMessage", (message, roomId) => {
    console.log(`New message from ${socket.id} in room: ${roomId}`);
    // Emit message to the room
    io.to(roomId).emit("newMessage", message);
  });

  socket.on("leave", (roomId, user) => {
    socket.leave(roomId);
    socket.to(roomId).emit("userDisconnected", user._id, user.name);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });

  socket.on("error", (err) => {
    console.error("Socket error caught:", err);
    socket.emit("errorOccurred", {
      message: "An unexpected error occurred.",
    });
  });
});

//error handling
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // Optional: exit process, restart, or alert monitoring
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
