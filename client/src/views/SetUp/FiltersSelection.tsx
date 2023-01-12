import Form from 'react-bootstrap/Form'
import { FormDataProps } from './SetupView'

import { getAzure } from '../../store/helpers'
import { Button } from 'react-bootstrap'
import React, { useState } from 'react'
import CreatableSelect from 'react-select/creatable';
import { MultiValue } from 'react-select/dist/declarations/src';

export default function InterestsSelection({ formData, setFormData }: FormDataProps) {

  const [uniList, setUniList] = useState([])
  const [courseList, setCourseList] = useState<string[]>([])
  const [moduleList, setModuleList] = useState<string[]>([])



  type OptionType = {
    value: string;
    label: string;
  };

  //Refreshes the drop downs with new data, when you leave this view and go back to it
  React.useEffect(() => {
    setupSelects()
    if(formData.university != ""){
      getCourses(formData.university)
    }
    if(formData.course != ""){
      getModules(formData.university, formData.course)
    }
  },[])

  async function setupSelects(){
    setUniList( await getUniversities())
  }


  //Calls to populate the dropdowns
  async function getUniversities() {
    let promise = new Promise((resolve, reject) => getAzure(resolve, '/api/getUniversities?', { text: "", n: 181 }))
    let x = (await promise) as any
    return x.unis.sort()
  }

  async function getCourses(university){
    let promise = new Promise((resolve, reject) => getAzure(resolve, '/api/getCourses?', {text: "", university: university, n: 20}))
    let x = (await promise) as any
    setCourseList(x.courses)

    //uncomment below and comment out above for testing
    //const testArray = ["Math","Computer Science","Biology"]
    //setCourseList(testArray)
  }

  async function getModules(university, course){
    let promise = new Promise((resolve, reject) => getAzure(resolve, '/api/getModules?', {text: "", university: university, course: course, n: 20}))
    let x = (await promise) as any
    setModuleList(x.modules)

    //uncomment below and comment out above for testing
    //const testArray = ["COMP221","COMP22","COMP3311"]
    //setModuleList(testArray)
  }


  return (


    <Form>
    <Form.Label>University</Form.Label>
    <Form.Select onChange={(e) => {setFormData({ ...formData, university: e.target.value });
    getCourses(e.target.value)
    }} 
    value={formData.university}>
      <option> Choose a University...</option>
      {uniList.map((currentUni,index)=> (
        <option key = {index} value = {currentUni}>{currentUni}</option>
      ))}
    </Form.Select>

    <Form.Label>Course</Form.Label>
    <Form.Control onChange={(e) => setFormData({ ...formData, course: e.target.value })} value={formData.course}></Form.Control>
    <Form.Select onChange={(e) => {
      setFormData({ ...formData, course: e.target.value })
      getModules(formData.university,e.target.value)
      }
        } 
      value={formData.course}>
      <option> Choose a Course...</option>
      {courseList.map((currentCourse,index) => (
        <option key = {index} value = {currentCourse}>{currentCourse}</option>
      ))}
    </Form.Select>

    <Form.Label>Module</Form.Label>
    <CreatableSelect
      isMulti
      defaultValue={formData.modules.map((module) => ({value: module, label: module}))}
      options={moduleList.map((module) => ({value: module, label: module}))}

      onChange={(o: MultiValue<OptionType>) => {
            
        setFormData({ ...formData, modules: o.map((item) => item.value) })
      }}
    />

    <Form.Label>Year</Form.Label>
    <Form.Select onChange={(e) => setFormData({ ...formData, year: e.target.value })} value={formData.year}>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
    </Form.Select>


    <Form.Label>Language</Form.Label>
    <Form.Select onChange={(e) => setFormData({ ...formData, language: e.target.value })} value={formData.year}>
      <option value="English">English</option>
      <option value="French">French</option>
      <option value="Chinese">Chinese</option>
      <option value="German">German</option>
      <option value="Hindi">Hindi</option>
      <option value="Spanish">Spanish</option>
      <option value="Arabic">Arabic</option>
      <option value="Portugese">Portugese</option>
      <option value="Russian">Russian</option>
      <option value="Greek">Greek</option>
      <option value="Japanese">Japanese</option>
      <option value="Italian">Italian</option>
    </Form.Select>
    </Form>

    


  );
}
