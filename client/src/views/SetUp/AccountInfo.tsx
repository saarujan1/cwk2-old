import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select'

import { FormDataProps } from './SetupView'
import React, { useState } from 'react'
import { MultiValue } from 'react-select/dist/declarations/src';



export default function PersonalInfo({ formData, setFormData }: FormDataProps) {

  const [selectedOptions, setSelectedOptions] = React.useState<MultiValue<OptionType>>(formData.hobbies.map((hobby) => ({value: hobby, label: hobby})));

  type OptionType = {
    value: string;
    label: string;
  };
  

  return (
    <Form>
      <Form.Group className="mb-3" controlId="formPhone">
        <label>Phone</label>
        <Form.Control onChange={(e) => setFormData({ ...formData, phone: e.target.value })} value={formData.phone} type="text" placeholder="Phone" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBio">
        <label>Bio</label>
        <Form.Control onChange={(e) => setFormData({ ...formData, bio: e.target.value })} value={formData.bio} type="text" placeholder="Bio" as="textarea" rows={3} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formHobbies">
        <label>Hobbies - You can select up to 5</label>
        <CreatableSelect
          isMulti
          defaultValue={formData.hobbies.map((hobby) => ({value: hobby, label: hobby}))}
          onChange={(o: MultiValue<OptionType>) => {
            
            setFormData({ ...formData, hobbies: o.map((item) => item.value) })
            setSelectedOptions(o);
          }}
          isOptionDisabled={() => selectedOptions.length >= 5}
          />
      
        
      </Form.Group>


    </Form>
  );
}
