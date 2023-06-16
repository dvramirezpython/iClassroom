import {React, useEffect, useState, } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**------------------------------------------------------------------------
 **                           CreateGroup
 *?  Renders form to create new group for a school
 *------------------------------------------------------------------------**/

function CreateGroup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [areaSelection, setAreaSelection] = useState('');
  const [area, setArea] = useState('');
  const [schoolSelection, setSchoolSelection] = useState('');
  const [school, setSchool] = useState('');
  const [subject, setSubject] = useState('');
  const [subjectSelection, setSubjectSelection] = useState('');
  const api_endpoint = process.env.REACT_APP_API_ENDPOINT;


  /**
   * Calls endpoint to create new group
   */
  const createNewGroup = () => {
    console.log("Creating new area");

    const options = {
      method: 'POST',
      url: `${api_endpoint}/group/add`,
      headers: {'Content-Type': 'application/json'},
      data: {
        group_key: name,
        subject: subject
      }
    };

    axios.request(options).then(function (response) {
      navigate("/admin", { state: { resource: 'groups' } });
    }).catch(function (error) {
      console.log(error);
      alert("Error al crear grupo.");
    });
  }
  

  /** 
   * Executes every time the component is first rendered
   * Fetches school for dropdown selection
   */
  useEffect(() => {
    const options = {method: 'GET', url: `${api_endpoint}/schools`};
    axios.request(options).then(function (response) {
      setSchoolSelection(response.data);
    }).catch(function (error) {
      console.error(error);
    });
  }, [])


  /** 
   * Executes every time the user selects a new school
   * Fetches the areas for the school the user just selected
   */
  useEffect(() => {
    const options = {
      method: 'GET',
      url: `${api_endpoint}/areasPerSchool/${school}`
    };

    axios.request(options).then(function (response) {
      setAreaSelection(response.data);
    }).catch(function (error) {
      console.error(error);
    });
  }, [school] )


  /**
   * Executes everytime the user selects a new area
   * Fetches the subjects for the area the user just selected
   */
  useEffect(() => {
    const options = {
      method: 'GET',
      url: `${api_endpoint}/subjectsPerArea/${area}`
    };

    axios.request(options).then(function (response) {
      setSubjectSelection(response.data);
    }).catch(function (error) {
      console.error(error);
    });
  }, [area] )


  return (
    <div>
      <div className = 'edit-container'>
        <div className='flex flex-row items-center gap-4'>
          <h1 className='mb-2'>Creando Nuevo Grupo</h1>
        </div>

        <h5 className='text-2xl text-dark-blue font-bold'>Nombre</h5>
        <div className='flex flex-row gap-1'>
          <input 
            value={name}
            type='text'
            size = '30'
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
        </div>

        <br />

        <h5 className='text-2xl text-dark-blue font-bold'>Escuela</h5>
        {schoolSelection && <div className='flex flex-row gap-1'>
          <select className =  'input' onChange={(e) => {setSchool(e.target.value)}}>
            <option></option>
            {schoolSelection.map((s) => {
                return <option key={s._id} value={s._id}  >
                    {s.name}
                </option>
            })}
          </select>
        </div>}


        <br />

        <h5 className='text-2xl text-dark-blue font-bold'>Area</h5>
        <div className='flex flex-row gap-1'>
          <select className =  'input' onChange={(e) => {setArea(e.target.value)}}>
            <option></option>
            {areaSelection && areaSelection.map((s) => {
                return <option key={s._id} value={s._id}  >
                    {s.name}
                </option>
            })}
          </select>
        </div>

        <br />

        <h5 className='text-2xl text-dark-blue font-bold'>Materia</h5>
        <div className='flex flex-row gap-1'>
          <select className =  'input' onChange={(e) => {setSubject(e.target.value)}}>
            <option></option>
            {subjectSelection && subjectSelection.map((s) => {
                return <option key={s._id} value={s._id}  >
                    {s.name}
                </option>
            })}
          </select>
        </div>


        <div className='flex flex-row gap-1'>
          <button className='btn-admin-forms mt-3' onClick={() => {
            createNewGroup()
          }}>
            Crear Nuevo Grupo
          </button>

          <button className='btn-admin-forms-back mt-3' onClick={() => {
            navigate("/admin", { state: { resource: 'groups' } });
          }}>
            Back
          </button>
        </div>
        

      </div>
    </div>
  )
}

export default CreateGroup;