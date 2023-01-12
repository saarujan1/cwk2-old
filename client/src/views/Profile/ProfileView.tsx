import { Form } from 'react-router-dom'
import { useCallback } from 'react'
import { useAppContext } from '../../store/UniContext'
import Panel from '../../components/Panels/Panel'

export default function ProfileView() {
  const [userData, updateUserDat] = useAppContext()

  const confirmDeletion = useCallback((event) => {
    if (!window.confirm('Please confirm you want to delete this record.')) {
      event.preventDefault()
    }
  }, [])

  const listHobbies = userData.user.hobbies.map((hobby) => <button className="c-btn-purple">{hobby}</button>)

  console.log(JSON.stringify(userData))
  return (
    <>
      <h2 className="text-light-cream">Welcome, {userData.user.id ? <span className="text-darker-gray fw-bold">{userData.user.id}</span> : <p>No Name</p>}</h2>
      <Panel padding={3} width="col-4" color="bg-bdg" shadow>
        <h3 className="c-heading fancy-font">Basic info</h3>
        <p>Bio</p> {userData.user.bio && <p>{userData.user.bio}</p>}
      </Panel>
      <Panel padding={3} width="col-4" color="bg-bdg" shadow>
        <h3 className="c-heading fancy-font">Interests</h3>
        {userData ? listHobbies : ''}
      </Panel>

      <button type="button" className="c-btn-blue" onClick={confirmDeletion}>
        Delete
      </button>
    </>
  )
}
