import {React, useEffect, useState, } from 'react';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import axios from "axios";


/**------------------------------------------------------------------------
 **                           EditIndicator
 *?  Renders form to edit an existing indicator 
 *------------------------------------------------------------------------**/
function EditIndicator() {
  const navigate = useNavigate();
  const {state} = useLocation();
  const [name, setName] = useState('');
  const [disableName, setDisableName] = useState(true);
  const [description, setDescription] = useState('');
  const [disableDescription, setDisableDescription] = useState(true);
  const [weight, setWeight] = useState('');
  const [disableWeight, setDisableWeight] = useState(true);
  const [dataType, setDataType] = useState('');
  const [disableDataType, setDisableDataType] = useState(true);
  const [school, setSchool] = useState('');
  const [indicatorGroup, setIndicatorGroup] = useState('');
  const [message, setMessage] = useState(false);

  /**
   * Executes first time the component finishes rendering
   * Gets state's object to set attributes of the existing degree
   */
  useEffect(() => {
    setName(state.indicator.name);
    setSchool(state.indicator.indicator_group.school.name);
    setIndicatorGroup(state.indicator.indicator_group.ind_type)
    setDescription(state.indicator.description);
    setWeight(state.indicator.weight);
    setDataType(state.indicator.data_type);
  }, [])


  /**
   * Calls endpoint to update existing resource with the sent data
   */
  const updateIndicator = () => {
    const options = {
      method: 'POST',
      url: `http://localhost:5000/indicator/update/${state.indicator._id}`,
      headers: {'Content-Type': 'application/json'},
      data: {
        indicator_group: state.indicator.indicator_group,
        name: name,
        description: description,
        data_type: dataType,
        weight: weight
      }
    };

    axios.request(options).then(function (response) {
      setMessage(true); //show success message
    }).catch(function (error) {
      setMessage(false);
      console.error(error);
      alert("Error editando registro.");
    });
  }

   /*
    Calls endpoint to delete resource. If successfull redirect the user to the admin dashboard and list of the deleted resource's type to show deleted entry. If not successfull show error message
  */
  const deleteIndicator = () => {
    if (window.confirm("¿Está seguro de eliminar este registro?")) {
      const options = {
        method: 'GET',
        url: `http://localhost:5000/indicator/delete/${state.indicator._id}`,
        headers: {'Content-Type': 'application/json'}
      };
  
      axios.request(options).then(function (response) {
        navigate("/admin", { state: { resource: state.type } });
      }).catch(function (error) {
        alert("Error borrando registro.");
      });
    }
  }


  return (
    <div>
      <div className = 'edit-container'>
        <div className='flex flex-row items-center gap-4'>
          <h1 className='mb-2'>Editando Indicador</h1>
          <button onClick={deleteIndicator}>
            <FontAwesomeIcon icon = { faTrash } color = '#d43131' size='xl'  />
          </button>
        </div>

        <h5 className='text-2xl text-dark-blue font-bold'>Escuela</h5>
        <input 
            value={school}
            type='text'
            size = '30'
            disabled
            className="input"
          />
        <br/>

        <h5 className='text-2xl text-dark-blue font-bold'>Tipo de Indicador</h5>
        <input 
            value={indicatorGroup}
            type='text'
            size = '30'
            disabled
            className="input"
        />

        <br/>

        <h5 className='text-2xl text-dark-blue font-bold'>Nombre</h5>
        <div className='flex flex-row gap-1'>
          <input 
            value={name}
            type='text'
            size = '30'
            disabled = {disableName}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
          <button className='h-full' onClick={() => {setDisableName(!disableName)}} >
           {disableName && <FontAwesomeIcon icon = { faPen } />}
           {!disableName && <FontAwesomeIcon icon= { faCheck } />}
          </button>
        </div>

        <br/>

        <h5 className='text-2xl text-dark-blue font-bold'>Descripción</h5>
        <div className='flex flex-row gap-1'>
          <textarea 
            value={description}
            type='text'
            size = '30'
            disabled = {disableDescription}
            onChange={(e) => setDescription(e.target.value)}
            className="input"
          />
          <button className='h-full' onClick={() => {setDisableDescription(!disableDescription)}} >
           {disableDescription && <FontAwesomeIcon icon = { faPen } />}
           {!disableDescription && <FontAwesomeIcon icon= { faCheck } />}
          </button>
        </div>

        <br/>


        <h5 className='text-2xl text-dark-blue font-bold'>Peso</h5>
        <div className='flex flex-row gap-1'>
          <input 
            value={weight}
            type='text'
            size = '30'
            disabled = {disableWeight}
            onChange={(e) => setWeight(e.target.value)}
            className="input"
          />
          <button className='h-full' onClick={() => {setDisableWeight(!disableWeight)}} >
           {disableWeight && <FontAwesomeIcon icon = { faPen } />}
           {!disableWeight && <FontAwesomeIcon icon= { faCheck } />}
          </button>
        </div>

        <br/>

        <h5 className='text-2xl text-dark-blue font-bold'>Tipo de Dato</h5>
        <div className='flex flex-row gap-1'>
          <select disabled = {disableDataType} className = {disableDataType ? 'input bg-gray-100' : 'input'} onChange={(e) => {setDataType(e.target.value)}}>
            <option></option>
            <option value = 'str' selected={dataType == 'str'}>String</option>
            <option value = 'int' selected={dataType == 'int'}>Entero</option>
            <option value = 'float' selected={dataType == 'float'}>Flotante</option>
            <option value = 'bool' selected={dataType == 'bool'}>Booleano</option>
          </select>
          <button className='h-full' onClick={() => {setDisableDataType(!disableDataType)}} >
           {disableDataType && <FontAwesomeIcon icon = { faPen } />}
           {!disableDataType && <FontAwesomeIcon icon= { faCheck } />}
          </button>
        </div>

        <div className="text-center justify-content-center">
          {message && <div className="alert-blue my-2 w-1/2 mx-auto">
            <p>Información correctamente actualizada.</p>
          </div>}
        </div>


        <div className='flex flex-row gap-1'>
          <button className='btn-admin-forms mt-3' onClick={() => {updateIndicator()}}>
            Actualizar Registro
          </button>

          <button className='btn-admin-forms-back mt-3' onClick={() => {
            navigate("/admin", { state: { resource: state.type } });
          }}>
            Back
          </button>
        </div>
        

      </div>
    </div>
  )
}

export default EditIndicator;