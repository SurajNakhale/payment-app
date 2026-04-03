import express from "express";
import z, { jwt } from "zod";
import { Account, User } from "../db";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "../config";
import { authMiddleware } from "../middleware";

const userRouter = express();

const signupSchema = z.object({
    username: z.email(),
    password: z.string(),
    firstname: z.string(),
    lastname: z.string()
})


userRouter.post("/signup", async(req, res) => {
    const result = signupSchema.safeParse(req.body);

    if (!result.success) {
            return res.status(400).json({
            message: result.error
        });
    }

    const {username, password, lastname, firstname} = result.data;

    try{
        const existinguser = await User.findOne({ username });
        if(existinguser){
            return res.status(411).json({
                message: "already exists"
            })
        }

        const hashpass = await bcrypt.hash(password, 10);

        let user = await User.create({
            username,
            firstname,
            lastname,
            password: hashpass
        })

        const userId = user._id;

        await Account.create({
            owner: userId,
            balance: Math.floor(100 + Math.random() * 1000)
        });
        

        const token = jwt.sign({
            userId: userId
        }, JWT_SECRET);

        res.status(200).json({
            message: "User created successfully",
            token: token
        })


    }catch(err){

    }

})

userRouter.post("/signin", async(req, res) => {
    const {username, password} = req.body;

    try{
        const user = await User.findOne({ username });
        if(!user){
            return res.status(411).json({
	            message: "Error while logging in"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(411).json({
	            message: "Error while logging in"
            })
        }

        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        res.status(200).json({
            message: "success",
            token: token
        })

    }
    catch(err){

    }
})

const updatedSchema = z.object({
    password: z.string().optional(),
    lastname: z.string().optional(),
    firstname: z.string().optional()

})
userRouter.put("/", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const result  = updatedSchema.safeParse(req.body);

    if(!result.success){
        return res.json({
            message: "invalid input",
        })
    }

    const data = result.data;

    const update = await User.updateOne({ _id: userId }, 
        {$set: data}
    );

    if (update.modifiedCount === 0) {
        return res.json({
            message: "No changes made"
        });
    }

    res.json({
        message: "updated successfully"
    })

})

userRouter.get("/bulk", authMiddleware, async(req, res) => {
    const { filter } = req.query;
    const userId = req.userId;

    try{
        const users = await User.find({
            $or: [
                {firstname: {$regex: filter, $options: "i"}},
                {lastname: {$regex: filter, $options: "i"}}
            ]
        })

        if (!users) {
            return res.json({
                message: "does not exists"
            })
        }

        res.json({
            user: users.map(x => ({
                firstname: x.firstname,
                lastname: x.lastname,
                username: x.username,
                id: x._id
            }))
        })
    }
    catch(err){

    }

})


export default userRouter;