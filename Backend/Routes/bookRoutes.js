const controller = require("../Controllers/bookControllers");
const express = require("express");
const route = express.Router();
route.get("/GetBook",controller.getBook)
.post("/PostBook",controller.postBook);
route.put("/UpdateBook/:name",controller.putBook);
route.delete("/DeleteBook/:name", controller.deleteBook);
module.exports = route;