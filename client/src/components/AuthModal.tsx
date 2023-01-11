import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../store/UniContext'
import { getAzure } from '../store/helpers'

interface AuthModalProps {
    setShowModal: (status: boolean) => void;
    isSignUp: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ setShowModal,  isSignUp }) => {

    //local consts
    const [email, setEmail] = useState<string | null>(null)
    const [username, setUsername] = useState<string | null>(null)
    const [password, setPassword] = useState<string | null>(null)
    const [confirmPassword, setConfirmPassword] = useState<string | null>(null)

    const [error, setError] = useState<string | null>(null)
    const [globalState, dispatch] = useAppContext()
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
        navigate('/setup')
    }

      //switch to home screen after succesf{globalState.user.email}ul login
    async function loginTransition() {
        if (await tryLogin()) {
        globalState.valid = true
        validateHook()
        }
        navigate('/setup')
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
        let message = { username: username, password: password, email: email }
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
            return false
        }
    }

    return (
        <div className="auth-modal">
            <div className="close-icon" onClick={handleClick}>ⓧ</div>
            <form className="auth-form">
                {isSignUp && <input
                    id="email"
                    type="email"
                    placeholder="email"
                    onChange={e => setEmail(e.target.value)}
                />}
                <input
                    id="username"
                    type="username"
                    placeholder="username"
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    id="password"
                    type="password"
                    placeholder="password"
                    onChange={e => setPassword(e.target.value)}
                />
                {isSignUp && <input
                    id="password-check"
                    type="password"
                    placeholder="confirm password"
                    onChange={e => setConfirmPassword(e.target.value)}
                />}
                {isSignUp ? (
                    <button
                        className="secondary-button"
                        type="button"
                        onClick={registerTransition}
                    >
                        Register
                    </button>
                ) : (
                    <button
                        className="secondary-button"
                        type="button"
                        onClick={loginTransition}
                    >
                        Login
                    </button>
                )}
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    )
}

export default AuthModal
