import AuthModal from "../components/AuthModal"
import SignInView from "./SetUp/SignInView"
import {useState} from 'react'
import {useCookies} from "react-cookie"

const mapImg = require('../assets/images/home-map.jpg') as string

export default function Home() {

const [showModal, setShowModal] = useState(false)
const [isSignUp, setIsSignUp] = useState(true)
const [cookies, setCookie, removeCookie] = useCookies(["AuthToken", "UserId"]);
const authToken = cookies.AuthToken

  const handleRegister = () => {
      if (authToken) {
          removeCookie('UserId', cookies.UserId)
          removeCookie('AuthToken', cookies.AuthToken)
          window.location.reload()
          return
      }
      setShowModal(true);
      setIsSignUp(true);
  }

  const handleLogin = () => {
    if (authToken) {
        removeCookie('UserId', cookies.UserId)
        removeCookie('AuthToken', cookies.AuthToken)
        window.location.reload()
        return
    }
    setShowModal(true)
    setIsSignUp(false)
}

  return (
    <div className="container-fluid bg-bg w-100 home-backgroundImg p-0 overflow-hidden">
      <div className="row vh-100">
        <div className="col-sm-8 position-relative p-0 vh-100">
          <div className="position-absolute" style={{ top: '35%', left: '15%' }}>
            <h1 className="display-1 fw-bold">
              <span className="text-light">Uni</span>
              <span className="text-blue">Match</span>
            </h1>
            <p className="lead text-light fw-bold">Need uni friends? We got you covered, mate</p>

            <div className="container">
              <div className="row">
                <div className="col-4">
                  <button type="button" onClick={handleRegister} className="btn-setup">
                    {authToken ? 'Signout' : 'Sign up'}
                  </button>
                    {showModal && (
                      <AuthModal setShowModal={setShowModal} isSignUp={isSignUp}/>
                    )}
                </div>
                <div className="col-4">
                <button type="button" onClick={handleLogin} className="btn-setup">
                      Login
                  </button>
                  {showModal && (
                      <AuthModal setShowModal={setShowModal} isSignUp={isSignUp}/>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-4 p-0 vh-100">
          <div className="h-100 d-flex flex-column justify-content-center">
            <div style={{ height: '80%' }}>
              <img src={mapImg} className="h-100 rounded-5" alt="Map underneath a backpack, pencil, camera, notebook, and other maps" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 'mapImg' photo by <a href="https://unsplash.com/@anniespratt?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Annie Spratt</a> on <a href="https://unsplash.com/photos/qyAka7W5uMY?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
