import React, {useState, createRef } from 'react'
import TinderCard from 'react-tinder-card'

export default function DiscoverView() {
  const [data, setData] = React.useState('')
  const [login, setLogin] = React.useState('')
  const [lastDirection, setLastDirection] = useState()


  const characters = [
    {
      name: 'Cristiano Ronaldo',
      url: ''
    },
    {
      name: 'Lionel Messi',
      url: ''
    },
    {
      name: 'Neymar',
      url: ''
    },
    {
      name: 'David Beckham',
      url: ''
    },
    {
      name: 'Harry Maguire',
      url: ''
    }
  ]

  const swiped = (direction, nameToDelete) => {
    console.log('removing: ' + nameToDelete)
    setLastDirection(direction)
  }

  const outOfFrame = (name) => {
    console.log(name + ' left the screen!')
  }

  // React.useEffect(() => {
  //   console.log('Using effect')
  //   // callAPI()
  //   // fetch('/api')
  //   //   .then((res) => {
  //   //     res.json()
  //   //     console.log('res', res)
  //   //   })
  //   //   .then((data) => {
  //   //     console.log('received data:', data)
  //   //     // setData(data.message)
  //   //   })
  //   //   .catch((err) => err)
  //   fetch('/register')
  //     .then((res) => res.json())
  //     .then((res) => setData(res.message))
  //     .catch((err) => err)

  //   fetch('/login')
  //     .then((res) => res.json())
  //     .then((res) => setLogin(res.message))
  //     .catch((err) => err)
  // }, [])

  return (
    <>
      <div className="card-container">
      {characters.map((character) =>
          <TinderCard className='swipe' key={character.name} onSwipe={(dir) => swiped(dir, character.name)} onCardLeftScreen={() => outOfFrame(character.name)}>
            <div style={{ backgroundImage: 'url(' + character.url + ')' }} className='card'>
              <h3>{character.name}</h3>
            </div>
          </TinderCard>
        )}
      </div>
      <button type="button" className="btn btn-info">
        Info
      </button>
    </>
  )
}
