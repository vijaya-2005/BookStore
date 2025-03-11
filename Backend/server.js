const express = require("express");
const mongoose = require("mongoose");
const cors =  require("cors");
const route = require("./Routes/bookRoutes");
const app = express();
mongoose.connect("mongodb://localhost:27017/").then(()=>{
    console.log("Connected to DataBase");
});
const port = 3001;
app.use(cors());
app.use(express.json());
app.use("/Home",route);
app.listen(port,()=>{
console.log(`Server running on port : ${port}`);
})

