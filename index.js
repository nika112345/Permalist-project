import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";
const app = express();
const port = 3000;
env.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const db = new pg.Client({
  user: process.env.pg_user,
  host: process.env.pg_host,
  database: process.env.pg_database,
  password: process.env.pg_password,
  port: process.env.pg_port,
});
db.connect();

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];


app.get("/",async (req, res) => {
  const result = await db.query("select * from items order by id ASC");
  items = result.rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
   db.query("insert into items (title) values ($1)",[
    item
   ])
  res.redirect("/");
});

app.post("/edit", (req, res) => {
const item_id = req.body.updatedItemId;
const title = req.body.updatedItemTitle;
db.query("update items set title = $1 where id = $2 ",[
title,item_id
]);
res.redirect("/")
});

app.post("/delete", (req, res) => {
  const item_id = req.body.deleteItemId;
  db.query("delete from items where id = $1",[
    item_id
  ])
  res.redirect("/")
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
