import { useAppContext } from '../store/UniContext'
import { getAzure } from '../store/helpers'
import { useState, useEffect } from 'react'

const MatchesView = () => {
  const [matchedProfiles, setMatchedProfiles] = useState<string[]>([])
  const [globalState,dispatch] = useAppContext()

  useEffect(() => {
    async function fetchData() {
      let promise = new Promise((resolve, reject) => getAzure(resolve, '/api/lookupAccount?', {id : globalState.user.id}))
      let resp = (await promise) as any
      setMatchedProfiles(resp.account.matched)
    }
    fetchData();
  }, []);

  console.log(matchedProfiles)

  return (
    <div className="matches-display">
      <h1 className="titlePage"> Matches</h1>
      {matchedProfiles.map((match, index) => {
        return <label key={index} className="match-label"> {match}</label>
      })}
    </div>
  );
}
  
export default MatchesView