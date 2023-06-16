import {React, useState, useEffect} from 'react';
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import axios from 'axios';



/**------------------------------------------------------------------------
 **                           EditDegree
 *?  Renders form to edit an existing degree 
 *------------------------------------------------------------------------**/


function EditDegree() {
  const { state } = useLocation('');
  const [ name, setName] = useState('');
  const [nameDisable, setNameDisable] = useState(true);
  const [ school, setSchool] = useState('');
  const [ schoolName, setSchoolName] = useState('');
  const [ area, setArea ] = useState('');
  const [schoolDisable, setSchoolDisable] = useState(true);
  const [ areaDisable, setAreaDisable] = useState(true);
  const [ areaSelection, setAreaSelection] = useState('');
  const [message, setMessage] = useState(false);
  const navigate = useNavigate();
 
  /**
   * Calls endpoint to update existing resource with the sent data
   */
  const updateDegree = () => {
    const options = {
      method: 'POST',
      url: `http://localhost:5000/career/update/${state.degree._id}`,
      headers: {'Content-Type': 'application/json'},
      data: {
        name: name,
        school: school,
        area: area
      }
    };

    axios.request(options).then(function (response) {
      setMessage(true);
    }).catch(function (error) {
      setMessage(false);
      console.error(error);
    });
  }

    /**
   * Executes first time the component finishes rendering
   * Gets state's object to set attributes of the existing degree
   * Fetches areas for the given school for area dropdown selection
   */
  useEffect(() => {
    setName(state.degree.name);
    setSchool(state.degree.area.name? state.degree.area.school._id : null);
    setSchoolName(state.degree.area.name? state.degree.area.school.name : null);
    setArea(state.degree.area.name? state.degree.area._id : null );
  
    const options = {method: 'GET', url: `http://localhost:5000/areasPerSchool/${state.degree.area.school._id}`};
    axios.request(options).then(function (response) {
      setAreaSelection(response.data);
    }).catch(function (error) {
      console.error(error);
    });
  }, [])

 /*
    Calls endpoint to delete resource. If successfull redirect the user to the admin dashboard and list of the deleted resource's type to show deleted entry. If not successfull show error message
  */
  const confirmDelete = () => {
    confirmAlert({
      title: '',
      message: '¿Está seguro de eliminar este registro?',
      buttons: [
        {
          label: 'Sí',
          onClick: () => {
            console.log("Borrando usuario");
            const options = {
              method: 'GET',
              url: `http://localhost:5000/career/delete/${state.degree._id}`,
              headers: {'Content-Type': 'application/json'}
            };
        
            axios.request(options).then(function (response) {
              navigate("/admin", { state: { resource: 'degrees' } });
            }).catch(function (error) {
              alert("Error borrando registro.");
            });
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  }

  return (
    <div>
      <div className = "edit-container">
        <div className='flex flex-row items-center gap-4'>
          <h1 className='mb-2'>Editando Carrera</h1>
          <button onClick={confirmDelete}>
            <FontAwesomeIcon icon = { faTrash } color = '#d43131' size='xl'  />
          </button>
        </div>

        <h5 className='text-2xl text-dark-blue font-bold'>Nombre</h5>
        <div className='flex flex-row gap-1'>
          <input 
            value={name}
            type='text'
            size = '30'
            disabled={nameDisable}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
          <button className='h-full' onClick={() => {setNameDisable(!nameDisable)}} >
           {nameDisable && <FontAwesomeIcon icon = { faPen } />}
           {!nameDisable && <FontAwesomeIcon icon= { faCheck } />}
          </button>
        </div>

        <br></br>

        <h5 className='text-2xl text-dark-blue font-bold'>Escuela</h5>
        <div className='flex flex-row gap-1'>
          <input 
            value={schoolName}
            type='text'
            size = '30'
            disabled={true}
            onChange={(e) => setSchool(e.target.value)}
            className="input"
          />
          {/* <button className='h-full' onClick={() => {setSchoolDisable(!schoolDisable)}} >
           {schoolDisable && <FontAwesomeIcon icon = { faPen } />}
           {!schoolDisable && <FontAwesomeIcon icon= { faCheck } />}
          </button> */}
        </div>

        <br/>

        <h5 className='text-2xl text-dark-blue font-bold'>Area</h5>
        {areaSelection && <div className='flex flex-row gap-1'>
          <select disabled = {areaDisable} className = {areaDisable ? 'input bg-gray-100' : 'input'} onChange={(e) => {setArea(e.target.value)}}>
            {areaSelection.map((a) => {
                return <option key={a._id} value={a._id} selected={a._id == area} >
                    {a.name}
                </option>
            })}
          </select>
          <button className='h-full' onClick={() => {setAreaDisable(!areaDisable)}} >
           {areaDisable && <FontAwesomeIcon icon = { faPen } />}
           {!areaDisable && <FontAwesomeIcon icon= { faCheck } />}
          </button>
        </div>}
    

        <br /> <br />
        <div className="text-center justify-content-center">
          {message && <div className="alert-blue my-2 w-1/2 mx-auto">
            <p>Información correctamente actualizada.</p>
          </div>}

          <div className='flex flex-row gap-2'>
            <button className='btn-admin-forms' onClick={()=>{updateDegree()}}>
              Actualizar registro
            </button>
            <button className='btn-admin-forms-back' onClick={()=>{navigate("/admin", { state: { resource: 'degrees' } });}}>
              Regresar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditDegree;