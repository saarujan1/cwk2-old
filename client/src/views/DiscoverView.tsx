import React, { useState, createRef, useRef, useMemo } from 'react'
import TinderCard from 'react-tinder-card'
const rejectIcon = require('../assets/icons/reject.svg').default as string
const undoIcon = require('../assets/icons/undo.svg').default as string
const acceptIcon = require('../assets/icons/accept.svg').default as string

const characters = [
  {
    name: 'Cristiano Ronaldo',
    url: '',
  },
  {
    name: 'Lionel Messi',
    url: '',
  },
  {
    name: 'Neymar',
    url: '',
  },
  {
    name: 'David Beckham',
    url: '',
  },
  {
    name: 'Harry Maguire',
    url: '',
  },
]

export default function DiscoverView() {
  const [data, setData] = React.useState('')
  const [login, setLogin] = React.useState('')
  const [currentIndex, setCurrentIndex] = useState(characters.length - 1)
  const [lastDirection, setLastDirection] = useState()
  const currentIndexRef = useRef(currentIndex)

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

  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction)
    updateCurrentIndex(index - 1)
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
      <div className="card-container">
        {characters.map((character, index) => (
          <TinderCard ref={childRefs[index]} className="swipe" key={character.name} onSwipe={(dir) => swiped(dir, character.name, index)} onCardLeftScreen={() => outOfFrame(character.name, index)}>
            <div style={{ backgroundImage: 'url(' + character.url + ')' }} className="card">
              <h3>{character.name}</h3>
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
