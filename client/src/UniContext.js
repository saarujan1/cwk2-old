//GLOBAL VARIABLES
import { useReducer, useContext, createContext } from "react";

const contextData = {
    error:"",
    valid: false,
    test:"",
    user: {
        id: "test", 
        password: "", 
        email: "testemail", 
        profile_pic_id: "", 
        phone: "", 
        bio: "test bio - remove this in UniContext", 
        hobbies: [],
        accepted: [], 
        rejected: [],
    },
    filters: {
        id:"",
    } 
};
console.log('creating context');
const AppContext = createContext(contextData);
console.log('Created context');

const AppReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
        return {
            ...state,
            ...action.payload,
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
