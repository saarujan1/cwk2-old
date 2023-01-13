import { Form } from 'react-router-dom'
import React, { useCallback, useEffect } from 'react'
import { useAppContext } from '../../store/UniContext'
import Panel from '../../components/Panels/Panel'
import DisplayVal from '../../components/Panels/DisplayVal'
import PanelHeader from '../../components/Panels/PanelHeader'
import { getAzure } from '../../store/helpers'

export default function ProfileView() {
  const [userData, dispatch] = useAppContext()
  console.log('globalState according to profile:' + JSON.stringify(userData))

  const confirmDeletion = useCallback((event) => {
    if (!window.confirm('Please confirm you want to delete this record.')) {
      event.preventDefault()
    }
  }, [])
  // userData.user.hobbies
  //Damian Changed this below
  const listHobbies = userData.user.hobbies.map((hobby) => <button className="col-4 c-btn-purple">{hobby}</button>)

  console.log(JSON.stringify(userData))
  // globalState according to profile:{"error":"","valid":true,"returnMessage":"","test":"","user":{"id":"123456789","password":"$2b$12$QKLEA9.B6FCf8dXHzVk.MewL4Sye6cZ.Evenl1NER1ggyrEGabxjy","email":"123456789@gmail.com","profile_pic_id":"","phone":"07455262299","bio":"123456789","hobbies":[],"accepted":["babdah","test123","damiantesting123","testingdamian"],"rejected":["test123","noahnoah"],"matched":["babdah","test123"],"communicationID":"8:acs:cecc501c-25ca-4b1c-a4fd-a786b9c9f431_00000016-46ad-6454-3f82-af3a0d004718"},"filters":{"id":"123456789","university":"Aga Khan University","course":"","year":"2","language":"","study_method":"","study_time":""},"password":""}

  return (
    <>
      <h2 className="c-heading text-light-white">Welcome, {userData.user.id ? <span className="fw-bold">{userData.user.id}</span> : <p>no Name</p>}</h2>
      <div className="row">
        <Panel padding={5} width="col-5" color="bg-bdg" className="d-flex" shadow>
          <PanelHeader color="mb-3" noPadding>
            <h3 className="c-heading">Basic info</h3>
          </PanelHeader>
          <div className="">
            <DisplayVal label="university">{userData.filters.university}</DisplayVal>
            <DisplayVal label="course">{userData.filters.course}</DisplayVal>
            <DisplayVal label="bio">{userData.user.bio}</DisplayVal>
            <DisplayVal label="email">{userData.user.email}</DisplayVal>
            <DisplayVal label="phone">{userData.user.phone}</DisplayVal>
          </div>
        </Panel>
        <Panel padding={5} width="col-5" color="bg-bdg" shadow>
          <PanelHeader color="mb-3" noPadding>
            <h3 className="c-heading">Hobbies</h3>
          </PanelHeader>
          <div className="row w-100 row-cols-2 m-0 g-4">{userData ? listHobbies : ''}</div>
        </Panel>
      </div>
    </>
  )
}
