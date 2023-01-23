import { Ichatrooms } from "./interfaces";

let chatRooms:Ichatrooms = {}

const 
    createRoom = (id:string) => {
        chatRooms[id] = {
            lastActiveTime:Date.now(),
            clientCount: 0,
        }
    },
    deleteRoomByRoomID = (id:string) => delete chatRooms[id],
    newClient = (roomID:string,serverHost:string) => {
        chatRooms[roomID].clientCount++
        if (!chatRooms[roomID]?.serverHost) chatRooms[roomID].serverHost = serverHost
    },
    deleteClient = (roomID:string) => {
        if (roomID in chatRooms){
            if (chatRooms[roomID].clientCount > 0) chatRooms[roomID].clientCount--
            chatRooms[roomID].lastActiveTime = Date.now()
        }
    }

export {
    chatRooms,
    createRoom,
    deleteRoomByRoomID,
    newClient,
    deleteClient,
}