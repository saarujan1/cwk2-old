import React, {useEffect, useState, createRef, useRef, useMemo, RefObject } from 'react'
import TinderCard from 'react-tinder-card'
import { useAppContext } from '../store/UniContext'
import { getAzure } from '../store/helpers'
import { json } from 'stream/consumers'

const rejectIcon = require('../assets/icons/reject.svg').default as string
const undoIcon = require('../assets/icons/undo.svg').default as string
const acceptIcon = require('../assets/icons/accept.svg').default as string

export default function DiscoverView() {
  const [globalState, dispatch] = useAppContext()
  let x :any[] = []
  const [feed,updateFeed] = useState(x)
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentIndexRef = useRef(currentIndex)
  const [childRefs,changeChildRefs] = useState<RefObject<any>[]>()



  async function acceptUser(TheirId){
    let message = {id:globalState.user.id,accepted_id:TheirId}
    console.log("accpeting with message:" + JSON.stringify(message));
    try {
      let promise = new Promise((resolve, reject) => getAzure(resolve, '/api/acceptUser?', message))
      let resp = (await promise) as any
      if(resp.result){
        return true;
      }
      return false;
    } catch (error) {
        console.log(error)
        return false;
    }

  }
  async function rejectUser(TheirId){
    let message = {id:globalState.user.id,rejected_id:TheirId}
    try {
      let promise = new Promise((resolve, reject) => getAzure(resolve, '/api/rejectUser?', message))
      let resp = (await promise) as any
      if(resp.result){
        return true;
      }
      return false;
    } catch (error) {
        console.log(error)
        return false;
    }

  }
  /**
   * TO DO FOR DISCOVER VIEW:
   * RIGHT SWIPE --> acceptUsers
   * LEFT SWIPE --> rejectedUsers
   * Get rid of Go Back
   * Accepted users to show on Matches page
   */

  async function getFiveUsers(){
    try {
      console.log("our id according to globalstate:" + JSON.stringify(globalState));
      let promise = new Promise((resolve, reject) => getAzure(resolve, '/api/request?', {id:globalState.user.id,n:"10"}))
      let resp = (await promise) as any
      if(resp.result){
        console.log(JSON.stringify(resp))
        updateFeed(resp.ids);
        
        changeChildRefs(Array(resp.ids.length).fill(0).map((i) => React.createRef<any>()));
      console.log("setting refs");
      }
    } catch (error) {
        console.log(error)
    }

  }

  useEffect(() => {
    //update Self

    //getFeed
    getFiveUsers();
    
  }, [])

  // console.log('user', user)
  /*const childRefs = useMemo(
    () =>{
      Array(feed.length)
        .fill(0)
        .map((i) => React.createRef<any>());
      console.log("setting refs");
    },
    []
  )*/

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val)
    currentIndexRef.current = val
  }

  const canSwipe = currentIndex >= 0

  //get 
  /*const updateMatches = async (matchedUserId) => {
    try {
      let promise = new Promise((resolve, reject) => getAzure(resolve, '/api/updateAccount?', {username: globalState.user.id, password: globalState.password}))
      let resp = (await promise) as any
      if(resp.account){
        setUser(resp.account)
      }
    } catch (error) {
        console.log(error)
      }
  }*/

  const swiped = (direction, nameToDelete, swipedUserId) => {
    if (direction === 'right') {
        
    }else{//direction is left

    }
  }
  const swipe = async (dir) => {
    //if able to swipe
    if (canSwipe && currentIndex < feed.length) {
      //if succeeds
      console.log(dir)
      if(dir == "left"){
        console.log("rejecting " + feed[currentIndex]);
        if(await rejectUser(feed[currentIndex])){//succesful rejection
          await (childRefs as RefObject<any>[])[currentIndex].current.swipe(dir) // Swipe the card!
          setCurrentIndex(currentIndex + 1)
        }
      }else{
        if(await acceptUser(feed[currentIndex])){//succesful rejection
          await (childRefs as RefObject<any>[])[currentIndex].current.swipe(dir) // Swipe the card!
          setCurrentIndex(currentIndex + 1)
        }
      }
    } else if(currentIndex >= feed.length){
      console.log("refreshing feed")
      setCurrentIndex(0)
      await getFiveUsers()
    }
  }

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current)
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && (childRefs as RefObject<any>[])[idx].current.restoreCard()
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  }
  if(feed!= undefined && childRefs !=undefined){
  return (
    <>
      <h1 className="pageTitle"> Discover</h1>
      <h3> Who would you like to match with today? </h3>
      <div className="card-container">
        {feed.map((character, index) => (
          <TinderCard ref={childRefs[index]} className="swipe" key={character.id} onSwipe={(dir) => swiped(dir, character.id, index)} onCardLeftScreen={() => outOfFrame(character.id, index)}>
            <div className="card">
              <h3 className="">{character.id}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
      <div className="buttons">
        <img onClick={() => swipe('left')} role="button" src={rejectIcon} alt={'Reject'} width="70" height="70" aria-label={'Reject'} />
        
        <img onClick={() => swipe('right')} role="button" src={acceptIcon} alt={'Accept'} width="70" height="70" aria-label={'Accept'} />
      </div>
    </>
  )
  }else{
    return (
      <><div><p>loading..</p>
      </div></>
    )
  }
}
//<img onClick={() => goBack()} role="button" src={undoIcon} alt={'Undo'} width="70" height="70" aria-label={'Undo'} />
