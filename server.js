//Dependencies
var express = require("express");
var path = require("path");
var fs = require("fs");
var notes = require("./db/db.json")

//Creates an express server and Sets an Initial Port
var app = express();
var PORT = process.env.PORT || 3000;

//Code for Data parsing and file access
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

currentID = notes.length;

/*Api get Requests-Code that shows content when User visits the page*/
app.get("/api/notes", function (req, res) {
    return res.json(notes);
});
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

/*Binds and listens the Connections on the Port*/
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});

/*Api post Request-Code that pushes new  text Data*/
app.post("/api/notes", function (req, res) {
    var newNote = req.body;
    newNote["id"] = currentID +1;
    currentID++;
    console.log(newNote);
    notes.push(newNote);
    rewriteNotes();
    return res.status(200).end();
});

/*Api Delete request-Filters Data by id and gets the requested data */
app.delete("/api/notes/:id", function (req, res) {
    res.send('Got a DELETE request at /api/notes/:id')
    var id = req.params.id;
    var idLess = notes.filter(function (less) {
        return less.id < id;
    });

    var idGreater = notes.filter(function (greater) {
        return greater.id > id;
    });
    notes = idLess.concat(idGreater);
    rewriteNotes();
})


/*Function to write new data to db.json file*/
function rewriteNotes() {
    fs.writeFile("db/db.json", JSON.stringify(notes), function (err) {
        if (err) {
            console.log("error")
            return console.log(err);
        }

        console.log("SUCCESS!");
    });
}