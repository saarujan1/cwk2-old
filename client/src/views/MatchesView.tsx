import { useAppContext } from '../store/UniContext'
import { getAzure } from '../store/helpers'
import { useState } from 'react'

export default function MatchesView() {

  /*Needs to display all matches for given user
   * This should be in the form of a label
   */
  
  return (
    <div>
      <h1 className="pageTitle"> Matches</h1>
      <h3> Change settings </h3>
    </div>
  )
}
