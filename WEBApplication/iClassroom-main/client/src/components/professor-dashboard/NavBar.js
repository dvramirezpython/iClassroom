import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import logoBlanco from '../../assets/logo-tec-blanco.png';

/**------------------------------------------------------------------------
 **                           Greeting
 *?  Renders NavBar of teacher's dashboard with a button to logout and logos
 *------------------------------------------------------------------------**/
function NavBar() {
  const navigate = useNavigate();

  return (
    <div className='bg-dark-blue h-14 flex flex-row'>
      <div className='logos w-1/3 items-center flex px-3'>
        <img src = {logoBlanco} className = "w-1/3" /> 
      </div>
      <div className='options w-2/3 flex flex-row justify-end items-center px-5 gap-5'>
        <FontAwesomeIcon icon = { faUser } color='white' size='xl' />
        <button onClick={() => navigate('/')}>
          <FontAwesomeIcon icon = { faSignOut } color='white' size='xl' />
        </button>
      </div>
    </div>
  )
}

export default NavBar