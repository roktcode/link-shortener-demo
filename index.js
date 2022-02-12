import express from "express";
import mongoose from "mongoose";
import ShortUrl from "./models/shortUrl.js";

mongoose.connect("mongodb://127.0.0.1:27017/urlShortener");

const app = express();
const PORT = process.env.PORT || 5000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const urls = await ShortUrl.find();
  res.render("index", { shortUrls: urls });
});

app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const url = await ShortUrl.findOne({ short: req.params.shortUrl });

  if (!url) return res.sendStatus(404);

  url.clicks++;
  await url.save();

  res.redirect(url.full);
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:5000/`);
});
