import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';

import { FormDataProps } from "./SetupPage";

export default function PersonalInfo({formData, setFormData}: FormDataProps){
    return(
        <Form>
      <Form.Group className="mb-3" controlId="formName">
        <Form.Label>Name</Form.Label>
        <Form.Control onChange={(e)=>setFormData({...formData, name: e.target.value})} value={formData.name} type="text" placeholder="Name" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formSurname">
        <Form.Label>Surname</Form.Label>
        <Form.Control onChange={(e)=>setFormData({...formData, surname: e.target.value})} value={formData.surname} type="text" placeholder="Surname" />
      </Form.Group>
    </Form>
    )
}