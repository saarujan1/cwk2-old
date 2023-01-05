//GLOBAL VARIABLES
import { useReducer, useContext, createContext } from "react";

const contextData = {
    user: {
        id: "test", 
        password: "", 
        email: "testemail", 
        profile_pic_id: "", 
        phone: "", 
        bio: "test bio - remove this in UniContext", 
        hobbies: [],
        accepted: [], 
        rejected: []
    },
    filters: {
        id:"",
    } 
};

const AppContext = createContext(contextData);

const AppReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_EMAIL":
        return {
            ...state,
            ...action.payload
        };
    case "CHANGE_BIO":
        return {
            ...state,
            ...action.payload
        };
    case "CHANGE_PHONE":
        return {
            ...state,
            ...action.payload
        };
    case "CHANGE_HOBBIES":
        return {
            ...state,
            ...action.payload
        };
    default:
      return state;
  }
};

const UniContext = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, contextData);
  return (
    <AppContext.Provider value={[state, dispatch]}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
export default UniContext;
