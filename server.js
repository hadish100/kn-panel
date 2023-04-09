const app = require('express')();

app.post("/post", (req, res) => 
{
console.log("Connected !");
res.redirect("/");
});

app.listen(5000);