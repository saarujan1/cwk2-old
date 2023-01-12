import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../store/UniContext'
import { getAzure } from '../store/helpers'

interface AuthModalProps {
  setShowModal: (status: boolean) => void
  isSignUp: boolean
}

const AuthModal: React.FC<AuthModalProps> = ({ setShowModal, isSignUp }) => {
  //local consts
  const [globalState, dispatch] = useAppContext();
  const [email, setEmail] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [password, setPassword] = useState<string | null>(null)
  const [confirmPassword, setConfirmPassword] = useState<string | null>(null)

  const [error, setError] = useState<string | null>(null)
  
  const navigate = useNavigate()

  const handleClick = () => {
    setShowModal(false)
  }

  //switch to home screen after succesful register
  async function registerTransition() {
    if (await tryRegister()) {
      globalState.valid = true
      validateHook()
    }
    if(globalState.valid == true){
      globalState.password = password
      navigate("/setup")
    } else {
      const issueElement = document.getElementById("issue");
      if (issueElement) {
        issueElement.innerHTML = globalState.returnMessage;
      }
    }
  }

  //switch to home screen after succesf{globalState.user.email}ul login
  async function loginTransition() {
    if (await tryLogin()) {
      globalState.valid = true
      validateHook()
    }
    if(globalState.valid == true){
      navigate("/discover")
    }
  }
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
  //change validate value
  const validateHook = () => {
    dispatch({
      type: 'CHANGE',
      payload: {
        ['valid']: true,
      },
    })
  }

  async function tryLogin() {
    let path = '/api/login?'
    let message = { username: username, password: password }
    console.log(message)
    let promise = new Promise((resolve, reject) => getAzure(resolve, path, message))
    let resp = (await promise) as any
    console.log("global state before"+JSON.stringify(globalState))
    if (resp.result) {
      //set new user values
      console.log("dispatching new values")
      dispatch({
        type: 'CHANGE',
        payload: {
          ['user']: resp.accountData,
        }
      })
      dispatch({
        type: 'CHANGE',
        payload: {
          ['filters']: resp.filterInfo,
        }
      })
      console.log("The filter info: "+JSON.stringify(resp.filterInfo))
      console.log("The account info: "+JSON.stringify(resp.accountData))
      console.log("The filter info according to globalState in login: " + JSON.stringify(globalState.filters) )
      return true
    } else {
      return false
    }
  }
  async function tryRegister() {
    let path = '/api/register?'
    let message = { username: username, password: password, email: email }
    let promise = new Promise((resolve, reject) => getAzure(resolve, path, message))
    let resp = (await promise) as any
    console.log(resp.result)
    if (resp.result) {
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
      const obj = JSON.parse(resp.message);
      globalState.returnMessage = obj.message
      return false
    }
  }

  return (
    <>
    <div className="auth-modal">
      <div className="d-flex justify-content-between">
        <h3 className="c-heading">{isSignUp ? 'Sign up' : 'Log in'}</h3>
        <button type="button" className="btn-close bg-lw" aria-label="Close" onClick={handleClick}></button>
      </div>
      <div className="">
        <form className="auth-form">
          {isSignUp && (
            <div className="mb-1">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                className="form-input"
                type="email"
                id="email"
                // value={globalState.user.email}
                name="email"
                required={true}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}
          <div className="mb-1">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <div className="">
              <input
                className="form-input"
                type="username"
                id="username"
                // value={globalState.user.valid}
                name="username"
                required={true}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-1">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="">
              <input
                className="form-input"
                type="password"
                id="password"
                // value={globalState.user.password}
                name="password"
                required={true}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {isSignUp && (
            <div className="mb-1">
              <label htmlFor="password-check" className="form-label">
                Confirm password
              </label>
              <div className="">
                <input
                  className="form-input"
                  type="password"
                  // value={globalState.user.password}
                  id="password-check"
                  name="password-check"
                  required={true}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          )}
          {isSignUp ? (
            <div className="mt-3">
              <button
                className="c-btn-blue"
                type="button"
                onClick={() => {
                  handleClick()
                  registerTransition()
                }}
              >
                Register
              </button>
              <p id="issue"></p>
            </div>
          ) : (
            <div className="mt-3">
              <button
                className="c-btn-blue"
                type="button"
                onClick={() => {
                  handleClick()
                  loginTransition()
                }}
              >
                Log in
              </button>
              <p id="issue"></p>
            </div>
          )}
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
    </>
  )
}

export default AuthModal
