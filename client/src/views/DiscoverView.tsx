import React, { createRef } from 'react'

export default function DiscoverView() {
  const [data, setData] = React.useState('')
  const [login, setLogin] = React.useState('')

  React.useEffect(() => {
    console.log('Using effect')
    // callAPI()
    // fetch('/api')
    //   .then((res) => {
    //     res.json()
    //     console.log('res', res)
    //   })
    //   .then((data) => {
    //     console.log('received data:', data)
    //     // setData(data.message)
    //   })
    //   .catch((err) => err)
    fetch('/register')
      .then((res) => res.json())
      .then((res) => setData(res.message))
      .catch((err) => err)

    fetch('/login')
      .then((res) => res.json())
      .then((res) => setLogin(res.message))
      .catch((err) => err)
  }, [])

  return (
    <>
      <div>
        <p>
          <>
            Register - {data}. Login - {login}.
          </>
        </p>
      </div>
      <button type="button" className="btn btn-info">
        Info
      </button>
    </>
  )
}
