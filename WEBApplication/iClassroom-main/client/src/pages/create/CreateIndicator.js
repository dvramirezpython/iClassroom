import {React, useEffect, useState, } from 'react';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import axios from "axios";

function CreateIndicator() {
  const navigate = useNavigate();
  const {state} = useLocation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [dataType, setDataType] = useState('');
  const [type, setType] = useState('');
  const [schoolSelection, setSchoolSelection] = useState('');
  const [school, setSchool] = useState('');
  const [indicatorGroup, setIndicatorGroup] = useState('');
  const [indicatorGroupSelection, setIndicatorGroupSelection] = useState('');
  const api_endpoint = process.env.REACT_APP_API_ENDPOINT;


  
  /**------------------------------------------------------------------------
   **                           CreateIndicator
  *?  Renders form to create new indicator for a school
  *------------------------------------------------------------------------**/

  /**
   * Calls the endpoint to create a new indicator 
   */
  const createNewIndicator = () => {
    console.log("Creating new indicator");
    const options = {
      method: 'POST',
      url: `${api_endpoint}/indicator/add`,
      headers: {'Content-Type': 'application/json'},
      data: {
        indicator_group: indicatorGroup,
        name: name,
        description: description,
        data_type: dataType,
        weight: weight,
        type: type
      }
    };

    axios.request(options).then(function (response) {
      navigate("/admin", { state: { resource: state.resource } }); //returns to admin dashboard
    }).catch(function (error) {
      alert("Error al crear indicador.");
    });
  }

  /**
   * Fetches the indicator groups (attention, interaction, engagement, distractors) registered for a given school
   */
  const fetchIndicatorGroups = () => {
    const options = {method: 'GET', url: `${api_endpoint}/indicator_groups`};

    axios.request(options).then(function (response) {
      const selection = response.data.filter((i) => i.school._id == school)
      setIndicatorGroupSelection(selection);
    }).catch(function (error) {
      console.error(error);
    });
  }

  /**
   * Fetches all the schools for the school selection
   */
  const fetchSchools = () => {
    const options = {method: 'GET', url: `${api_endpoint}/schools`};
    axios.request(options).then(function (response) {
      setSchoolSelection(response.data);
    }).catch(function (error) {
      console.error(error);
    });
  }

  /**
   * Executes every time the user selects a new school
   */
  useEffect(() => {
    fetchIndicatorGroups();
  }, [school])

  /**  
  * Executes the first time the school finishes rendering
  */
  useEffect(() => {
    //Setting variable from state
    fetchSchools();
  }, [])

  return (
    <div>
      <div className = 'edit-container'>
        <div className='flex flex-row items-center gap-4'>
          <h1 className='mb-2'>Creando Nuevo Indicador</h1>
        </div>

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

        <br/>

        <h5 className='text-2xl text-dark-blue font-bold'>Tipo de Indicador</h5>
        {indicatorGroupSelection && <div className='flex flex-row gap-1'>
          <select className =  'input' onChange={(e) => {setIndicatorGroup(e.target.value)}}>
            <option></option>
            {indicatorGroupSelection.map((s) => {
                return <option key={s._id} value={s._id}  >
                    {s.ind_type}
                </option>
            })}
          </select>
        </div>}

        <br/>

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

        <br/>

        <h5 className='text-2xl text-dark-blue font-bold'>Descripción</h5>
        <div className='flex flex-row gap-1'>
          <textarea 
            value={description}
            type='text'
            size = '30'
            onChange={(e) => setDescription(e.target.value)}
            className="input"
          />
        </div>

        <br/>

        <h5 className='text-2xl text-dark-blue font-bold'>Peso</h5>
        <div className='flex flex-row gap-1'>
          <input 
            value={weight}
            type='text'
            size = '30'
            onChange={(e) => setWeight(e.target.value)}
            className="input"
          />
        </div>

        <br/>

        <h5 className='text-2xl text-dark-blue font-bold'>Tipo de Dato</h5>
        <div className='flex flex-row gap-1'>
          <select className =  'input' onChange={(e) => {setDataType(e.target.value)}}>
            <option></option>
            <option value = 'str'>String</option>
            <option value = 'int'>Entero</option>
            <option value = 'float'>Flotante</option>
            <option value = 'bool'>Booleano</option>
          </select>
        </div>

        <br/>

        <h5 className='text-2xl text-dark-blue font-bold'>Tipo de Indicador</h5>
        <div className='flex flex-row gap-1'>
          <select className =  'input' onChange={(e) => {setType(e.target.value)}}>
            <option></option>
            <option value = 'Group'>Grupal</option>
            <option value = 'Individual'>Individual</option>
          </select>
        </div>

        <div className='flex flex-row gap-1'>
          <button className='btn-admin-forms mt-3' onClick={() => {
            createNewIndicator()
          }}>
            Crear Nuevo Indicador
          </button>

          <button className='btn-admin-forms-back mt-3' onClick={() => {
            navigate("/admin", { state: { resource: state.resource } });
          }}>
            Back
          </button>
        </div>
        

      </div>
    </div>
  )
}

export default CreateIndicator;