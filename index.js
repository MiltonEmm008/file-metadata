var express = require("express");
var cors = require("cors");
require("dotenv").config();

const fs = require("fs");
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const multer = require("multer");
const upload = multer({ dest: "uploads" });

var app = express();

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/fileanalyse", upload.single("upfile"), async (req, res) => {
  if (!req.file) {
    return res.json({ error: "you need to provide a file" });
  }
  const fileInfo = {
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
  };

  res.json(fileInfo);

  fs.unlink(req.file.path, (err) => {
    if (err) console.error("Error deleting file:", err);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
