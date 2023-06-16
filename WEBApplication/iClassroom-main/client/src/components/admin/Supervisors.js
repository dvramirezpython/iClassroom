import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyData } from '../../dummyData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPen } from '@fortawesome/free-solid-svg-icons';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";


/**------------------------------------------------------------------------
 **                           Supervisors
 *?  Renders a list of the entries for the given resource (Supervisors)
 *------------------------------------------------------------------------**/
function Supervisors() {
  const navigate = useNavigate();
  const api_endpoint = process.env.REACT_APP_API_ENDPOINT;
  const [supervisors, setSupervisors] = useState();


  /** 
  * Executes after first render of the component
  * Calls function to fetch list of the resource to display
  */
  useEffect(() => {
     /**
     * Fetch the list of all entries of the resource
     */
    const fetchSupervisors = () => {
      const options = {method: 'GET', url: `${api_endpoint}/supervisors`};
      axios.request(options).then(function (response) {
        console.log("Fetching students");
        setSupervisors(response.data);
      }).catch(function (error) {
        console.error(error);
      });
    }
    fetchSupervisors();
  }, [])

  return (
    <div className='py-4 px-2'>
      <div className='flex flex-row items-center gap-3'>
        <h1 className='font-extrabold text-dark-blue'>Supervisores</h1>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-md">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-lg font-bold text-black uppercase bg-light-blue">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Nombre
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Apellido(s)
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Correo
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Fecha de Creación
                    </th>
                    <th scope="col" className="px-6 py-3">
                        <span className="sr-only">Edit</span>
                    </th>
                </tr>
            </thead>
            <tbody>
              {supervisors && supervisors.map((supervisor) => (
                  <tr key = {supervisor._id} className="bg-white border-b  dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-300">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {supervisor.last_name}
                    </th>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {supervisor.last_name}
                    </th>
                    <td className="px-6 py-4">
                        {supervisor.email}
                    </td>
                    <td className="px-6 py-4">
                        {new Date(supervisor.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                        <button
                           onClick={() => {
                            navigate("/supervisor/edit", { state: { supervisor: supervisor } });
                           }}
                        >
                          <FontAwesomeIcon icon={faUserPen} color = "#1B407F" size='2xl'/>
                        </button>
                    </td>
                  </tr>
              ))}
                
            </tbody>
        </table>
      </div>

    </div>
  )
}

export default Supervisors;