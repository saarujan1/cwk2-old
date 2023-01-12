import { useAppContext } from '../store/UniContext'
import { useState } from 'react'
import { getAzure } from '../store/helpers'
import Panel from '../components/Panels/Panel'
import { isDataView } from 'util/types'

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
    <Panel padding={3} color="bg-bdg" square>
      <div>
        <h4 className="text-light-cream">{m.split('_').join(' ')}</h4>
        <input value={localFilters[m]} name={m} onChange={changeHook} className="form-input" />
      </div>
    </Panel>
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
    <>
      <div className="p-3 col">
        <h1 className="c-heading text-white">Filters</h1>
      </div>
      <div className="row row-cols-3 p-3">
        {listFilters}
        <p>{error}</p>
      </div>
      <Panel padding={3}>
        <button type="button" onClick={tryUpdate} className="c-btn-white">
          Submit
        </button>
      </Panel>
    </>
  )
}
