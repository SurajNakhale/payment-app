import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

export const authMiddleware = async (req, res, next) => {
    const headers = req.headers.Authorization;

    const token = headers.spli(" ")[1];

    try{
        const decoded = jwt.verify(token , JWT_SECRET);
        if(!decoded){
            return res.status(403).json({
                message: "error",
            })
        }

        req.userId = decoded.userId;
        next();

    }
    catch(err){


    }
}