import { NavLink } from 'react-router-dom'
import { Nav } from 'react-bootstrap'

export default function Sidebar(props) {
  return (
    <>
      {/* TODO: remove this example later on */}
      {/* REF1 */}
      <div id="sidebar">
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
      </div>
      {/* <div id="detail"></div> */}
      {/* END OF REF1 */}
    </>
  )
}

// REFERENCES
// REF1, adapted from the React Router tutorial: https://reactrouter.com/en/main/start/tutorial#the-root-route
