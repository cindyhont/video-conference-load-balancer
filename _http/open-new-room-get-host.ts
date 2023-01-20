import { ServerResponse } from "http"
import { Ichatrooms } from "../interfaces"

const openNewRoomGetHost = (chatRooms:Ichatrooms,servers:string[],res:ServerResponse,roomID:string | null) => {
    if (!roomID) return

    if (servers.length === 1) {
        res.end(JSON.stringify({
            host:servers[0]
        }))
        return
    }

    if (roomID in chatRooms && !!chatRooms[roomID].serverHost) {
        res.end(JSON.stringify({
            host:chatRooms[roomID].serverHost
        }))
        return
    }
    
    let serverUsers = servers.map(server=>({[server]:0})).reduce((p,c)=>({...p,...c}))

    const 
        chatRoomValues = Object.values(chatRooms),
        chatRoomCount = chatRoomValues.length

    for (let i=0; i<chatRoomCount; i++){
        const {clientCount,serverHost} = chatRoomValues[i]
        if (!clientCount || !serverHost) continue
        serverUsers[serverHost] += clientCount
    }

    let 
        smallestCount = -1,
        leastBusyHost = ''

    const 
        serverUserEntries = Object.entries(serverUsers),
        serverUserCount = serverUserEntries.length

    for (let i=0; i<serverUserCount; i++){
        const [host,count] = serverUserEntries[i]
        if (count === 0) {
            res.end(JSON.stringify({host}))
            return
        }
        
        if (smallestCount === -1){
            smallestCount = count
            leastBusyHost = host
        } else if (count < smallestCount){
            smallestCount = count
            leastBusyHost = host
        }
    }

    res.end(JSON.stringify({
        host:leastBusyHost
    }))
}

export default openNewRoomGetHost