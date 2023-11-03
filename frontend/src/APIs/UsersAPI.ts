import FLASK_HTTPS from "./FLASK_API";
import type ObjectID from "bson-objectid";
import type {User} from "../models/User";

const routeName = "/users";


export const getUser = async (userID: ObjectID): Promise<undefined | User> => {
    return await FLASK_HTTPS.get(routeName + "/user/" + userID.str)
        .then((res) => {
            return res.data as User
        })
        .catch((res) => {
            console.log(res)
            return undefined;
        })
}

export const createUser = async (user: User): Promise<undefined | User> => {
    return await FLASK_HTTPS.put(routeName + "/user",
        {
            user
        })
        .then((res) => {
            return res.data as User
        }).catch((res) => {
            console.log(res)
            return undefined;
        })
}


