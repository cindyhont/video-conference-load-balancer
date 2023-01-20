import { ServerResponse } from "http";
import { Ichatrooms } from "../interfaces";
import { v4 as uuidv4 } from 'uuid'

const createRoomLink = (res:ServerResponse, chatRooms:Ichatrooms) => {
    let id = uuidv4()

    while (id in chatRooms){
        id = uuidv4()
    }

    chatRooms[id] = {
        openTime:Date.now(),
        clientCount: 0,
    }

    res.end(JSON.stringify({id}))
}

export default createRoomLink