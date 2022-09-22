import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import io from "socket.io-client";

const newSocket = io(`http://localhost:4000`);

export const Session = React.createContext();
function SessionContextProvider({ children }) {
  const [socket] = useState(newSocket);
  const userData = JSON.parse(window.localStorage.getItem("BoxBookSession"));
  const [user, setUser] = useState(userData);

  useEffect(() => {
    if (!user) return;

    socket.emit("subscription", JSON.stringify(user));

    socket.on("solitude-accepted", (username) => {
      toast.success(`${username} accepted your friend request`);
    });

    return () => newSocket.close();
  }, [user, socket]);

  return (
    <Session.Provider value={{ user, setUser, socket }}>
      {children}
    </Session.Provider>
  );
}

export default SessionContextProvider;
