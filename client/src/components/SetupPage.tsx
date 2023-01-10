import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import React, { useState } from 'react'
import PersonalInfo from './PersonalInfo'
import InterestsSelection from './InterestsSelection'
import ProfilePictureImport from './ProfilePictureImport'

export interface FormProps {
  formData: {
    name: string
    surname: string
    dateOfBirth: string
    university: string
    course: string
    interests: string
  }
}

export interface CompleteFormState {
  name: string
  surname: string
  dateOfBirth: string
  university: string
  course: string
  interests: string
}

export interface FormDataProps extends FormProps {
  setFormData: React.Dispatch<React.SetStateAction<CompleteFormState>>
}

export default function SetupPage() {
  const [page, setPage] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    dateOfBirth: '',
    university: '',
    course: '',
    interests: '',
  })
  const FormTitles = ['PersonalInfo', 'InterestsSelection', 'ProfilePictureImport']

  const formDisplay = () => {
    switch (page) {
      case 0:
        return <PersonalInfo formData={formData} setFormData={setFormData} />
      case 1:
        return <InterestsSelection formData={formData} setFormData={setFormData} />
      case 2:
        return <ProfilePictureImport formData={formData} setFormData={setFormData} />
    }
  }

  return (
    <div>
      {formDisplay()}
      <Button disabled={page === 0} onClick={() => setPage((currentPage) => currentPage - 1)}>
        Prev
      </Button>
      <Button onClick={() => setPage((currentPage) => currentPage + 1)}>Next</Button>
    </div>
  )
}
