const { Telegraf } = require("telegraf");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const ManuscriptSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});
const Manuscript = mongoose.model("Manuscript", ManuscriptSchema);

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply("Hello! 👋 Press the button to open the To-Do WebApp", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Open",
            web_app: {
              url: process.env.WEB_APP_URL,
            },
          },
        ],
      ],
    },
  });
});

bot.on("text", (ctx) => {
  if (ctx.message.text !== "/start") {
    ctx.reply("Invalid command. Use /start to open the WebApp.");
  }
});

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("To-Do API is running!");
});

app.get("/tasks", async (req, res) => {
  const manuscripts = await Manuscript.find();
  res.json(manuscripts);
});

app.post("/tasks", async (req, res) => {
  const newManuscript = new Manuscript({
    text: req.body.text,
    completed: false,
  });
  await newManuscript.save();
  res.json(newManuscript);
});

app.put("/tasks/:id", async (req, res) => {
  const updateData = {};
  if (typeof req.body.completed === "boolean") updateData.completed = req.body.completed;
  if (typeof req.body.text === "string" && req.body.text.trim() !== "")
    updateData.text = req.body.text.trim();

  const manuscript = await Manuscript.findByIdAndUpdate(req.params.id, updateData, { new: true });
  res.json(manuscript);
});

app.delete("/tasks/:id", async (req, res) => {
  await Manuscript.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.delete("/tasks", async (req, res) => {
  await Manuscript.deleteMany({});
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

bot.launch()
  .then(() => console.log("Bot launched successfully"))
  .catch((err) => console.error("Bot launch error:", err));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
