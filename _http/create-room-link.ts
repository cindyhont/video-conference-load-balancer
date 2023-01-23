import { ServerResponse } from "http";
import { v4 as uuidv4 } from 'uuid'
import { chatRooms, createRoom } from "../rooms";

const createRoomLink = (res:ServerResponse) => {
    let id = uuidv4()

    while (id in chatRooms){
        id = uuidv4()
    }

    createRoom(id)

    res.end(JSON.stringify({id}))
}

export default createRoomLink