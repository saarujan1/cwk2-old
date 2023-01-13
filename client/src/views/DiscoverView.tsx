import React, { useEffect, useState, createRef, useRef, useMemo, RefObject } from 'react'
import TinderCard from 'react-tinder-card'
import { useAppContext } from '../store/UniContext'
import { getAzure } from '../store/helpers'
import { json } from 'stream/consumers'
import Panel from '../components/Panels/Panel'
import { Loader } from '@chatscope/chat-ui-kit-react'

const rejectIcon = require('../assets/icons/reject.svg').default as string
const acceptIcon = require('../assets/icons/accept.svg').default as string

export default function DiscoverView() {
  const [globalState, dispatch] = useAppContext()
  let x: any[] = []
  const [reRender,updateRender] = useState(false);
  const [feed, updateFeed] = useState(x)
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentIndexRef = useRef(currentIndex)
  const [childRefs, changeChildRefs] = useState<RefObject<any>[]>()
  
  async function acceptUser(TheirId) {
    let message = { id: globalState.user.id, accepted_id: TheirId }
    console.log('accepting with message:' + JSON.stringify(message))
    try {
      let promise = new Promise((resolve, reject) => getAzure(resolve, '/api/acceptUser?', message))
      let resp = (await promise) as any
      if (resp.result) {
        return true
      }
      return false
    } catch (error) {
      console.log(error)
      return false
    }
  }
  async function rejectUser(TheirId) {
    let message = { id: globalState.user.id, rejected_id: TheirId }
    try {
      let promise = new Promise((resolve, reject) => getAzure(resolve, '/api/rejectUser?', message))
      let resp = (await promise) as any
      if (resp.result) {
        return true
      }
      return false
    } catch (error) {
      console.log(error)
      return false
    }
  }
  /**
   * TO DO FOR DISCOVER VIEW:
   * RIGHT SWIPE --> acceptUsers
   * LEFT SWIPE --> rejectedUsers
   * Get rid of Go Back
   * Accepted users to show on Matches page
   */

  async function getFiveUsers() {
    try {
      console.log('our id according to globalstate:' + JSON.stringify(globalState))
      let promise = new Promise((resolve, reject) => getAzure(resolve, '/api/request?', { id: globalState.user.id, n: '5' }))
      let resp = (await promise) as any
      let temp: any = []

      if (resp.result) {
        console.log(JSON.stringify(resp))
        //getvalues

        for (const x of resp.ids) {
          let newDetails = await getUserDetails(x)
          console.log('Their details' + JSON.stringify(newDetails))
          temp.push(newDetails)
        }
        updateFeed(temp)
      }
    } catch (error) {
      console.log(error)
    }
  }
  async function getUserDetails(userId) {
    let promise = new Promise((resolve, reject) => getAzure(resolve, '/api/lookupAccount?', { id: userId }))
    let resp = (await promise) as any

    return {account:resp.account, filters:resp.filters}
  }

  useEffect(() => {
    //jankycode to reRender
    if(!reRender){
      updateRender(true)
    }
    
    //getFeed
    getFiveUsers()
  }, [reRender])

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
      let promise = new Promise((resolve, reject) =>
        getAzure(resolve, '/api/updateAccount?', {
          username: globalState.user.id,
          password: globalState.password,
        })
      )
      let resp = (await promise) as any
      if (resp.account) {
        setUser(resp.account)
      }
    } catch (error) {
        console.log(error)
      }
  }*/

  const swiped = (direction, swipedUserId) => {
    if (direction === 'right') {
    } else {
      //direction is left
    }
  }
  const swipe = async (dir) => {
    //if able to swipe
    console.log('index:' + currentIndex.toString() + ' when swiping')
    if (canSwipe && currentIndex < feed.length) {
      //if succeeds
      console.log(dir)
      if (dir == 'left') {
        console.log('rejecting ' + feed[currentIndex].account.id)
        if (await rejectUser(feed[currentIndex].account.id)) {
          //succesful rejection
          //await (childRefs as RefObject<any>[])[currentIndex].current.swipe(dir) // Swipe the card!
          setCurrentIndex(currentIndex + 1)
        }
      } else {
        if (await acceptUser(feed[currentIndex].account.id)) {
          //succesful rejection
          //await (childRefs as RefObject<any>[])[currentIndex].current.swipe(dir) // Swipe the card!
          setCurrentIndex(currentIndex + 1)
        }
      }
    } else if (currentIndex >= feed.length) {
      console.log('refreshing feed')
      setCurrentIndex(0)
      await getFiveUsers()
    }
  }

  /*const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current)
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && (childRefs as RefObject<any>[])[idx].current.restoreCard()
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  }*/
  if (feed.length != 0 && currentIndex != feed.length) {
    return (
      <>
        <div className="p-3 col">
          <h2 className="text-light-cream">Discover</h2>
        </div>
        <div className="d-flex flex-column h-100 align-items-center">
          <Panel height="h70" width="col-12" padding={3} className="d-flex justify-content-center">
            <div className="card-container col" style={{ width: '300px', height: '500px' }}>
              <TinderCard className="swipe" key={feed[currentIndex].account.id} onSwipe={(dir) => swiped(dir, feed[currentIndex].account.id)} onCardLeftScreen={() => console.log('something leftscreen')}>
                <div className={'card' + (currentIndex == feed.length - 1 ? ' front-card' : '')}>
                  <h3>
                    {feed[currentIndex].account.id} - {feed[currentIndex].account.age}
                  </h3>
                  <h4>
                    {feed[currentIndex].filters.university}
                  </h4>
                  <h5>
                    {feed[currentIndex].filters.course}
                  </h5>
                  <div className="attributes">
                    <p className="attribute-text">Bio: {feed[currentIndex].account.bio}</p>
                    <p className="attribute-text">Hobbies: {feed[currentIndex].account.hobbies}</p>
                  </div>
                </div>
              </TinderCard>
            </div>
          </Panel>
          <Panel height="h30" width="col-12" padding={3} className="d-flex justify-content-center">
            <img onClick={() => swipe('left')} role="button" src={rejectIcon} alt={'Reject'} width="100" height="100" aria-label={'Reject'} />
            {/* <img onClick={() => goBack()} role="button" src={undoIcon} alt={'Undo'} width="100" height="100" aria-label={'Undo'} /> */}
            <img onClick={() => swipe('right')} role="button" src={acceptIcon} alt={'Accept'} width="100" height="100" aria-label={'Accept'} />
          </Panel>
        </div>
      </>
    )
  } else {
    return (
      <>
        <div className="h-100 w-100 d-flex align-items-center justify-content-center">
          <Loader style={{ scale: '3.5' }} />
        </div>
      </>
    )
  }
}
//{feed.map((character, index) => (
//))}
//<img onClick={() => goBack()} role="button" src={undoIcon} alt={'Undo'} width="70" height="70" aria-label={'Undo'} />
