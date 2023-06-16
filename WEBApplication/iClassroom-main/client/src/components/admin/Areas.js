import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyData } from '../../dummyData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";


/**------------------------------------------------------------------------
 **                           Areas
 *?  Renders a list of the entries for the given resource
 *------------------------------------------------------------------------**/


function Areas() {
  const navigate = useNavigate();
  const [areas, setAreas] = useState('');
  const api_endpoint = process.env.REACT_APP_API_ENDPOINT;


  /**
   * Fetch the list of all entry of the resource
   */
  const fetchAreas = async () => {
    const options = {method: 'GET', url: `${api_endpoint}/areas`};

    axios.request(options).then(function (response) {
      setAreas(response.data);
    }).catch(function (error) {
      console.error(error);
    });
  }

  /** 
  * Executes after first render of the component
  * Calls function to fetch list of the resource to display
  */
  useEffect(() => {
    fetchAreas();
  }, [])

  return (
    <div className='py-4 px-2'>
      <div className='flex flex-row items-center gap-3'>
        <h1 className='font-extrabold text-dark-blue'>Areas</h1>
        <button>
          <FontAwesomeIcon icon={faCirclePlus} color = '#EF8354' size = "2xl" onClick={() => {
            navigate("/area/create")
          }}/>
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-md">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-lg font-bold text-black uppercase bg-light-blue">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Nombre
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Escuela
                    </th>
                    <th scope="col" className="px-6 py-3">
                        <span className="sr-only">Edit</span>
                    </th>
                </tr>
            </thead>
            <tbody>
              {areas && areas.map((area) => (
                  <tr className="bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-300">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {area.name}
                    </th>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {area.school.name}
                    </th>
                    <td className="px-6 py-4 text-right">
                        <button
                           onClick={() => {
                            navigate("/area/edit", { state: { area: area } });
                           }}
                        >
                          <FontAwesomeIcon icon={faPen} color = "#1B407F"  size = "2xl"/>
                        </button>
                    </td>
                  </tr>
              ))}
                
            </tbody>
        </table>
      </div>



      {/* {dummyData.students.map((student) => (
        <p>{student.name}</p>
      ))} */}
    </div>
  )
}

export default Areas;