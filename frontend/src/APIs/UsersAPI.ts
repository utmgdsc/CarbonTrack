import FLASK_HTTPS from "./FLASK_API";
import type ObjectID from "bson-objectid";
import type {User} from "../models/User";

const routeName = "/users";


export const getUser = async (userID: ObjectID): Promise<undefined | User> => {
    try{
        const res =  await FLASK_HTTPS.get(routeName + "/user/" + userID.str);
        return res.data as User
    } catch (error){
        console.error(error);
        return undefined;
    }
};

export const createUser = async (user: User): Promise<undefined | User> => {
    try {
        const res = await FLASK_HTTPS.put(routeName + "/user",
        {
            user
        })
        return res.data as User;
    } catch (error){
        console.error(error);
        return undefined;
    }
}


