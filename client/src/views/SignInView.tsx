import { useAppContext } from "../UniContext";
import { Nav } from 'react-bootstrap'
import { on } from "events";
import { getAzure } from '../shared.js';
import { response } from "express";
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
  type signInResponse = {
    result: boolean,
    accountData:{
        id: string;
        password: string;
        email: string;
        profile_pic_id: string,
        phone: string,
        bio:string,
        hobbies:[string],
        accepted:[string],
        reject:[string]
    },
    filterInfo:{
        id: string,
        university: string,
        course: string,
        year: string,
        language:string,
        study_method:string,
        study_time:string
    }
  };

  async function login(){
    let path = '/api/login?'
    let message = JSON.stringify({id:globalState.user.id,password:globalState.user.password,email:globalState.user.email});
    console.log(message)
    // Calls the Azure function to login a user
    let promise = new Promise((resolve, reject) => getAzure(resolve, path, message));
    let resp = await promise as any

    if (resp.result) {
        return false;
    }else{
        //set new user values
        return true;
    }
  }
  async function register(){
    let path = '/api/register?'
    let message = JSON.stringify({id:globalState.user.id,password:globalState.user.password,email:globalState.user.email});
    // Calls the Azure function to login a user
    let promise = new Promise((resolve, reject) => getAzure(resolve, path, message));
    let resp = await promise as any

    if (resp.result == true ) {
        return false;
    }else{
        //set new user values
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