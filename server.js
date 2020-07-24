// Imports
const express = require("express");
const { Worker, workerData } = require("worker_threads");

// Basic settings
const app = express();
const port = 3000;

// Static routes
app.use(express.static("public"));

// Middleware
app.use(express.json({ limit: "200kb" }));

// Send HTML files
app.get("/", (req, res) => res.sendFile("index.html"));

// APIs
app.post("/api/createSchedule", (req, res) => {
  const myWorker = new Worker("./src/worker/scheduler.js", {
    workerData: {
      iterations: req.body.iterations,
    },
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
  //myWorker.on("exit", (code) => console.log(code));
});

// listen to something
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
