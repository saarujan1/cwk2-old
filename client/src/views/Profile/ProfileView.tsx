import { Form } from 'react-router-dom'
import { useCallback } from 'react'
import { useAppContext } from '../../store/UniContext'

// TODO: remove/change twitter handle and change edit/delete options
// REF1: https://reactrouter.com/en/main/start/tutorial#the-root-route
export default function ProfileView() {
  const [userData, updateUserDat] = useAppContext()


  const confirmDeletion = useCallback((event) => {
    if (!window.confirm('Please confirm you want to delete this record.')) {
      event.preventDefault()
    }
  }, [])

  console.log(JSON.stringify(userData))

  return (
    <div id="profile">
      <h1 className="pageTitle"> Profile</h1>
      <div>
        <h2>
          {userData.user.id ? <>{userData.user.id}</> : <i>No Name</i>} <Favorite profile={userData.user} />
        </h2>

        {userData.user.bio && <p>{userData.user.bio}</p>}

        <div>
          <Form action="edit">
            <button type="submit" className="c-btn-blue">
              Edit
            </button>
          </Form>
          <Form method="post" action="destroy" onSubmit={confirmDeletion}>
            <button type="submit" className="c-btn-blue">
              Delete
            </button>
          </Form>
        </div>
      </div>
    </div>
  )
}

function Favorite({ profile }) {
  // yes, this is a `let` for later
  let favorite = profile.favorite
  return (
    <Form method="post">
      <button name="favorite" value={favorite ? 'false' : 'true'} aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}>
        {favorite ? '★' : '☆'}
      </button>
    </Form>
  )
}
// END OF REF1

// REFERENCES
// REF1: https://reactrouter.com/en/main/start/tutorial#the-root-route
