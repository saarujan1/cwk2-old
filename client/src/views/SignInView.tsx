import { useAppContext } from "../UniContext";
import { Nav } from 'react-bootstrap'
import { on } from "events";
import { getAzure } from '../shared.js';
export default function SignInView() {
  const [globalState, dispatch] = useAppContext();

  //hook to change nested values in global state
  const changeNested = (e) => {
    var someProperty = { ...globalState.user };
    someProperty[e.target.name] = e.target.value;
    dispatch({
      type: "CHANGE",
      payload: {
        ["user"]: someProperty
      }
    });
  };
  //change validate value
  const validateHook = () => {
    dispatch({
        type: "CHANGE",
        payload:{
            ["valid"]: true
        }

    });
  }

  //change non nested values in global state
  const changeHook = (e) => {
    dispatch({
      type: "CHANGE",
      payload: {
        [e.target.name]: e.target.value
      }
    });
  };

  async function validate(){
    if(await login()){
        globalState.valid = true;
        validateHook();
    }
   
  }

  async function login(){
    let path = '/api/login?'
    let message = {id:globalState.user.id,password:globalState.user.password,email:globalState.user.email}
    // Calls the Azure function to login a user
    let promise = new Promise((resolve, reject) => getAzure(resolve, path, message))
    let resp = await promise

    if (resp.result == false) {
        return false;
    }else{
        return true;
    }
  }
  return (
    <div>
        <h1>SIGN IN</h1>
        <input value={globalState.user.valid} name="id" onChange={changeNested} />
        <input value={globalState.user.password} name="password" onChange={changeNested} />
        <input value={globalState.user.email} name="email" onChange={changeNested} />      
     
        <button type="button" onClick={validate} className="btn btn-info">
        Log in
        </button>
        <button type="button" className="btn btn-info">
        Register
        </button>
    </div>
  )
}