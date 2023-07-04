const app = require('express')();
const { json } = require('body-parser');

app.use(json());



app.post("/test", (req, res) => 
{
    console.log(req.body)
})

app.listen(5000, () => 
{
    console.log("--------------");
    console.log("SERVER STARTED !");
    console.log("--------------");
})