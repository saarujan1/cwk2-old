import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../store/UniContext'
import { getAzure } from '../store/helpers'

interface AuthModalProps {
    setShowModal: (status: boolean) => void;
    isSignUp: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ setShowModal,  isSignUp }) => {
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
            <div className="close-icon" onClick={handleClick}>ⓧ</div>
    
            <h2>{isSignUp ? 'SIGN UP': 'LOG IN'}</h2>
            <p> Submit your details</p>
            <form>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="email"
                    required={true}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="username"
                    id="username"
                    name="username"
                    placeholder="username"
                    required={true}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="password"
                    required={true}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {isSignUp && <input
                    type="password"
                    id="password-check"
                    name="password-check"
                    placeholder="confirm password"
                    required={true}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />}
                <input className="secondary-button" type="submit" onClick={isSignUp ? registerTransition : loginTransition}/>
                <p>{error}</p>
            </form>
            <hr/>
        </div>
    )
}
export default AuthModal
