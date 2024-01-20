const express = require('express')
const app = express();
const bodyParser = require("body-parser")
const port = 8080

app.use(bodyParser.json());

app.use("/authors", require("./routes/authors"));
app.use("/books", require("./routes/books"))

app.get("/", (req, res)=>{
    return res.json({message: "This app is running", success: true})
})

app.listen(port, ()=>{
    console.log("The App has started listening.")
})
