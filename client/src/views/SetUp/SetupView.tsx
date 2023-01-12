import Button from 'react-bootstrap/Button'
import React, { useState } from 'react'
import AccountInfo from './AccountInfo'
import FiltersSelection from './FiltersSelection'
import { useNavigate } from 'react-router-dom'
import ConfirmPage from './ConfirmPage'
import { useAppContext } from '../../store/UniContext'

import { getAzure } from '../../store/helpers'

export interface FormProps {
  formData: {
    phone: string,
    bio: string,
    hobbies : string[],

    university: string,
    course: string,
    year: string,
    modules: string[],
    language: string
    
    dataConfirmed: boolean
    
  }
}

export interface CompleteFormState {
  phone: string
  bio: string
  hobbies : string[];

  university: string
  course: string
  year: string
  modules: string[]
  language: string
  dataConfirmed : boolean
}

export interface FormDataProps extends FormProps {
  setFormData: React.Dispatch<React.SetStateAction<CompleteFormState>>
}

export default function SetupView() {
  //All the views link to this one Central State called formData which is all updated, clicking submit goes into trySubmit to use this state to make the API calls

  const [globalState] = useAppContext()
  const [page, setPage] = useState(0)
  const [formData, setFormData] = useState<CompleteFormState>({
    phone: '',
    bio: '',
    hobbies : [],

    university: '',
    course: '',
    year: '',
    modules: [],
    language:'',
    dataConfirmed: false
  })
  const FormTitles = ['AccountInfo', 'FiltersSelection', 'ConfirmPage']

  // use the useNavigate hook to get access to the navigate function
  const navigate = useNavigate()

  const formDisplay = () => {
    switch (page) {
      case 0:
        return <AccountInfo formData={formData} setFormData={setFormData} />
      case 1:
        return <FiltersSelection formData={formData} setFormData={setFormData} />
      case 2:
        return <ConfirmPage formData={formData} setFormData={setFormData} />
    }
  }

  async function trySubmit(){
    let promise1 = new Promise((resolve, reject) => getAzure(resolve, '/api/updateAccount?', {username: globalState.user.id ,password: globalState.password, phone: formData.phone, bio: formData.bio, hobbies: formData.hobbies}))
    let resp1 = (await promise1) as any
    //Testing commment below
    //let resp1 = {"dummy":"data", "result" : false}
    
    if(resp1.result === false){
      alert("Couldn't update account - Please check your information")
      return false
    } else {
      let promise2 = new Promise((resolve, reject) => getAzure(resolve, '/api/updateFilters?', {username: globalState.user.id ,password: globalState.password, university: formData.university, course: formData.course, module: formData.modules, year: formData.year}))
      let resp2 = (await promise2) as any

      if(resp2.result === false){
        alert("Couldn't update filters - Please check your filters")
        return false
      } else {
        return true
      }
    }
  }

  return (
    
    <div>
      {formDisplay()}
      <Button
      className ="mx-3" 
      disabled={page === 0} onClick={() => setPage((currentPage) => currentPage - 1)}
      >
        Back
      </Button>
      <Button
        className ="mx-3" 
        disabled ={!formData.dataConfirmed && FormTitles.length - 1 === page}
        onClick={() => {
          if (page === FormTitles.length - 1) {
            
            trySubmit().then(result => {
              if (result === true) {
                // Do something if the function returns true
                alert("Sucessfully updated your account information and filters")
                navigate("/discover")
              }
            });

          } else {
          setPage((currentPage) => currentPage + 1)
          }
        }}
      >
        {page === FormTitles.length - 1 ? "Submit" : "Next"}
      </Button>
    </div>
  )
}
