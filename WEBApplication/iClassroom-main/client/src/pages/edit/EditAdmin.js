import {React, useState, useEffect} from 'react';
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import axios from 'axios';

/**------------------------------------------------------------------------
 **                           EditAdmin
 *?  Renders form to edit an existing admin 
 *------------------------------------------------------------------------**/

function EditAdmin() {
  const navigate = useNavigate();

  const {state } = useLocation();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [nameDisable, setNameDisable] = useState(true);
  const [lastNameDisable, setLastNameDisable] = useState(true);
  const [emailDisable, setEmailDisable] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordDisable, setPasswordDisable] = useState(true);
  const [message, setMessage] = useState(false);
 

  /**
   * Executes first time the component finishes rendering
   * Gets state's objects to set name, email and last_name of the existing admin
   */
  useEffect(() => {
    setName(state.admin.name);
    setEmail(state.admin.email);
    setLastName(state.admin.last_name)
  }, [])

  /*
    Calls endpoint to delete resource. If successfull redirect the user to the admin dashboard and list of the deleted resource's type to show deleted entry. If not successfull show error message
  */
  const confirmDelete = ()=> {
    const user = state.admin;

    confirmAlert({
      title: '',
      message: '¿Está seguro de eliminar este registro?',
      buttons: [
        {
          label: 'Sí',
          onClick: () => {
            console.log("Borrando usuario");
            const options = {method: 'DELETE', url: `http://localhost:5000/user/${user._id}`};

            axios.request(options).then(function (response) {
              console.log(response.data);
              navigate("/admin", { state: { resource: 'admins' } });
            }).catch(function (error) {
              console.error(error);
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

  /**
   * Calls endpoint to update existing resource with the sent data
   */
  const updateAdmin = () => {
    console.log("Actualizando administrador");
    const user = state.admin;
    const  newPassword = password != '' ? password : user.password;
    const options = {
      method: 'POST',
      url: `http://localhost:5000/user/update/${user._id}`,
      headers: {'Content-Type': 'application/json'},
      data: {
        user_type: "Administrator",
        name: name,
        last_name: lastName,
        front_photo_url: user.front_photo_url,
        right_photo_url: user.right_photo_url,
        left_photo_url: user.left_photo_url,
        voice_register_url: user.voice_register_url,
        activated: user.activated,
        password: newPassword,
        email: user.email
      }
    };

    axios.request(options).then(function (response) {
      console.log(response.data);
      setMessage(true); //shows success message
      setLastNameDisable(true);
      setNameDisable(true);
      setPasswordDisable(true);
    }).catch(function (error) {
      console.error(error);
    });
  }

  return (
    <div>
      <div className = 'edit-container'>
        <div className='flex flex-row items-center gap-4'>
          <h1 className='mb-2'>Editando Administrador</h1>
          <button onClick={confirmDelete}>
            <FontAwesomeIcon icon = { faTrash } color = '#d43131' size='xl'/>
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

        <br /> 
        <h5 className='text-2xl text-dark-blue font-bold'>Apellido(s)</h5>
        <div className='flex flex-row gap-1'>
          <input 
            value={lastName}
            type='text'
            size = '30'
            disabled={lastNameDisable}
            onChange={(e) => setLastName(e.target.value)}
            className="input"
          />
          <button className='h-full' onClick={() => {setLastNameDisable(!lastNameDisable)}} >
           {lastNameDisable && <FontAwesomeIcon icon = { faPen } />}
           {!lastNameDisable && <FontAwesomeIcon icon= { faCheck } />}
          </button>
        </div>

        {/* <h5 className='text-2xl text-dark-blue font-bold'>Email</h5>
        <div className='flex flex-row gap-1'>
          <input 
            value={email}
            size = '30'
            type='text'
            disabled={emailDisable}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
          <button className='h-full' onClick={() => {setEmailDisable(!emailDisable) }}>
           {emailDisable && <FontAwesomeIcon icon = { faPen } />}
           {!emailDisable && <FontAwesomeIcon icon= { faCheck } />}
          </button>
        </div> */}

        <br />


        <h5 className='text-2xl text-dark-blue font-bold'>Nueva contraseña</h5>
        <div className='flex flex-row gap-1'>
          <input 
            value={password}
            type='text'
            size = '30'
            disabled={passwordDisable} 
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
          <button className='h-full' onClick={() => {setPasswordDisable(!passwordDisable)}} >
           {passwordDisable && <FontAwesomeIcon icon = { faPen } />}
           {!passwordDisable && <FontAwesomeIcon icon= { faCheck } />}
          </button>
        </div>

        <br />
        <div className="text-center justify-content-center">
          {message && <div className="alert-blue my-2 w-1/2 mx-auto">
            <p>Información correctamente actualizada.</p>
          </div>}

          <div className='flex flex-row gap-2'>
            <button className='btn-admin-forms' onClick={()=>{updateAdmin()}}>
              Actualizar registro
            </button>
            <button className='btn-admin-forms-back' onClick={()=>{navigate("/admin", { state: { resource: 'admins' } });}}>
              Regresar
            </button>
          </div>
        </div>
        

      </div>
    </div>
  )
}

export default EditAdmin;