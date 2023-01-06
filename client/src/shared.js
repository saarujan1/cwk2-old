import axios from 'axios'
// import resolve from 'path'

export let usersToSockets = new Map()
export let socketsToUsers = new Map()
export let usersToMatches = new Map()

export let users = new Array()

// Makes a call to an Azure function with a given path and JSON input, and returns the response
/*export function getAzure(resolve, path, strjson) {
  let url = 'https://unimatch.azurewebsites.net' + path + 'code=ICv8UmG9odsVgfA879OdhsW317Bt1rBy89gKgqeNEQhoAzFusfM-Mg=='

  request.post(
    url,
    { json: strjson },

    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log('Response Body: ' + JSON.stringify(body))
        resolve(JSON.parse(JSON.stringify(body)))
      } else {
        console.log(error)
        console.log(response.statusCode)
        resolve({ result: false })
      }
    }
  )
} */
//
export async function getAzure(resolve,path,message){
  let url = 'https://unimatch.azurewebsites.net' + path + 'code=ICv8UmG9odsVgfA879OdhsW317Bt1rBy89gKgqeNEQhoAzFusfM-Mg=='
  console.log("posting" + message)
  const resp = await axios.post(url, message);

  if (resp.status == 200) {
    console.log('Response Body: ' + JSON.stringify(resp.data))
    resolve({result: true})
  } else {
    console.log(resp.statusText)
    console.log(resp.status)
    resolve({ result: false })
  }
}

// module.exports = { getAzure, usersToSockets, usersToMatches, socketsToUsers, users }
