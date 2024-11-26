const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render('index', { title: 'Home Page' });
})

mongoose
  .connect("mongodb+srv://oleh:360940@nodetuts.zfvbxj8.mongodb.net/photoApp?retryWrites=true&w=majority&appName=nodetuts",)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.render('index', { title: 'Home Page' });
})
app.listen(port, () => console.log(`Server running on port ${port}`));