// Viewed at http://localhost:3000
let express = require("express")
let mongodb = require("mongodb")
let sanitizeHTML = require("sanitize-html")

let app = express()
let db

//Loading browser.js
app.use(express.static("public"))

//Connecting to a Mongo Database
let connectionString = "mongodb+srv://aditya:qwerty123@cluster0-zutjj.mongodb.net/TodoApp?retryWrites=true&w=majority"
mongodb.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
    db = client.db()
    app.listen(3000)
})

//Automatically take asynchronous requests
app.use(express.json())

//Automatically take form data
app.use(express.urlencoded({ extended: false }))

//Password protection
function passwordProtected(req, res, next) {
    res.set("WWW-Authenticate", "Basic realm='Simple Todo App'")
    console.log(req.headers.authorization)
    if (req.headers.authorization == "Basic YWRpdHlhOnF3ZXJ0eTEyMw==") {
        next()
    } else {
        res.status(401).send("Authentication required")
    }
}

app.use(passwordProtected)

//Read Homepage
app.get("/", function(req, res) {

    //Reading items from MongoDB collection
    db.collection("items").find().toArray(function(err, items) {
        res.send(`        
                    <!DOCTYPE html>
                    <html>

                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Simple To-Do App</title>
                        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
                    </head>

                    <body>
                        <div class="container">
                            <h1 class="display-4 text-center py-1">To-Do App</h1>

                            <div class="jumbotron p-3 shadow-sm">
                                <form id="create-form" action="/create-item" method="POST">
                                    <div class="d-flex align-items-center">
                                        <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                                        <button class="btn btn-primary">Add New Item</button>
                                    </div>
                                </form>
                            </div>

                            <ul id="item-list" class="list-group pb-5">
                            
                            </ul>

                        </div>
                                
                        <script>
                                let items = ${JSON.stringify(items)}
                        </script>

                        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
                        <script src="/browser.js"></script>
                    </body>

                    </html>
                    `)
    })
})

//Creating items in the MongoDB collection
app.post("/create-item", function(req, res) {

    //Protect website
    let safeText = sanitizeHTML(req.body.text, { allowedTags: [], allowedAttributes: {} })

    db.collection("items").insertOne({ text: safeText }, function(err, info) {
        res.json(info.ops[0])
    })
})

//Updating items in the MongoDB collection
app.post("/update-item", function(req, res) {

    //Protect website
    let safeText = sanitizeHTML(req.body.text, { allowedTags: [], allowedAttributes: {} })

    //Send updated data to MongoDB collection
    db.collection("items").findOneAndUpdate({ _id: new mongodb.ObjectId(req.body.id) }, { $set: { text: safeText } }, function() {
        res.send("Success")
    })
})

//Deleting items in the MongoDB collection
app.post("/delete-item", function(req, res) {

    //Delete data in MongoDB collection
    db.collection("items").deleteOne({ _id: new mongodb.ObjectId(req.body.id) }, function() {
        res.send("Success")
    })
})