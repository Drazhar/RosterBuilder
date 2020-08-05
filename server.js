// Imports
const express = require("express");
const { Worker, workerData } = require("worker_threads");

// Basic settings
const app = express();
const port = 3000;

// Static routes
app.use(express.static("static"));

// Middleware
app.use(express.json({ limit: "500kb" }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Send HTML files
app.get("/", (req, res) => res.sendFile("index.html"));

// APIs
app.post("/api/createSchedule", (req, res) => {
  const myWorker = new Worker("./src/worker/scheduler.js", {
    workerData: req.body,
  });
  myWorker.on("message", (result) =>
    res.json({
      status: "success",
      result,
    })
  );
  myWorker.on("error", (error) =>
    res.status(500).json({
      status: "failed",
      result: [],
    })
  );
});

// Route everything else to the root
app.get("*", (req, res) => {
  res.redirect("/");
});

// listen to something
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
