import express from "express";
import { Account } from "../db";
import { authMiddleware } from "../middleware";
import mongoose from "mongoose";
const accountRouter = express();


accountRouter.get("/balance", authMiddleware, async(req, res) => {
    const userId = req.userId;

    try{
        const account = await Account.findOne({ owner: userId });
        if(!account){
            return res.status(411).json({
                message: "account does not exist for this user"
            })
        }

        res.json({
            message: "your balance: ",
            balance: account.balance
        })
    }catch(err){

    }
})

accountRouter.post("/transfer", authMiddleware, async(req, res) => {
    const { to, amount } = req.body;
    const userId = req.userId;
    const session = await mongoose.startSession();

    try{
        await session.startTransaction();

        const account = await Account.findOne({ owner: userId}).session(session);
        if(!account || account.balance < amount){
            await session.abortTransaction();
            return res.status(404).json({
                message: "insufficient balance"
            })
        }

        const toaccount = await Account.findOne({ _id: to}).session(session)
        if (!toaccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid account"
            });
        }

        await Account.updateOne(
            { owner: userId },
            {$inc: {balance: -amount}}).session(session);
        
        await Account.updateOne(
            { owner: to}, 
            {$inc: {balance: amount}}).session(session);


        await session.commitTransaction();
        
        
        res.json({
            message: "Transfer successful"
        });

    }catch(err){

        res.json({
            error: err.message
        })
        await session.abortTransaction();
    }
})

export default accountRouter;