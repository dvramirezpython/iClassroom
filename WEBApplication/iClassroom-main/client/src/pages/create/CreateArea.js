import {React, useEffect, useState, } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**------------------------------------------------------------------------
 **                           CreateArea
 *?  Renders form to create new area for a school
 *------------------------------------------------------------------------**/

function CreateArea() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [schoolSelection, setSchoolSelection] = useState('')
  const [school, setSchool] = useState('')
  const api_endpoint = process.env.REACT_APP_API_ENDPOINT;

  /**
   * Calls endpoint to create area, sending new area's name and school it belongs to
   */
  const createNewArea = () => {
    console.log("Creating new area");

    const options = {
      method: 'POST',
      url: `${api_endpoint}/area/add`,
      headers: {'Content-Type': 'application/json'},
      data: {
        name: name,
        school: school
      }
    };

    axios.request(options).then(function (response) {
      navigate("/admin", { state: { resource: 'areas' } }); //redirect to admin dashboard and set state's resource to areas
    }).catch(function (error) {
      alert("Error al crear area."); 
    });
  }

  /**
   * Executes once the component is first rendered.
   * Calls endpoint to fetch school for dropdown 
   */
  useEffect(() => {
    const options = {method: 'GET', url: `${api_endpoint}/schools`};
    axios.request(options).then(function (response) {
      setSchoolSelection(response.data);
    }).catch(function (error) {
      console.error(error);
    });
  }, [])

  return (
    <div>
      <div className = 'edit-container'>
        <div className='flex flex-row items-center gap-4'>
          <h1 className='mb-2'>Creando Nueva Area</h1>
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


        <div className='flex flex-row gap-1'>
          <button className='btn-admin-forms mt-3' onClick={() => {
            createNewArea()
          }}>
            Crear Nueva Area
          </button>

          <button className='btn-admin-forms-back mt-3' onClick={() => {
            navigate("/admin", { state: { resource: 'areas' } }); //go back
          }}>
            Back
          </button>
        </div>
        

      </div>
    </div>
  )
}

export default CreateArea;