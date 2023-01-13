import { NavLink } from 'react-router-dom'
import { Nav } from 'react-bootstrap'
import Panel from './Panel'
const discover: string = require('../../assets/icons/discover.svg').default

export default function Sidebar(props) {
  return (
    <>
      {/* REF2, REF3 */}
      <Panel padding={2} color="bg-bdg" width="col-sm-1" height="vh-100" className="sticky-top d-flex flex-column justify-content-around" noInnerHeight>
        <div className="d-flex flex-sm-column flex-row flex-nowrap align-items-center rounded">
          <ul className="nav nav-pills nav-flush flex-sm-column flex-row flex-nowrap mb-auto mx-auto text-center justify-content-between w-100 px-3 align-items-center">
            {props.routes.map((route) => {
              console.log('route ', route.name)
              const lowercaseRoute = route.name.toLowerCase()
              const icon = require('../../assets/icons/' + lowercaseRoute + '.svg') as string
              return (
                <li className="nav-item" key={route.path}>
                  <Nav.Link as={NavLink} to={route.path} href="#" className="nav-link py-3 px-2" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Profile">
                    <img src={icon} className="fs-1" alt={route.name} width="24" height="24" aria-label={route.name} />
                  </Nav.Link>
                </li>
              )
            })}
          </ul>
        </div>
      </Panel>
    </>
  )
}

// REFERENCES
// REF1, adapted from the React Router tutorial: https://reactrouter.com/en/main/start/tutorial#the-root-route
// REF2, original bootstrap example: https://getbootstrap.com/docs/5.3/examples/sidebars/
// REF3, adapted from the sidebar example based on the original bootstrap example: https://www.codeply.com/p/yRugA2FB3I
