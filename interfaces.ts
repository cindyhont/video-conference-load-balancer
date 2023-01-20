export interface Ichatrooms {
    [roomID:string]:{
        openTime:number;
        clientCount:number;
        serverHost?:string;
    }
}

// messages from servers

export interface Ijoin {
    type:'join';
    payload:{
        serverHost:string;
    }
}

export interface InewClient {
    type:'newClient';
    payload:{
        roomID:string;
        serverHost:string;
    }
}

export interface IdeleteClient {
    type:'deleteClient';
    payload:{
        roomID:string;
        deleteRoom:boolean;
    }
}

export type IwsEvent = Ijoin
    | InewClient
    | IdeleteClient