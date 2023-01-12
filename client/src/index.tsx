import React, { createRef } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, useLocation, useOutlet, Route} from 'react-router-dom'
import UniContext, { useAppContext } from './store/UniContext'

// STYLESHEETS
import 'mdb-ui-kit/css/mdb.min.css'
import './assets/styles/main.scss'
import './assets/styles/constants.css'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import App from './App'

// COMPONENTS
import Sidebar from './components/Panels/Sidebar'
import Content from './components/Panels/Content'
import SetupPage from './components/SetupPage'

// VIEWS
import HomeView from './views/HomeView'
import FiltersView from './views/FiltersView'
import DiscoverView from './views/DiscoverView'
import MessagesView from './views/Messages/MessagesView'
import MatchesView from './views/MatchesView'
import ProfileView from './views/Profile/ProfileView'
import SettingsView from './views/Profile/SettingsView'
import SetupView from './views/SetUp/SetupView'

const SetUpRoute =   {
  path: '/setup',
  name: 'Setup',
  element: <SetupView />,
  nodeRef: createRef(),
}

const routes = [
  {
    path: '/discover',
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
    element: <ScreenContainer />,
    children: [
      ...routes.map((route) => ({
        index: route.path === '/',
        path: route.path === '/' ? undefined : route.path,
        element: route.element,
      })), {
        path: '/setup',
        element: <SetupView />,
      },
    ], 
  },
])
// END OF REF2

function ScreenContainer() {
  return (
    <>
      {
        <UniContext>
          <Redirect></Redirect>
        </UniContext>
      }
    </>
  )
}

function Redirect() {
  const location = useLocation()
  const currentOutlet = useOutlet()
  const [userData, updateUserDate] = useAppContext()
  const { nodeRef } = routes.find((route) => route.path === location.pathname) ?? {}

  if (userData.valid === true) {
      return (
        <>
          {
            <div className="container-fluid bg-bdg">
              <div className="row">
                <Sidebar routes={routes}></Sidebar>
                <Content nodeRef={nodeRef} location={location} currentOutlet={currentOutlet}></Content>
                {/* <SetupPage /> */}
              </div>
            </div>
          }
        </>
      )
  } else {
    return <>{<HomeView></HomeView>}</>
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />)

// REFERENCES
// REF1, adapted from the following guide: https://medium.com/@ipenywis/slide-page-css-transition-on-react-with-react-router-38373da5e608
// REF2, adapted from an example from the React Transition Group library: https://reactcommunity.org/react-transition-group/with-react-router/
