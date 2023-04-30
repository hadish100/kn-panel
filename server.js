const app = require('express')()
const bodyParser = require("body-parser")
app.use(bodyParser.json())

console.log("Server start")

const data = {
    name: "!!!!!!!!!",
    email: "***********"
}

app.post("/post", (req, res) => {
    console.log("Connected !")
    res.redirect("/")
})

app.post("/test", (req, res) => {
    console.log(req.body)
    res.send(data)
})

app.listen(5000)