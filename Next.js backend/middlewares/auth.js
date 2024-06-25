import catchAsyncErrors from './catchAsyncErrors'
// import ErrorHandler from '../utils/errorHandler'
import { getToken } from "next-auth/jwt"
// import connection from '../../../config/connection'
// import { NextRequest, NextResponse } from "next/server";
const secret = process.env.NEXTAUTH_SECRET

const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const session = await getToken({ req, secret })
    req.user = session.user;

    if (!session) {
        return res.status(401).send({ message: "Login first to access this resource" });
    }
    next();
})


// Handling user roles
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).send({
                message: `Role (${req.user.role}) is not allowed to access this resource.`
            });
        }
        next()
    }
}

const authorizeID = (...ids) => {
    return (req, res, next) => {
        if (ids !== req.user.id) {
            return res.status(403).send({
                message: `Invlid user is not allowed to access this resource.`
            });
        }
        next()
    }
}


export {
    isAuthenticatedUser,
    authorizeRoles,
    authorizeID
}