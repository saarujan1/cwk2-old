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
  const [email, setEmail] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [password, setPassword] = useState<string | null>(null)
  const [confirmPassword, setConfirmPassword] = useState<string | null>(null)

  const [error, setError] = useState<string | null>(null)
  const [globalState, dispatch] = useAppContext()

  let navigate = useNavigate()

  const handleClick = () => {
    setShowModal(false)
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

  const loginTransition = async () => {
    let path = '/api/login?'
    let message = { username: email, password: password }
    console.log(message)
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
      navigate('/setup')
      window.location.reload()
    } else {
      setError('Invalid email or password')
    }
  }
  const registerTransition = async () => {
    let path = '/api/register?'
    let message = { username: email, password: password, email: email }
    let promise = new Promise((resolve, reject) => getAzure(resolve, path, message))
    let resp = (await promise) as any
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
      window.location.reload()
    } else {
      setError('Invalid input or this user already exists')
    }
  }

  return (
    <div className="auth-modal">
      {/* <div className="close-icon" >
        ✘
      </div> */}
      <div className="d-flex justify-content-between">
        <h3 className="c-heading">{isSignUp ? 'Sign up' : 'Log in'}</h3>
        <button type="button" className="btn-close bg-lw" aria-label="Close" onClick={handleClick}></button>
      </div>
      <div className="">
        <form>
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
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          )}
          <div className="mt-3">
            <input className="c-btn-blue" type="submit" onClick={isSignUp ? registerTransition : loginTransition} />
          </div>
          <p>{error}</p>
        </form>
      </div>
    </div>
  )
}
export default AuthModal
