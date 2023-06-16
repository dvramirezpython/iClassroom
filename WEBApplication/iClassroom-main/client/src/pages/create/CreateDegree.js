import {React, useEffect, useState, } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";



/**------------------------------------------------------------------------
 **                           CreateDegree
 *?  Renders form to create new degree for a school
 *------------------------------------------------------------------------**/
function CreateDegree() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [areaSelection, setAreaSelection] = useState('');
  const [area, setArea] = useState('');
  const [schoolSelection, setSchoolSelection] = useState('');
  const api_endpoint = process.env.REACT_APP_API_ENDPOINT;
  const [school, setSchool] = useState('');


  /**
   * Calls endpoint to create new degree for given school and given area
   */
  const createNewDegree = () => {
    console.log("Creating new area");

    const options = {
      method: 'POST',
      url: `${api_endpoint}/career/add`,
      headers: {'Content-Type': 'application/json'},
      data: {
        name: name,
        area: area
      }
    };

    axios.request(options).then(function (response) {
      navigate("/admin", { state: { resource: 'degrees' } }); //if degree created return to admin dashboard 
    }).catch(function (error) {
      console.log(error);
      alert("Error al crear carrera.");
    });
  }

  /**
   * Executes once the components first finished rendering
   * Fetches schools for dropdown
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
   * Executes every time school selection from the user changes
   * Fetches all areas of the school the user just seleceted, used for areas dropdown 
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


  return (
    <div>
      <div className = 'edit-container'>
        <div className='flex flex-row items-center gap-4'>
          <h1 className='mb-2'>Creando Nueva Carrera</h1>
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


        <div className='flex flex-row gap-1'>
          <button className='btn-admin-forms mt-3' onClick={() => {
            createNewDegree()
          }}>
            Crear Nueva Carrera
          </button>

          <button className='btn-admin-forms-back mt-3' onClick={() => {
            navigate("/admin", { state: { resource: 'degrees' } });
          }}>
            Back
          </button>
        </div>
        

      </div>
    </div>
  )
}

export default CreateDegree;