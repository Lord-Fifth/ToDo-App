let express = require("express")
let mongodb = require("mongodb")

let app = express()
let path = require("path");
let db

let connectionString = "mongodb+srv://aditya:qwerty123@cluster0-zutjj.mongodb.net/TodoApp?retryWrites=true&w=majority"
mongodb.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
    db = client.db()
    app.listen(3000)
})

app.use(express.urlencoded({ extended: false }))

// viewed at http://localhost:3000
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
})

app.post("/create-item", function(req, res) {
    db.collection("items").insertOne({ text: req.body.item }, function() {
        res.send("Thanks for submitting this form")
    })
})