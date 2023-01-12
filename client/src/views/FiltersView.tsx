import { useAppContext } from '../store/UniContext'
import { useState } from 'react'
import { getAzure } from '../store/helpers'

export default function FiltersView() {
  const [globalState, dispatch] = useAppContext()
  let initial = { ...globalState.filters }
  delete initial['id']
  const [localFilters, changeDisplay] = useState(initial)
  const [error, updateError] = useState('')

  //update localFilters
  const changeHook = (e) => {
    let temp = { ...localFilters }
    temp[e.target.name] = e.target.value
    changeDisplay(temp)
  }

  //map function to list
  const listFilters = Object.keys(localFilters).map((m) => (
    <li>
      <div>
        <p>{m}:</p>
        <input value={localFilters[m]} name={m} onChange={changeHook} placeholder={m} className="form-control" />
      </div>
    </li>
  ))

  //try update filters
  async function tryUpdate() {
    let sendMessage = { ...localFilters }
    //rename username for
    sendMessage['username'] = globalState.user.id
    sendMessage['password'] = globalState.user.password

    let promise = new Promise((resolve, reject) => getAzure(resolve, '/api/updateFilters?', sendMessage))
    let x = (await promise) as any

    if ((x.result = true)) {
      //update GlobalState.filters
      dispatch({
        type: 'CHANGE',
        payload: {
          ['filters']: localFilters,
        },
      })
    } else {
      changeDisplay({ ...globalState.filters })
    }
    updateError(x.msg)
  }

  return (
    <div>
      <h1 className="Filters"> Discover</h1>
      <h3> Set filters to see who you want. </h3>
      <ul id="filtersPage">{listFilters}</ul>
      <button type="button" onClick={tryUpdate} className="c-btn-blue">
        Submit
      </button>
      <p>{error}</p>
    </div>
  )
}
