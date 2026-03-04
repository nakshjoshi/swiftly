import type { NextFunction, Request, RequestHandler, Response } from "express";

const asyncHandler = (fn:RequestHandler)=>{

    return (req:Request, res:Response, next:NextFunction):void =>{
        Promise
            .resolve(fn(req, res, next))
            .catch((err)=>next(err))
    }
}


export {asyncHandler}