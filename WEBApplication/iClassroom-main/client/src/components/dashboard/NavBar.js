import React from 'react'
import logo from "../../assets/logo512.png";
import logotec from "../../assets/logo-tec.png";
import { NavLink } from "react-router-dom"; // importar Link desde react-router-dom


/**------------------------------------------------------------------------
 **                           NavBar
 *?  Renders NavBar component for indicators dashboard, that includes a clock, date and name of teacher signed in
 *------------------------------------------------------------------------**/
function NavBar() {
  const api_endpoint = process.env.REACT_APP_API_ENDPOINT;

  return (
    <div className='bg-gray-300 px-2 py-1'>
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="logo-container flex items-center">
          <img src={logotec} className="w-26 h-14" />
        </div>
  
        <div className="w-26 h-14 flex flex-row items-center justify-end">
          <div>
            <button class="peer px-5 bg-gray-300 px-5 mx-5 text-black  shadow hover:bg-black-200">
              Menu
            </button>        
            <div class="hidden peer-hover:flex hover:flex flex-col bg-white drop-shadow-lg rounded-lg mt-5">
              <a class="px-5 py-3 hover:bg-gray-200" href="#">Perfil</a>
              <a class="px-5 py-3 hover:bg-gray-200" href="/" >Salir</a>
            </div>
          </div>
          <img src={logo} className="w-26 h-14" />
        </div>
      </div>
    </div>
  );
}

export default NavBar