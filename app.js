const express = require("express");
const cors = require('cors');
const app = express();
require("dotenv").config();
const routes = require("./routes/tasks.js");
const port = 4000;
const connectDB = require("./db/connect.js");

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cors());
// route
// app.get('/', (req, res) => {
//     res.send("Task Manager");
// });

app.use("/api/v1/tasks", routes);

// app.get('/api/v1/tasks) -Get all tasks
// app.post('/api/v1/tasks) - Create new task
// app.get('/api/v1/tasks/:id) - Get single task
// app.patch('/api/v1/tasks/:id) - Update task
// app.delete('/api/v1/tasks/:id) - Delete task
const PORT = process.env.PORT;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Example app listening `)
    );
  } catch (error) {
    console.log(error);
  }
};
start();