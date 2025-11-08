import express from "express"


const app = express();

app.get("/", (req, res)=>{
    res.json({
        message: "hello user"
    })
})

app.listen(3000);

