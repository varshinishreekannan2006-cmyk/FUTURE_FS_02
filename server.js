const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.static("public"));

const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS candidates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      phone TEXT,
      degree TEXT,
      cgpa REAL,
      skills TEXT,
      role TEXT,
      status TEXT
    )
  `);
});

app.get("/", (req, res) => {
  res.send("Recruitment CRM Database Connected");
});

app.use(express.json());

app.post("/addCandidate", (req, res) => {

    const { name, email, phone, status } = req.body;

    console.log("STATUS =", status);
    console.log("BODY =", req.body);

    db.run(
        "INSERT INTO candidates(name,email,phone,status) VALUES(?,?,?,?)",
        [name, email, phone, status],
        (err) => {
            if(err){
                console.log(err);
                res.send("Error");
            }
            else{
                res.send("Candidate Added Successfully");
            }
        }
    );
});

app.get("/candidates", (req, res) => {

    db.all("SELECT * FROM candidates", [], (err, rows) => {

        if(err){
            res.json([]);
        }
        else{
            res.json(rows);
        }

    });

});

app.put("/updateStatus/:id", (req, res) => {

    const { status } = req.body;

    db.run(
        "UPDATE candidates SET status=? WHERE id=?",
        [status, req.params.id],
        (err) => {
            if(err){
                res.send("Error");
            }else{
                res.send("Status Updated");
            }
        }
    );

});

app.delete("/deleteCandidate/:id", (req, res) => {

    db.run(
        "DELETE FROM candidates WHERE id=?",
        [req.params.id],
        (err) => {

            if(err){
                res.send("Error");
            }
            else{
                res.send("Candidate Deleted");
            }

        }
    );

});

app.listen(3000, () => {
  console.log("Server Started");
});