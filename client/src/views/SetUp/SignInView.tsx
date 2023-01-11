import { useAppContext } from '../../store/UniContext'
import { Nav } from 'react-bootstrap'
import { on } from 'events'
import { getAzure } from '../../store/helpers'
import { response } from 'express'
import { useNavigate } from 'react-router-dom'

export default function SignInView() {
  const navigate = useNavigate()
  const [globalState, dispatch] = useAppContext()

  //event hook to change nested values in global state
  const changeNested = (e) => {
    var someProperty = { ...globalState.user }
    someProperty[e.target.name] = e.target.value
    dispatch({
      type: 'CHANGE',
      payload: {
        ['user']: someProperty,
      },
    })
  }
  //update gameState hook

  //change validate value
  const validateHook = () => {
    dispatch({
      type: 'CHANGE',
      payload: {
        ['valid']: true,
      },
    })
  }

  //change non nested values in global state
  const changeHook = (e) => {
    dispatch({
      type: 'CHANGE',
      payload: {
        [e.target.name]: e.target.value,
      },
    })
  }

  //switch to home screen after succesful login
  async function loginTransition() {
    if (await tryLogin()) {
      globalState.valid = true
      validateHook()
    }
    navigate('/setup')
  }

  //switch to home screen after succesful register
  async function registerTransition() {
    if (await tryRegister()) {
      globalState.valid = true
      validateHook()
    }
  }

  async function tryLogin() {
    let path = '/api/login?'
    let message = { username: globalState.user.id, password: globalState.user.password }
    console.log(message)
    // Calls the Azure function to login a user
    let promise = new Promise((resolve, reject) => getAzure(resolve, path, message))
    let resp = (await promise) as any

    if (resp.result) {
      //set new user values
      dispatch({
        type: 'CHANGE',
        payload: {
          ['user']: resp.accountData,
        },
      })
      dispatch({
        type: 'CHANGE',
        payload: {
          ['filters']: resp.filterInfo,
        },
      })
      return true
    } else {
      return false
    }
  }
  
  async function tryRegister() {
    let path = '/api/register?'
    let message = { username: globalState.user.id, password: globalState.user.password, email: globalState.user.email }
    // Calls the Azure function to login a user
    let promise = new Promise((resolve, reject) => getAzure(resolve, path, message))
    let resp = (await promise) as any
    console.log(resp.result)
    if (resp.result) {
      //pushes context changes to other components basically
      dispatch({
        type: 'CHANGE',
        payload: {
          ['user']: resp.accountData,
        },
      })
      //pushes context changes to other components basically
      dispatch({
        type: 'CHANGE',
        payload: {
          ['filters']: resp.filterInfo,
        },
      })
    } else {
      //set new user values
      return false
    }
  }
  return (
    <div
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div>
        <input value={globalState.user.valid} name="id" onChange={changeNested} placeholder="username" className="form-control" />{' '}
      </div>
      <div>
        <input value={globalState.user.password} name="password" onChange={changeNested} placeholder="password" className="form-control" />
      </div>
      <div>
        <input value={globalState.user.email} name="email" onChange={changeNested} placeholder="email" className="form-control" />{' '}
      </div>

      <div>
        <button type="button" onClick={loginTransition} className="btn btn-info">
          Log in
        </button>
        <button type="button" onClick={registerTransition} className="btn btn-info">
          Register
        </button>
      </div>
    </div>
  )
}
