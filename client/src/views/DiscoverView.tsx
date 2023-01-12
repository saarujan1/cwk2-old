import {useEffect, useState, useRef} from 'react'
import TinderCard from 'react-tinder-card'
import { useAppContext } from '../store/UniContext'
import { getAzure } from '../store/helpers'

const rejectIcon = require('../assets/icons/reject.svg').default as string
const acceptIcon = require('../assets/icons/accept.svg').default as string

const characters = [
  {
    name: 'Cristiano Ronaldo',
    email:'test@gmail.com',
    phone: '0123456789',
    bio: 'Man Utd Footballer',
    hobbies: 'Dancing',
    age: '37',
  },
  {
    name: 'Lionel Messi',
  },
  {
    name: 'Neymar',
  },
  {
    name: 'David Beckham',
  },
  {
    name: 'Harry Maguire',
    email:'test12@gmail.com',
    phone: '775234234234',
    bio: 'Ex Footballer',
    hobbies: 'Singing',
    age: '28',
  },
]

export default function DiscoverView() {
  const [currentIndex, setCurrentIndex] = useState(characters.length - 1)
  const currentIndexRef = useRef(currentIndex)
  const [globalState, dispatch] = useAppContext()
  const [user, setUser] = useState(null)
  const [lastDirection, setLastDirection] = useState()

  const getUser = async () => {
    try {
      let promise = new Promise((resolve, reject) => getAzure(resolve, '/api/updateAccount?', {username: globalState.user.id, password: globalState.password}))
      let resp = (await promise) as any
      if(resp.account){
        setUser(resp.account)
      }
    } catch (error) {
        console.log(error)
      }
  }

  useEffect(() => {
    getUser()
  }, [])

  const updateMatches = async (matchedUserId) => {

    console.log(matchedUserId)
    try {
      let promise = new Promise((resolve, reject) => getAzure(resolve, '/api/updateAccount?', {username: globalState.user.id, password: globalState.password}))
      let resp = (await promise) as any
      if(resp.account){
        setUser(resp.account)
      }
    } catch (error) {
        console.log(error)
      }
  }

  // console.log(user)

  const swiped = (direction, swipedUserId) => {
    if (direction === 'right') {
         updateMatches(swipedUserId)
    }
}
  const outOfFrame = (name) => {
    console.log(name + ' left the screen!')
  }

  return (
    <>
      <h1 className="pageTitle"> Discover</h1>
      <h3> Who would you like to match with today? </h3>
      <div className="card-container">
        {characters.map((character, index) => (
          <TinderCard className="swipe" key={character.name} onSwipe={(dir) => swiped(dir, character.name)} onCardLeftScreen={() => outOfFrame(character.name)}>
            <div className="card">
              <h3>{character.name}</h3>
              <div className = "attributes">
                <p className="attribute-text"> {character.email}</p>
                <p className="attribute-text"> {character.bio}</p>
                <p className="attribute-text"> {character.hobbies}</p>
                <p className="attribute-text"> {character.age}</p>
              </div>
            </div>
          </TinderCard>
        ))}
      </div>
      <div className="buttons">
        <img onClick={() => swiped('left', "Cristiano Ronaldo")} role="button" src={rejectIcon} alt={'Reject'} width="70" height="70" aria-label={'Reject'} />
        <img onClick={() => swiped('right', "Harry Maguire")} role="button" src={acceptIcon} alt={'Accept'} width="70" height="70" aria-label={'Accept'} />
      </div>
    </>
  )
}
