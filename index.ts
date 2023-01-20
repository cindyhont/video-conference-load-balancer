import { createServer as createHTTPServer } from 'http'
import { Ichatrooms, IwsEvent } from './interfaces';
import cron from 'node-cron'
import { WebSocketServer, WebSocket } from 'ws'
import createRoomLink from './_http/create-room-link';
import getRoomServerHost from './_http/get-room-server-host';
import openNewRoomGetHost from './_http/open-new-room-get-host';
import dotenv from 'dotenv'

dotenv.config()

let 
    chatRooms:Ichatrooms = {},
    servers:{[host:string]:WebSocket} = {}

cron.schedule('* * * * *',()=>{
    const 
        rooms = Object.entries(chatRooms),
        now = Date.now(),
        oneHour = 1000 * 60 * 60

    for (let [roomID,{openTime,clientCount}] of rooms){
        if (!clientCount && openTime < now - oneHour){
            delete chatRooms[roomID]
        }
    }
})

const wsServer = new WebSocketServer({
    port:+(process.env.WS_PORT as string),
    clientTracking:true
})
wsServer.on('connection',(socket)=>{
    socket.on('message',data=>{
        const 
            msg = data.toString(),
            {type,payload} = JSON.parse(msg) as IwsEvent

        switch (type){
            case 'join':
                servers[payload.serverHost] = socket
                break;
            case 'newClient':
                chatRooms[payload.roomID].clientCount++
                if (!chatRooms[payload.roomID]?.serverHost) chatRooms[payload.roomID].serverHost = payload.serverHost
                break
            case 'deleteClient':
                if (payload.roomID in chatRooms){
                    if (chatRooms[payload.roomID].clientCount < 2 && payload.deleteRoom) delete chatRooms[payload.roomID]
                    else if (chatRooms[payload.roomID].clientCount > 0) chatRooms[payload.roomID].clientCount--
                }
                break
            default: break;
        }
    })

    socket.on('close',()=>{
        const 
            serverEntries = Object.entries(servers),
            serverCount = serverEntries.length

        for (let i=0; i<serverCount; i++){
            const [host,thisSocket] = serverEntries[i]
            if (socket === thisSocket) {
                delete servers[host]

                const 
                    chatRoomEntries = Object.entries(chatRooms),
                    chatRoomCount = chatRoomEntries.length

                for (let j=0; j<chatRoomCount; j++){
                    const [roomID,{serverHost}] = chatRoomEntries[j]
                    if (serverHost === host) delete chatRooms[roomID]
                }
                break
            }
        }
    })
})

// ping to keep connection
setInterval(()=>{
    wsServer.clients.forEach(client=>{
        client?.ping()
    })
},30000)

createHTTPServer((req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');

    const {pathname,searchParams} = new URL(req.url as string, `http://${req.headers.host}`)
    
    switch (pathname){
        case '/create-room-link':
            createRoomLink(res,chatRooms)
            break;
        case '/get-room-server-host':
            getRoomServerHost(searchParams.get('roomID'),res,chatRooms)
            break;
        case '/open-new-room-get-host':
            openNewRoomGetHost(chatRooms,Object.keys(servers),res,searchParams.get('roomID'))
            break
        default: break;
    }
}).listen(process.env.HTTP_PORT)