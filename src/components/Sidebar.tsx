import { NavLink } from 'react-router-dom'
import { Nav } from 'react-bootstrap'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import '../assets/styles/sidebars.css'
// const discover: string = require('../assets/icons/discover.svg').default

export default function Sidebar(props) {
  // ;(() => {
  //   'use strict'
  //   const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  //   tooltipTriggerList.forEach((tooltipTriggerEl) => {
  //     new bootstrap.Tooltip(tooltipTriggerEl)
  //   })
  // })()

  return (
    <>
      {/* REF2, REF3 */}
      <div className="col-sm-auto bg-light sticky-top">
        <div className="d-flex flex-sm-column flex-row flex-nowrap bg-light align-items-center sticky-top">
          {/* <a href="/" className="d-block p-3 link-dark text-decoration-none" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Icon-only">
                <img src={discover} className="fs-1" alt="logo" width="24" height="24" />
              </a> */}

          <ul className="nav nav-pills nav-flush flex-sm-column flex-row flex-nowrap mb-auto mx-auto text-center justify-content-between w-100 px-3 align-items-center">
            {props.routes.map((route) => {
              console.log('route ', route.name)
              const lowercaseRoute = route.name.toLowerCase()
              const icon = require('../assets/icons/' + lowercaseRoute + '.svg') as string
              return (
                <li className="nav-item" key={route.path}>
                  <Nav.Link as={NavLink} to={route.path} href="#" className="nav-link py-3 px-2" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Profile">
                    {/* const photo = string = require('../assets/icons/discover.svg').default */}
                    <img src={icon} className="fs-1" alt={route.name} width="24" height="24" aria-label={route.name} />
                  </Nav.Link>
                </li>
              )
            })}

            {/* <li className="nav-item">
                  <a href="#" className="nav-link py-3 px-2" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Profile">
                    <img src={profile} className="fs-1" alt="logo" width="24" height="24" />
                  </a>
                </li>
                <li>
                  <a href="#" className="nav-link py-3 px-2" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Dashboard">
                    <i className="bi-speedometer2 fs-1"></i>
                  </a>
                </li>
                <li>
                  <a href="#" className="nav-link py-3 px-2" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Orders">
                    <i className="bi-table fs-1"></i>
                  </a>
                </li>
                <li>
                  <a href="#" className="nav-link py-3 px-2" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Products">
                    <i className="bi-heart fs-1"></i>
                  </a>
                </li>
                <li>
                  <a href="#" className="nav-link py-3 px-2" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Customers">
                    <i className="bi-people fs-1"></i>
                  </a>
                </li> */}
          </ul>
        </div>
      </div>
      {/* REF2, REF3 */}

      {/* TODO: remove this example later on */}
      {/* REF1 */}
      {/* <div id="sidebar">
        <div>
          <form id="search-form" role="search">
            <input id="q" aria-label="Search profiles" placeholder="Search" type="search" name="q" />
            <div id="search-spinner" aria-hidden hidden={true} />
            <div className="sr-only" aria-live="polite"></div>
          </form>

          <form method="post">
            <button type="submit">New</button>
          </form>
        </div>

        <nav>
          {props.routes.map((route) => (
            <Nav.Link
              key={route.path}
              as={NavLink}
              className="nav-link"
              to={route.path}
              // className={({ isActive }) => `${props.className} ${isActive ? props.activeClassName : ''}`}
              // className={({ isActive }) => (isActive ? 'active' : 'inactive')}
              // className = {isActive ? 'nav-links-active' : 'nav-links'}
              // className = {(isActive: any) => isActive? 'active-css-class': 'general-css-class'}
              // className={(({ isActive }) => isActive ? 'active' : '')}
              // className={({e}) => e ? 'active' : ''}
              end
            >
              {route.name}
            </Nav.Link>
          ))}
        </nav>
      </div> */}
      {/* END OF REF1 */}
    </>
  )
}

// REFERENCES
// REF1, adapted from the React Router tutorial: https://reactrouter.com/en/main/start/tutorial#the-root-route
// REF2, original bootstrap example: https://getbootstrap.com/docs/5.3/examples/sidebars/
// REF3, adapted from the sidebar example based on the original bootstrap example: https://www.codeply.com/p/yRugA2FB3I
