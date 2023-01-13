import { useAppContext } from '../store/UniContext'
import { getAzure } from '../store/helpers'
import { useState, useEffect } from 'react'
import Panel from '../components/Panels/Panel'

const MatchesView = () => {
  const [matchedAccounts, setMatchedAccounts] = useState<any[]>([])
  const [globalState] = useAppContext()

  useEffect(() => {
    async function fetchData() {
      let promise = new Promise((resolve, reject) => getAzure(resolve, '/api/lookupAccount?', {id : globalState.user.id}))
      let resp = (await promise) as any
      
      if (resp.result === false) {
          console.log("error getting account")
          return;
      }
      
      if (resp.account.matched && Array.isArray(resp.account.matched)) {
          let matchedIds = resp.account.matched;
          for (let id of matchedIds) {
            console.log("id being passed in")
            let matchPromise = new Promise((resolve, reject) => getAzure(resolve, '/api/lookupAccount?', {id: id}))
            let matchResp = (await matchPromise) as any
            if (matchResp.result === false) {
                console.log("error getting match account")
                continue;
            }
            setMatchedAccounts(prevState => [...prevState, {...matchResp.account, ...matchResp.filters}])
          }
      } else {
          console.log("user does not have any matched accounts.")
      }
    }
    fetchData();
  }, []);

  console.log(matchedAccounts)

  return (
    <div>
      <h1 className="titlePage"> Matches</h1>
      <div className="match-display row row-cols-3 p-3">
        
      {matchedAccounts.map((account, index) => {
        return (
          <Panel padding={3} color="bg-bdg">
          <div id = "matches"key={index} className="match-label">
            <div className="col1">
              <h3 className="match-text-id">ID: {account.id}</h3>
              <p className="match-text-left">Age: {account.age}</p>
              <p className="match-text-left">Bio: {account.bio}</p>
              <p className="match-text-left">Hobbies: {account.hobbies.join(', ')}</p>
              <p className="match-text-left">Year: {account.language}</p>
            </div>
            <div className="col2">
              <p className="match-text-right">University: {account.university}</p>
              <p className="match-text-right">Course: {account.course}</p>
              <p className="match-text-right">Modules: {account.modules.join(', ')}</p>
              <p className="match-text-right">Year: {account.year}</p>
            </div>
            
          </div>
          </Panel>
        )
      })}</div>
      </div>
    
  );
}
  
export default MatchesView 

