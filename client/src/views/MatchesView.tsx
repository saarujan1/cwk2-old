import { useAppContext } from '../store/UniContext'
import { getAzure } from '../store/helpers'
import { useState, useEffect} from 'react'


const MatchesView = () => {
  const [matchedProfiles, setMatchedProfiles] = useState<string[]>([])
  const [age, setAge] = useState(null);
  // const matchedUserIds = matches.map(({ user_id }) => user_id);
  const [globalState] = useAppContext()
  // const userId = cookies.UserId;

  async function getMatches() {
    let promise = new Promise((resolve, reject) => getAzure(resolve, '/api/lookupAccount?', { text: '', n: 181 }))
    let resp = (await promise) as any
    setMatchedProfiles(resp.account.accepted)
  }

  return (
    <div className="matches-display">
      <h1 className="titlePage"> Matches</h1>
      <label> Match 1 </label>
      <label> Match 2 </label>
    </div>
  );
}
  
export default MatchesView