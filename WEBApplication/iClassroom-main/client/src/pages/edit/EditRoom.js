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
 **                           EditRoom
 *?  Renders form to edit an existing room 
 *------------------------------------------------------------------------**/
function EditRoom() {
  const { state } = useLocation('');
  const [ name, setName] = useState('');
  const [nameDisable, setNameDisable] = useState(true);
  const [schoolSelection, setSchoolSelection] = useState('')
  const [ school, setSchool] = useState('');
  const [schoolDisable, setSchoolDisable] = useState(true);
  const [validSchool, setValidSchool] = useState(true);
  const [message, setMessage] = useState(false);
  const navigate = useNavigate();
 

  /**
   * Calls endpoint to update existing resource with the sent data
   */
  const updateRoom = () => {
    const options = {
      method: 'POST',
      url: `http://localhost:5000/room/update/${state.room._id}`,
      headers: {'Content-Type': 'application/json'},
      data: {
        name: name,
        school: state.room.school._id
      }
    };

    axios.request(options).then(function (response) {
      setMessage(true); //show success message
    }).catch(function (error) {
      setMessage(false);
      console.error(error);
    });
  }

  /**
 * Executes first time the component finishes rendering
 * Gets state's object to set attributes of the existing degree
 */
  useEffect(() => {
    setName(state.room.name);
    setSchool(state.room.school.name);
  }, [])

  useEffect(() => {
    console.log("hola");
  }, [school])


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
              url: `http://localhost:5000/room/delete/${state.room._id}`,
              headers: {'Content-Type': 'application/json'}
            };
        
            axios.request(options).then(function (response) {
              navigate("/admin", {state: {resource: 'rooms'}});
            }).catch(function (error) {
              alert("Error borrando usuario.");
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
          <h1 className='mb-2'>Editando Salón</h1>
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
            value={school}
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

        <br /> <br />
        <div className="text-center justify-content-center">
          {message && <div className="alert-blue my-2 w-1/2 mx-auto">
            <p>Información correctamente actualizada.</p>
          </div>}

          <div className='flex flex-row gap-2'>
            <button className='btn-admin-forms' onClick={()=>{updateRoom()}}>
              Actualizar registro
            </button>
            <button className='btn-admin-forms-back' onClick={()=>{navigate("/admin", { state: { resource: 'rooms' } });}}>
              Regresar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditRoom;