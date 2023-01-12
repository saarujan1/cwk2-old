import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import React, { useState } from 'react'
import AccountInfo from './AccountInfo'
import FiltersSelection from './FiltersSelection'
import { useNavigate } from 'react-router-dom'
import SetupView2 from './SetupView2'

export interface FormProps {
  formData: {
    phone: string,
    bio: string,
    hobbies : string[],

    university: string,
    course: string,
    year: string,
    modules: string[]
  }
}

export interface CompleteFormState {
  phone: string
  bio: string
  hobbies : string[];

  university: string
  course: string
  year: string
  modules: string[];
}

export interface FormDataProps extends FormProps {
  setFormData: React.Dispatch<React.SetStateAction<CompleteFormState>>
}

export default function SetupView() {
  const [page, setPage] = useState(0)
  const [formData, setFormData] = useState<CompleteFormState>({
    phone: '',
    bio: '',
    hobbies : [],

    university: '',
    course: '',
    year: '',
    modules: []
  })
  const FormTitles = ['AccountInfo', 'FiltersSelection', 'Confirm']

  // use the useNavigate hook to get access to the navigate function
  const navigate = useNavigate()

  const formDisplay = () => {
    switch (page) {
      case 0:
        return <AccountInfo formData={formData} setFormData={setFormData} />
      case 1:
        return <FiltersSelection formData={formData} setFormData={setFormData} />
    }
  }

  return (
    <div>
      {formDisplay()}
      <Button disabled={page === 0} onClick={() => setPage((currentPage) => currentPage - 1)}>
        Prev
      </Button>
      <Button
        onClick={() => {
          setPage((currentPage) => currentPage + 1)
          // if the current page is the last page, navigate to the /discover route
          if (page === 2) {
            navigate('/discover') // idk if this works
          }
        }}
      >
        Next
      </Button>
    </div>
  )
}
