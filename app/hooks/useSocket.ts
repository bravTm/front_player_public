import { WebSocketContext } from "app/provider/SocketProvider";
import { useContext } from "react";

export const useSocket = () => useContext(WebSocketContext)