import {React, useEffect, useState, } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**------------------------------------------------------------------------
 **                           CreateSchool
 *?  Renders form to create new school for a school
 *------------------------------------------------------------------------**/
function CreateSchool() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const api_endpoint = process.env.REACT_APP_API_ENDPOINT;


  /**
   * Calls endpoint to create new school
   */
  const createNewSchool = () => {
    console.log("Creating new school");

    const options = {
      method: 'POST',
      url: `${api_endpoint}/school/add`,
      headers: {'Content-Type': 'application/json'},
      data: {name: name}
    };

    axios.request(options).then(function (response) {
      navigate("/admin", { state: { resource: 'schools' } }); //returns to admin dashboard
    }).catch(function (error) {
      alert("Error al crear escuela.");
    });
  }


  return (
    <div>
      <div className = 'edit-container'>
        <div className='flex flex-row items-center gap-4'>
          <h1 className='mb-2'>Creando Nueva Escuela</h1>
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


        <div className='flex flex-row gap-1'>
          <button className='btn-admin-forms mt-3' onClick={() => {
            createNewSchool()
          }}>
            Crear Nueva Escuela
          </button>

          <button className='btn-admin-forms-back mt-3' onClick={() => {
            navigate("/admin", { state: { resource: 'schools' } });
          }}>
            Back
          </button>
        </div>
        

      </div>
    </div>
  )
}

export default CreateSchool;