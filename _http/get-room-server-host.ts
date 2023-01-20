import { ServerResponse } from "http";
import { Ichatrooms } from "../interfaces";

const getRoomServerHost = (roomID:string|null, res:ServerResponse, chatRooms:Ichatrooms) => {
    if (!roomID) res.end(JSON.stringify({roomOK:false}))
    else res.end(JSON.stringify({
        roomOK:roomID in chatRooms,
        serverHost:chatRooms[roomID]?.serverHost || ''
    }))
}

export default getRoomServerHost