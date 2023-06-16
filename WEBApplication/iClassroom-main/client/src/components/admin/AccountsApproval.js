import {React, useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import axios from 'axios';

/**------------------------------------------------------------------------
 **                           AccountsApproval
 *?  Renders a list of all unapproved accounts for teachers and students so that the admin can approve or reject them.
 *------------------------------------------------------------------------**/
function AccountsApproval() {
  const [reload, setReload] = useState();
  const [pendingUsers, setPendingUsers] = useState();
  const api_endpoint = process.env.REACT_APP_API_ENDPOINT;


  /**
   * Calls endpoint to fetch pending accounts for approval
   */
  const fetchPendingUsers = () => {
    const options = {method: 'GET', url: `${api_endpoint}/users/pending`};
    axios.request(options).then(async function (response) {
      console.log("Fetching users account pending approval");
      await setPendingUsers(response.data);
      
    }).catch(function (error) {
      console.error(error);
    });
  }

  /**
   * Executes first time component is rendered, calls function to fetch pending accounts
   */
  useEffect(() => {
    fetchPendingUsers();
  }, []);

  /**
   * Triggers state change to reload component and show changes 
   */
  useEffect(() => {
    fetchPendingUsers(); 
  }, [reload]);

  /**
   * Function to call endpoint and appove account
   */
  const approveUser = (user) => {

    confirmAlert({
      title: '',
      message: '¿Está seguro de querer aprobar el usuario??',
      buttons: [
        {
          label: 'Sí',
          onClick: () => { //calling endpoint for approval of account
            console.log("Sending request to approve user with ID " + user._id);
            const options = {
              method: 'POST',
              url: `${api_endpoint}/user/update/${user._id}`,
              headers: {
                'Content-Type': 'application/json',
              },
              data: {
                "user_type": user.__t,
                "name": user.name,
                "last_name": user.last_name,
                "front_photo_url": user.front_photo_url,
                "right_photo_url": user.right_photo_url,
                "left_photo_url": user.left_photo_url,
                "voice_register_url": user.voice_register_url,
                "activated": true,
                "password": user.password,
                "tuition": user.tuition,
                "email": user.email
              }
            };

            axios.request(options).then(function (response) {
              console.log(response.data);
              confirmAlert({ 
                message: 'Usuario aprobado correctamente', //show success message
                buttons: [
                  {
                    label: 'Ok',
                    onClick: () => {}
                  }
                ]
              });
              setReload(!reload);
            }).catch(function (error) {
              console.error(error);
              alert("Hubo un error aprobando al usuario."); //show error message if account couldn't be approved
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
   * Function to call endpoint and reject account
   */
  const notApproveUser = (user) => {

    confirmAlert({
      title: '',
      message: '¿Está seguro de querer rechazar al usuario?',
      buttons: [
        {
          label: 'Sí',
          onClick: () => {
            console.log("Sending request to not approve user with ID " + user._id);
            const options = { //calls endpoint to reject account
              method: 'POST',
              url: `${api_endpoint}/user/update/${user._id}`,
              headers: {'Content-Type': 'application/json'},
              data: {
                "user_type": user.__t,
                "name": user.name,
                "last_name": user.last_name,
                "front_photo_url": user.front_photo_url,
                "right_photo_url": user.right_photo_url,
                "left_photo_url": user.left_photo_url,
                "voice_register_url": user.voice_register_url,
                "activated": false,
                "password": user.password,
                "tuition": user.tuition,
                "email": user.email
              }
            };

            axios.request(options).then(function (response) {
              console.log(response.data);
              confirmAlert({
                message: 'Usuario rechazado correctamente', //show success message
                buttons: [
                  {
                    label: 'Ok',
                    onClick: () => {}
                  }
                ]
              });
              setReload(!reload);
            }).catch(function (error) {
              console.error(error);
              alert("Hubo un error rechazando al usuario."); //shows error message if account couldn't be rejected correctly
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
    <div className='py-4 px-2'>
      <div className='flex flex-row items-center gap-3'>
        <h1 className='font-extrabold text-dark-blue'>Aprobación de Cuentas</h1>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-md">
       {true && <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-sm text-gray-800 uppercase bg-light-blue">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Rol
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Nombre
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Apellido
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Correo
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Fecha de Creación
                    </th>
                    <th scope="col" className="px-6 py-3">
                        <span className="sr-only">Approve</span>
                    </th>
                    <th scope="col" className="px-6 py-3">
                        <span className="sr-only">NotApprove</span>
                    </th>
                </tr>
            </thead>
            <tbody>
              {pendingUsers && pendingUsers.map((user) => 
                <tr key = {user._id} className="bg-white border-b  dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-300">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {user.__t}
                  </th>
                  <td className="px-6 py-4">
                      {user.name}
                  </td>
                  <td className="px-6 py-4">
                      {user.last_name}
                  </td>
                  <td className="px-6 py-4">
                      {user.email}
                  </td>
                  <td className="px-6 py-4">
                      {user.createdAt}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick = {() => {
                      approveUser(user);
                    }}> 
                      <FontAwesomeIcon icon = {faCircleCheck} color = 'green' size = "xl" />
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick = {() => {
                      notApproveUser(user);
                    }}> 
                      <FontAwesomeIcon icon = {faCircleXmark} color = 'red' size = "xl" />
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
        </table>}
        {pendingUsers && pendingUsers.length == 0 && 
          <div className='text-center my-3'> 
            <h3 className='text-gray-500'> No hay cuentas pendientes por aprobar </h3>
          </div>
        }
      </div>



      {/* {dummyData.students.map((student) => (
        <p>{student.name}</p>
      ))} */}
    </div>
  )
}

export default AccountsApproval;

/*
http://localhost:5000/user/update/6425d2edc8eda21f3cdb1887
http://localhost:5000/user/update/6425d2edc8eda21f3cdb1887
*/