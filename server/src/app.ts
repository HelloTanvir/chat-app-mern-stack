// external imports
import cookiePraser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import http from "http";
import mongoose from "mongoose";
import path from "path";
import { Server } from "socket.io";
import errorHandler from "./middleware/errorHandler";
// internal imports
import authRoute from "./routes/authRoute";
import inboxRoute from "./routes/inboxRoute";

// initialize app
const app: Application = express();
const server = http.createServer(app);
dotenv.config();

// socket creation
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

(global as any).io = io;

// connect to db
if (process.env.MONGO_URL) {
  mongoose.connect(process.env.MONGO_URL);
  // mongoose.connect(process.env.MONGO_URL, {
  //   useNewUrlParser: true,
  //   useCreateIndex: true,
  //   useFindAndModify: false,
  //   useUnifiedTopology: true,
  // });
}

// body and cookie parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiePraser());

// prevent cors issue
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// mount routes
app.use("/auth", authRoute);
app.use("/inbox", inboxRoute);

// -------- delployment --------

__dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
  // set static folder
  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get('*', (req: Request, res: Response) => {
    (res as any).sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  })
} else {
  app.get('/', (req: Request, res: Response) => {
    res.json({
      success: true
    })
  })
}

// -------- delployment --------

// handle errors
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`app is running on port: ${PORT}`);
});

// process.on('unhandledRejection', (err) => {
//     console.log(`Error: ${err.message}`);
//     // close server and exit process
//     app.close(() => process.exit(1));
// });
