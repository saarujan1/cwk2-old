import Form from 'react-bootstrap/Form'
import CreatableSelect from 'react-select/creatable'
import { FormDataProps } from './SetupView'
import React, { useState } from 'react'
import { MultiValue } from 'react-select/dist/declarations/src';

export default function PersonalInfo({ formData, setFormData }: FormDataProps) {
  //I have to map between reactState which uses the OptionType Object and a Array of hobbies string[]

  //Example of how the state looks like:
  // const options = [
  //   { value: 'chocolate', label: 'Chocolate' },
  //   { value: 'strawberry', label: 'Strawberry' },
  //   { value: 'vanilla', label: 'Vanilla' }
  // ]

  const [selectedOptions, setSelectedOptions] = React.useState<MultiValue<OptionType>>(formData.hobbies.map((hobby) => ({ value: hobby, label: hobby })))

  type OptionType = {
    value: string
    label: string
  }

  return (
    <Form>
      <Form.Group className="mb-3" controlId="formPhone">
        <Form.Label>Phone</Form.Label>
        <Form.Control onChange={(e) => setFormData({ ...formData, phone: e.target.value })} value={formData.phone} type="text" placeholder="Phone" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBio">
        <Form.Label>Bio</Form.Label>
        <Form.Control onChange={(e) => setFormData({ ...formData, bio: e.target.value })} value={formData.bio} type="text" placeholder="Bio" as="textarea" rows={3} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formAge">
        <Form.Label>Age</Form.Label>
        <Form.Control onChange={(e) => setFormData({ ...formData, age: e.target.value })} value={formData.age} type="number"/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formHobbies">
        <Form.Label>Hobbies - You can select up to 5</Form.Label>
        <CreatableSelect
          isMulti
          defaultValue={formData.hobbies.map((hobby) => ({ value: hobby, label: hobby }))}
          onChange={(o: MultiValue<OptionType>) => {
            setFormData({ ...formData, hobbies: o.map((item) => item.value) })
            setSelectedOptions(o)
          }}
          isOptionDisabled={() => selectedOptions.length >= 5}
        />
      </Form.Group>
    </Form>
  )
}
