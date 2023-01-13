import { useAppContext } from '../store/UniContext'
import { useState } from 'react'
import React from 'react';
import Form from 'react-bootstrap/Form'
import CreatableSelect from 'react-select/creatable'

import { MultiValue } from 'react-select/dist/declarations/src'


import { getAzure } from '../store/helpers'
import Panel from '../components/Panels/Panel'
import { isDataView } from 'util/types'
import { Filter } from '../store/Filter'
import { json } from 'stream/consumers';

export default function FiltersView() {
  const [globalState, dispatch] = useAppContext()
  let initial = { ...globalState.filters }
  delete initial['id']
  const [localFilters, changeDisplay] = useState(initial)
  const [error, updateError] = useState('')

  const [uniList, setUniList] = useState([])
  const [courseList, setCourseList] = useState<string[]>([])
  const [moduleList, setModuleList] = useState<string[]>([])

    interface FormProps {
    formData: {
      university: string,
      course: string,
      year: string,
      modules: string[],
      language: string
    }
  }
  
    interface CompleteFormState {
    university: string
    course: string
    year: string
    modules: string[]
    language: string
  }

  const [formData, setFormData] = useState<CompleteFormState>({
    university: '',
    course: '',
    year: '',
    modules: [],
    language:''
  })

  type OptionType = {
    value: string
    label: string
  }

  //update localFilters also not used
  const changeHook = (e) => {
    let temp = { ...localFilters }
    temp[e.target.name] = e.target.value
    changeDisplay(temp)
  }

  //map function to list
  // const listFilters = () => {
  //   const uniFilters: Filter[] = []
  //   const studyFilters: Filter[] = []
  //   const otherFilters: Filter[] = []
  //   Object.keys(localFilters).map((m) => {
  //     if (m.id == 'university' || m.id == 'course' || m.id == 'year') {
  //       uniFilters.push(m)
  //     } else if (m.id.includes('study')) {
  //       studyFilters.push(m)
  //     } else {
  //       otherFilters.push(m)
  //     }
  //   })

  //   return (
  //     <>
  //       <Panel padding={3} color="bg-bdg" square>
  //         <Panel padding={3} color="bg-bdg" square>
  //           <div>
  //             <h4 className="text-light-cream">{m.split('_').join(' ')}</h4>
  //             <input value={localFilters[m]} name={m} onChange={changeHook} className="form-input" />
  //           </div>
  //         </Panel>
  //       </Panel>
  //       <Panel padding={3} color="bg-bdg" square></Panel>
  //       <Panel padding={3} color="bg-bdg" square></Panel>
  //     </>
  //   )
  // }

  //Refreshes the drop downs with new data, when you leave this view and go back to it
  React.useEffect(() => {
    setupSelects()
  }, [])

  async function setupSelects() {
    setUniList(await getUniversities())
  }

  //Calls to populate the dropdowns
  async function getUniversities() {
    let promise = new Promise((resolve, reject) => getAzure(resolve, '/api/getUniversities?', { text: '', n: 181 }))
    let x = (await promise) as any
    return x.unis.sort()
  }

  async function getCourses(university) {
    let promise = new Promise((resolve, reject) => getAzure(resolve, '/api/getCourses?', { text: '', university: university, n: 20 }))
    let x = (await promise) as any
    setCourseList(x.courses.map(course => course.name))
    setModuleList([])

    //uncomment below and comment out above for testing
    //const testArray = ["Math","Computer Science","Biology"]
    //setCourseList(testArray)
  }

  async function getModules(university, course) {
    let promise = new Promise((resolve, reject) => getAzure(resolve, '/api/getModules?', { text: '', university: university, course: course, n: 20 }))
    let x = (await promise) as any
    setModuleList(x.modules.map(module => module.name))

    //uncomment below and comment out above for testing
    //const testArray = ["COMP221","COMP22","COMP3311"]
    //setModuleList(testArray)
  }

  async function trySubmit() {
      let promise2 = new Promise((resolve, reject) => getAzure(resolve, '/api/updateFilters?', { username: globalState.user.id, password: globalState.password, university: formData.university, course: formData.course, modules: formData.modules, year: formData.year, language: formData.language }))
      let resp1 = (await promise2) as any

      if (resp1.result === false) {
        alert("Couldn't update filters - Please check your filters")
        return false
      } else {
        let x = JSON.parse(JSON.stringify(formData))
        x["id"] = globalState.user.id
        console.log(x);
        dispatch({
          type: 'CHANGE',
          payload: {
            ['filters']: x,
          },
        })

        return true
      }
    }
  

  //Below is not used
  const listFilters = Object.keys(localFilters).map((m) => (
    <Panel padding={3} color="bg-bdg" square>
      <div>
        <h4 className="text-light-cream">{m.split('_').join(' ')}</h4>
        <input value={localFilters[m]} name={m} onChange={changeHook} className="form-input" />
      </div>
    </Panel>
  ))

  //try update filters also not used
  async function tryUpdate() {
    let sendMessage = { ...localFilters }
    //rename username for
    sendMessage['username'] = globalState.user.id
    sendMessage['password'] = globalState.user.password

    let promise = new Promise((resolve, reject) => getAzure(resolve, '/api/updateFilters?', sendMessage))
    let x = (await promise) as any

    if ((x.result = true)) {
      //update GlobalState.filters
      dispatch({
        type: 'CHANGE',
        payload: {
          ['filters']: localFilters,
        },
      })
    } else {
      changeDisplay({ ...globalState.filters })
    }
    updateError(x.msg)
  }

  return (
    <>
      <div className="p-3 col">
        <h2 className="c-heading text-light-white">Filters</h2>
      </div>
      <div className="row row-cols-3 p-3">
        {/* Make my panels here*/}

        {/* University */}
        <Panel padding={3} color="bg-bdg" square>
      <div>
        <h4 className="text-light-cream">University</h4>
        <Form.Select
        onChange={(e) => {
          setFormData({ ...formData, university: e.target.value })
          getCourses(e.target.value)
        }}
        value={formData.university}
      >
        <option> Choose a University...</option>
        {uniList.map((currentUni, index) => (
          <option key={index} value={currentUni}>
            {currentUni}
          </option>
        ))}
      </Form.Select>
      </div>
      </Panel>

      {/* Course */}

      <Panel padding={3} color="bg-bdg" square>
      <div>
        <h4 className="text-light-cream">Course</h4>
        <Form.Control onChange={(e) => setFormData({ ...formData, course: e.target.value })} value={formData.course} placeholder="Enter New Course"></Form.Control>
      <Form.Select
        onChange={(e) => {
          setFormData({ ...formData, course: e.target.value })
          getModules(formData.university, e.target.value)
        }}
        value={formData.course}
      >
        <option>Or Choose An Existing Course...</option>
        {courseList.map((currentCourse, index) => (
          <option key={index} value={currentCourse}>
            {currentCourse}
          </option>
        ))}
      </Form.Select>
      </div>
    </Panel>

    {/* Module */}
    <Panel padding={3} color="bg-bdg" square>
      <div>
        <h4 className="text-light-cream">Module</h4>
        <CreatableSelect
        isMulti
        defaultValue={formData.modules.map((module) => ({ value: module, label: module }))}
        options={moduleList.map((module) => ({ value: module, label: module }))}
        onChange={(o: MultiValue<OptionType>) => {
          setFormData({ ...formData, modules: o.map((item) => item.value) })
        }}
      />
      </div>
    </Panel>

    {/* Year */}

    <Panel padding={3} color="bg-bdg" square>
      <div>
        <h4 className="text-light-cream">Year</h4>
        <Form.Select onChange={(e) => setFormData({ ...formData, year: e.target.value })} value={formData.year}>
        <option> Choose a Year...</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
      </Form.Select>
      </div>
    </Panel>

    {/* Language */}

    <Panel padding={3} color="bg-bdg" square>
      <div>
        <h4 className="text-light-cream">Language</h4>
        <Form.Select onChange={(e) => setFormData({ ...formData, language: e.target.value })} value={formData.language}>
    <option> Choose a Language...</option>
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
      </div>
    </Panel>

      





        <p>{error}</p>
      </div>
      <Panel padding={3}>
        <button type="button" onClick={() => {trySubmit().then((result) => {
              if (result === true) {
                // Do something if the function returns true
                alert('Sucessfully updated your account information and filters')
              }
            })}} className="c-btn-white">
          Submit
        </button>
      </Panel>
    </>
  )
}
