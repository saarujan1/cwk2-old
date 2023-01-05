import React, { createRef } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, useLocation, useOutlet } from 'react-router-dom'

// STYLESHEETS
import 'mdb-ui-kit/css/mdb.min.css'
import './assets/styles/main.css'
// import "./assets/styles/styles.scss";
// import 'bootstrap/dist/css/bootstrap.min.css'
// import App from './App'

// COMPONENTS
import Sidebar from './components/Sidebar'
import Content from './components/Content'
import SetupPage from './components/SetupPage'

// VIEWS
import FiltersView from './views/FiltersView'
import DiscoverView from './views/DiscoverView'
import MessagesView from './views/MessagesView'
import MatchesView from './views/MatchesView'
import ProfileView from './views/Profile/ProfileView'
import SettingsView from './views/Profile/SettingsView'
// import ErrorView from "./error";

const routes = [
  {
    path: '/',
    name: 'Discover',
    element: <DiscoverView />,
    nodeRef: createRef(),
  },
  {
    path: '/profiles/:profileID',
    name: 'Profile',
    element: <ProfileView />,
    nodeRef: createRef(),
    children: [
      {
        path: 'settings',
        element: <SettingsView />,
      },
    ],
  },
  {
    path: '/matches/',
    name: 'Matches',
    element: <MatchesView />,
    nodeRef: createRef(),
  },
  {
    path: '/messages/',
    name: 'Messages',
    element: <MessagesView />,
    nodeRef: createRef(),
  },
  {
    path: '/filters/',
    name: 'Filters',
    element: <FiltersView />,
    nodeRef: createRef(),
  },
]

// REF2
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: routes.map((route) => ({
      index: route.path === '/',
      path: route.path === '/' ? undefined : route.path,
      element: route.element,
    })),
  },
])
// END OF REF2

function Home() {
  const location = useLocation()
  const currentOutlet = useOutlet()

  // REF1
  // TODO: determine transition direction through path depth
  // const getPathDepth = useCallback(() => {
  //   let pathArr = location.pathname.split("/");
  //   pathArr = pathArr.filter(n => n !== "");
  //   console.log('getPathDepth: ' + pathArr.length)
  //   return pathArr.length;
  // }, location.pathname)
  // END OF REF1

  // const [prevDepth, setPrevDepth] = useState(getPathDepth());

  // '??' returns {} when the expression on the left is null/undefined
  const { nodeRef } = routes.find((route) => route.path === location.pathname) ?? {}

  // useEffect( () => {
  //   console.log('useEffect, counter updated: ' + (getPathDepth() - prevDepth));
  //   setPrevDepth(getPathDepth());
  // }, [prevDepth, getPathDepth])

  return (
    <>
      {
        <div className="container-fluid bg-tb">
          <div className="row">
            <Sidebar routes={routes}></Sidebar>
            <Content nodeRef={nodeRef} location={location} currentOutlet={currentOutlet}></Content>
            {/* <SetupPage /> */}
          </div>
        </div>
      }
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

// REFERENCES
// REF1, adapted from the following guide: https://medium.com/@ipenywis/slide-page-css-transition-on-react-with-react-router-38373da5e608
// REF2, adapted from an example from the React Transition Group library: https://reactcommunity.org/react-transition-group/with-react-router/
