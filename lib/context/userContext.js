import { createContext } from "react";
import { useUserData } from "../hooks";

export const UserContext = createContext({ user: null, username: null });

const UserProvider = props => {
  const userData = useUserData();
  return (
    <UserContext.Provider value={userData}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;
