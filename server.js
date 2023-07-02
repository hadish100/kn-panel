const app = require('express')()
const { json } = require('body-parser')

app.use(json())

const data = {
    name: "!!!!!!!!!",
    email: "***********"
}

app.post("/test", (req, res) => {
    console.log(req.body)
    res.send(data)
})

app.listen(5000, () => {
    console.log("Server is listening on port 5000")
})