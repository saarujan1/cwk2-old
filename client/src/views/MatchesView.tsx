import { useAppContext } from '../store/UniContext'
import { getAzure } from '../store/helpers'
import { useState, useEffect} from 'react'


const MatchesView = () => {
  const [matchedProfiles, setMatchedProfiles] = useState<string[]>([])
  const [age, setAge] = useState(null);
  // const matchedUserIds = matches.map(({ user_id }) => user_id);
  const [globalState] = useAppContext()
  // const userId = cookies.UserId;

  const getMatches = async () => {
      let path = '/api/lookupAccount?'
      let message = { username: globalState.user.id}
      console.log(message)
      let promise = new Promise((resolve, reject) => getAzure(resolve, path, message))
      let resp = (await promise) as any
      setMatchedProfiles(resp.account.accepted);
      setMatchedProfiles(resp.account.age);
      }
  console.log(matchedProfiles)
  console.log(age)

  return (
    <div className="matches-display">
      <h1 className="titlePage"> Matches</h1>
      <label> Match 1 </label>
      <label> Match 2 </label>
    </div>
  );
}
  
export default MatchesView