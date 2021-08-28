"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// external imports
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
// internal imports
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const inboxRoute_1 = __importDefault(require("./routes/inboxRoute"));
// initialize app
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
dotenv_1.default.config();
// socket creation
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
    },
});
global.io = io;
// connect to db
if (process.env.MONGO_URL) {
    mongoose_1.default.connect(process.env.MONGO_URL);
    // mongoose.connect(process.env.MONGO_URL, {
    //   useNewUrlParser: true,
    //   useCreateIndex: true,
    //   useFindAndModify: false,
    //   useUnifiedTopology: true,
    // });
}
// body and cookie parsers
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// prevent cors issue
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
// mount routes
app.use("/auth", authRoute_1.default);
app.use("/inbox", inboxRoute_1.default);
// -------- delployment --------
__dirname = path_1.default.resolve();
if (process.env.NODE_ENV === 'production') {
    // set static folder
    app.use(express_1.default.static(path_1.default.join(__dirname, "/client/build")));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.resolve(__dirname, "client", "build", "index.html"));
    });
}
else {
    app.get('/', (req, res) => {
        res.json({
            success: true
        });
    });
}
// -------- delployment --------
// handle errors
app.use(errorHandler_1.default);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`app is running on port: ${PORT}`);
});
// process.on('unhandledRejection', (err) => {
//     console.log(`Error: ${err.message}`);
//     // close server and exit process
//     app.close(() => process.exit(1));
// });
