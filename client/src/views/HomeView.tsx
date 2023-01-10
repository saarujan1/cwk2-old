const mapImg = require('../assets/images/home-map.jpg') as string
const backgroundImg = require('../assets/images/home-background.svg').default as string

export default function Home() {
  return (
    <div className="container-fluid bg-bg w-100" style={{ backgroundImage: 'url(' + backgroundImg + ')', backgroundSize: '85%' }}>
      <div className="row vh-100">
        <div className="col-sm-8 position-relative">
          <div className="position-absolute" style={{ top: '35%', left: '15%' }}>
            <h1 className="display-1 fw-bold">
              <span className="text-light">Uni</span>
              <span className="text-blue">Match</span>
            </h1>
            <p className="lead text-light fw-bold">Need uni friends? We got you covered, mate</p>

            <div className="container">
              <div className="row">
                <div className="col-4">
                  <button type="button" className="btn-setup">
                    Sign up
                  </button>
                </div>
                <div className="col-4">
                  <button type="button" className="btn-setup">
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="col-sm-4 vh-100">
          <div className="align-middle"> */}
        {/* position-absolute top-50 end-0 translate-middle-y */}
        {/* <img src={backgroundImg} width="24" height="24" className="vh-100 rounded-5" alt="Map underneath a backpack, pencil, camera, notebook, and other maps" /> */}
        {/* </div>
        </div> */}
      </div>
    </div>
  )
}

// 'mapImg' photo by <a href="https://unsplash.com/@anniespratt?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Annie Spratt</a> on <a href="https://unsplash.com/photos/qyAka7W5uMY?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
