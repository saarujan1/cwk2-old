import Form from 'react-bootstrap/Form'
import { FormDataProps } from './SetupView'

export default function ConfirmPage({ formData, setFormData }: FormDataProps) {

return (


    <Form>
        <Form.Group controlId="formFile">
            <Form.Check
                onChange={(e) => {setFormData({...formData, dataConfirmed: !formData.dataConfirmed})}}
                checked={formData.dataConfirmed}
                type="checkbox"
                label="Is all the information you just entered correct?"
            
            />

        </Form.Group>
    </Form>

);


}