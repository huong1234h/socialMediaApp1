import cookieParser from "cookie-parser"; //
import cors from "cors"; //
import 'dotenv/config';
import express from "express";
import multer from "multer"; //
import { db } from "./connect.js";
import authRoutes from "./routes/auth.js";
import commentRoutes from "./routes/comments.js";
import conversationRoutes from "./routes/conversations.js";
import likeRoutes from "./routes/likes.js";
import messageRoutes from "./routes/messages.js";
import notificationRoutes from "./routes/notifications.js";
import postRoutes from "./routes/posts.js";
import relationshipRoutes from "./routes/relationships.js";
import storiesRoutes from "./routes/stories.js";
import userRoutes from "./routes/users.js";

console.log(process.env);
const app = express();

db.connect(function(err){
  if(err) throw err;
  console.log("Connected!");
})


//middlewares
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(
  cors({
    origin: process.env.URL_REACT,
  })
);
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});


const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  console.log(req);

  const file = req.file;
  console.log(file);
  res.status(200).json(file.filename);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/stories",storiesRoutes);
app.use("/api/messages",messageRoutes);
app.use("/api/conversations",conversationRoutes);
app.use("/api/notifications",notificationRoutes);

app.listen(process.env.PORT, () => {
  console.log("API working!");
});
