import { createContext, FC, PropsWithChildren, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { SERVER_URL } from 'app/config/api.config'

interface ISocketContext {
    socket: Socket | null
    setSocket?: any
    selectedSong?: string
    setSelectedSong: React.Dispatch<React.SetStateAction<string>>
    file?: string
    roomName?: string
    setFile: React.Dispatch<React.SetStateAction<string>>
    setRoomName: React.Dispatch<React.SetStateAction<string>>
    listenersCount: number
    setListenersCount: React.Dispatch<React.SetStateAction<number>>
}

// @ts-ignore
export const WebSocketContext = createContext<ISocketContext>({ socket: null })

const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [selectedSong, setSelectedSong] = useState("")
    const [file, setFile] = useState("")
    const [roomName, setRoomName] = useState("")
    const [listenersCount, setListenersCount] = useState(0)

    return (
     <WebSocketContext.Provider value={{ socket, setSocket, selectedSong, setSelectedSong, file, setFile,
        roomName, setRoomName, listenersCount, setListenersCount
      }}>
        {children}
     </WebSocketContext.Provider>
    )
}
export default SocketProvider