import React, {useEffect, useState, createRef, useRef, useMemo } from 'react'
import TinderCard from 'react-tinder-card'
import { useAppContext } from '../store/UniContext'
import { getAzure } from '../store/helpers'

const rejectIcon = require('../assets/icons/reject.svg').default as string
const undoIcon = require('../assets/icons/undo.svg').default as string
const acceptIcon = require('../assets/icons/accept.svg').default as string

const characters = [
  {
    name: 'Cristiano Ronaldo',
    email:'',
    phone: '',
    bio: '',
    hobbies: '',
    age: '',
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
  },
]

export default function DiscoverView() {
  const [currentIndex, setCurrentIndex] = useState(characters.length - 1)
  const currentIndexRef = useRef(currentIndex)
  const [globalState, dispatch] = useAppContext()
  const [user, setUser] = useState(null)
  const [lastDirection, setLastDirection] = useState()


  /**
   * TO DO FOR DISCOVER VIEW:
   * RIGHT SWIPE --> acceptUsers
   * LEFT SWIPE --> rejectedUsers
   * Get rid of Go Back
   * Accepted users to show on Matches page
   */

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

  // console.log('user', user)

  const childRefs = useMemo(
    () =>
      Array(characters.length)
        .fill(0)
        .map((i) => React.createRef<any>()),
    []
  )

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val)
    currentIndexRef.current = val
  }

  const canGoBack = currentIndex < characters.length - 1
  const canSwipe = currentIndex >= 0

  const updateMatches = async (matchedUserId) => {
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

  console.log(user)

  const swiped = (direction, nameToDelete, swipedUserId) => {
    if (direction === 'right') {
         updateMatches(swipedUserId)
    }
     setLastDirection(direction)
}
  const swipe = async (dir) => {
    if (canSwipe && currentIndex < characters.length) {
      await childRefs[currentIndex].current.swipe(dir) // Swipe the card!
    }
  }

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return
    const newIndex = currentIndex + 1
    updateCurrentIndex(newIndex)
    await childRefs[newIndex].current.restoreCard()
  }

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current)
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard()
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  }

  return (
    <>
      <h1 className="pageTitle"> Discover</h1>
      <h3> Who would you like to match with today? </h3>
      <div className="card-container">
        {characters.map((character, index) => (
          <TinderCard ref={childRefs[index]} className="swipe" key={character.name} onSwipe={(dir) => swiped(dir, character.name, index)} onCardLeftScreen={() => outOfFrame(character.name, index)}>
            <div className="card">
              <h3 className="">{character.name}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
      <div className="buttons">
        <img onClick={() => swipe('left')} role="button" src={rejectIcon} alt={'Reject'} width="70" height="70" aria-label={'Reject'} />
        <img onClick={() => goBack()} role="button" src={undoIcon} alt={'Undo'} width="70" height="70" aria-label={'Undo'} />
        <img onClick={() => swipe('right')} role="button" src={acceptIcon} alt={'Accept'} width="70" height="70" aria-label={'Accept'} />
      </div>
    </>
  )
}
