import React from 'react'

// COMPONENTS
import Sidebar from './components/Sidebar'
import Content from './components/Content'
import SetupPage from './components/SetupPage'

function App() {
  const [data, setData] = React.useState(null)

  React.useEffect(() => {
    fetch('/api')
      .then((res) => res.json())
      .then((data) => setData(data.message))
  }, [])

  return (
    <div className="container-fluid bg-tb">
      <div className="row">
        {/* <Sidebar routes={routes}></Sidebar>
           <Content nodeRef={nodeRef} location={location} currentOutlet={currentOutlet}></Content> */}
        <SetupPage />
      </div>
    </div>
  )
}

export default App
