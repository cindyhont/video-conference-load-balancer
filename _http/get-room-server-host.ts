import { ServerResponse } from "http";
import { chatRooms } from "../rooms";

const getRoomServerHost = (roomID:string|null, res:ServerResponse) => {
    if (!roomID) res.end(JSON.stringify({roomOK:false}))
    else res.end(JSON.stringify({
        roomOK:roomID in chatRooms,
        serverHost:chatRooms[roomID]?.serverHost || ''
    }))
}

export default getRoomServerHost