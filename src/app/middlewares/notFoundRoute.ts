// import { NextFunction, Request, RequestHandler, Response } from "express"
// import httpStatus from "http-status"

// const notFound: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
//     return res.status(httpStatus.NOT_FOUND).json({
//         success:false,
//         message: "Not Found",
//     })
// }

// export default notFound

import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";

const notFound: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "Not Found",
    });
};

export default notFound;
