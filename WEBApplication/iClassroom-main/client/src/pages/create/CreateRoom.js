import {React, useEffect, useState, } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";


/**------------------------------------------------------------------------
 **                           CreateRoom
 *?  Renders form to create new room for a school
 *------------------------------------------------------------------------**/
function CreateRoom() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [schoolSelection, setSchoolSelection] = useState('')
  const [school, setSchool] = useState('')
  const api_endpoint = process.env.REACT_APP_API_ENDPOINT;

  /**
   * Calls endpoint to create new room for a given school
   */
  const createNewRoom = () => {
    console.log("Creating new room");

    const options = {
      method: 'POST',
      url: `${api_endpoint}/room/add`,
      headers: {'Content-Type': 'application/json'},
      data: {
        name: name,
        school: school
      }
    };

    axios.request(options).then(function (response) {
      navigate("/admin", { state: { resource: 'rooms' } }); //returns to admin dashboard
    }).catch(function (error) {
      alert("Error al crear salón.");
    });
  }
 

  /**  
   * Executes first time the component finished rendering
   * Fetches all schools for school dropdown selection
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
          <h1 className='mb-2'>Creando Nuevo Salón</h1>
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
            createNewRoom()
          }}>
            Crear Nuevo Salón
          </button>

          <button className='btn-admin-forms-back mt-3' onClick={() => {
            navigate("/admin", { state: { resource: 'areas' } });
          }}>
            Back
          </button>
        </div>
        

      </div>
    </div>
  )
}

export default CreateRoom;