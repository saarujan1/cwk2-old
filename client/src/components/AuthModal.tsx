import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'


    interface AuthModalProps {
        setShowModal: (status: boolean) => void;
        isSignUp: boolean;
    }
    
    const AuthModal: React.FC<AuthModalProps> = ({ setShowModal,  isSignUp }) => {
        const [email, setEmail] = useState<string | null>(null)
        const [password, setPassword] = useState<string | null>(null)
        const [confirmPassword, setConfirmPassword] = useState<string | null>(null)
        const [error, setError] = useState<string | null>(null)
        const [cookies, setCookie, removeCookie] = useCookies(["AuthToken", "UserId"]);
    
        let navigate = useNavigate()
    
        const handleClick = () => {
            setShowModal(false)
        }

        const handleSubmit = async (e) => {
            e.preventDefault()
            try {
                if (isSignUp && (password !== confirmPassword)) {
                    setError('Passwords need to match!')
                    return
                }

            const response = await axios.post(`http://localhost:8080/${isSignUp ? 'signup' : 'login'}`, { email, password })

            setCookie('AuthToken', response.data.token)
            setCookie('UserId', response.data.userId)
    
            const success = response.status === 201
            if (success && isSignUp) navigate ('/setup')
            window.location.reload()

            } catch (error) {
                console.log(error)
            }
        }

    return (
        <div className="auth-modal">
            <div className="close-icon" onClick={handleClick}>ⓧ</div>
    
            <h2>{isSignUp ? 'SIGN UP': 'LOG IN'}</h2>
            <p> Submit your details</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="email"
                    required={true}
                    onChange={(e) => setEmail(e.target.value)}
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
                <input className="secondary-button" type="submit"/>
                <p>{error}</p>
            </form>
            <hr/>
        </div>
    )
                }
export default AuthModal
