import TinderCard from 'react-tinder-card'
import {useEffect, useState} from 'react'
import ChatContainer from '../components/ChatBox'
//import {useCookies} from 'react-cookie'
import axios from 'axios'

const DiscoverView2 = () => {
    const [user, setUser] = useState(null)
    const [genderedUsers, setGenderedUsers] = useState(null)
    const [lastDirection, setLastDirection] = useState()
    //const [cookies, setCookie, removeCookie] = useCookies(['user'])
    //const userId = cookies.UserId

    const characters = [
        {
          name: 'Richard Hendricks',
          url: './img/richard.jpg'
        },
        {
          name: 'Erlich Bachman',
          url: './img/erlich.jpg'
        },
        {
          name: 'Monica Hall',
          url: './img/monica.jpg'
        },
        {
          name: 'Jared Dunn',
          url: './img/jared.jpg'
        },
        {
          name: 'Dinesh Chugtai',
          url: './img/dinesh.jpg'
        }
      ]

      const swiped = (direction, nameToDelete) => {
        console.log('removing: ' + nameToDelete)
        setLastDirection(direction)
      }
    
      const outOfFrame = (name) => {
        console.log(name + ' left the screen!')
      }
      
    return (
        <>
            {user &&
            <div className="dashboard">
                <ChatContainer user={user}/>
                <div className="swipe-container">
                    <div className="card-container">
                    {characters.map((character) =>
                    <TinderCard className='swipe' key={character.name} onSwipe={(dir) => swiped(dir, character.name)} onCardLeftScreen={() => outOfFrame(character.name)}>
                        <div style={{ backgroundImage: 'url(' + character.url + ')' }} className='card'>
                        <h3>{character.name}</h3>
                        </div>
                    </TinderCard>
                    )}
                        <div className="swipe-info">
                            {lastDirection ? <p>You swiped {lastDirection}</p> : <p/>}
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}
export default DiscoverView2