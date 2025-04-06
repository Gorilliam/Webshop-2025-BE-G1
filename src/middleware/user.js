import { getUserDataFromToken } from "../util/getToken.js"

export async function userContextMiddleware(req, res, next) {

    const userData = await getUserDataFromToken(req)

    if (!userData.error) {
        req.user = userData
    }

    next()
}