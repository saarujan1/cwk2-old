import { useAppContext } from '../UniContext'
import React, { useState } from 'react'
import { getAzure } from '../shared.js'
import e from 'express';
export default function FiltersView() {
  const [globalState,dispatch] = useAppContext();
  let initial = {...globalState.filters};
  delete initial['id']
  const [localFilters,changeDisplay] = useState(initial);
  const [error,updateError] = useState('');

  //update localFilters
  const changeHook = (e) => {
    let temp = {...localFilters};
    temp[e.target.name] = e.target.value;
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
  async function tryUpdate(){
    let sendMessage = {...localFilters}
    //rename username for 
    sendMessage['username'] = globalState.user.id;
    sendMessage['password'] = globalState.user.password    

    let promise = new Promise((resolve, reject) => getAzure(resolve, '/api/updateFilters?', sendMessage))
    let x = (await promise) as any

    if(x.result = true){
      //update GlobalState.filters
      dispatch({
        type: 'CHANGE',
        payload: {
          ['filters']: localFilters,
        },
      })
    }else{
      changeDisplay({...globalState.filters})
    }
    updateError(x.msg);
  }


  return (
    <div>
      <ul id="filtersPage">
        {listFilters}
      </ul >
      <button type="button" onClick={tryUpdate} className="btn btn-info">
        Submit
      </button>
      <p>{error}</p>
    </div>
  )
}
