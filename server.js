let express = require("express")
let app = express()
let path = require("path");
app.use(express.urlencoded({ extended: false }))

// viewed at http://localhost:3000
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
})

app.post("/create-item", function(req, res) {
    console.log(req.body.item)
    res.send("Thanks for submitting this form")
})

app.listen(3000)