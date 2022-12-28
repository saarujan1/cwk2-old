import { Form } from 'react-router-dom'
import { useCallback } from 'react'

// TODO: remove this example later on
// REF1: https://reactrouter.com/en/main/start/tutorial#the-root-route
export default function ProfileView() {
  const profile = {
    first: 'My',
    last: 'Name',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1061&q=80',
    twitter: 'my_handle',
    notes: 'Notes',
    favorite: true,
  }

  const confirmDeletion = useCallback((event) => {
    if (!window.confirm('Please confirm you want to delete this record.')) {
      event.preventDefault()
    }
  }, [])

  return (
    <div id="profile">
      <div>
        <img key={profile.avatar} src={profile.avatar || undefined} alt="" />
      </div>

      <div>
        <h1>
          {profile.first || profile.last ? (
            <>
              {profile.first} {profile.last}
            </>
          ) : (
            <i>No Name</i>
          )}{' '}
          <Favorite profile={profile} />
        </h1>

        {profile.twitter && (
          <p>
            <a target="_blank" rel="noreferrer" href={`https://twitter.com/${profile.twitter}`}>
              {profile.twitter}
            </a>
          </p>
        )}

        {profile.notes && <p>{profile.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form method="post" action="destroy" onSubmit={confirmDeletion}>
            <button type="submit">Delete</button>
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
