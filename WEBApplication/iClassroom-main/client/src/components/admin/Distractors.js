import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyData } from '../../dummyData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
/**------------------------------------------------------------------------
 **                           Distractors
 *?  Renders a list of the entries for the given resource (Distractors indicators)
 *------------------------------------------------------------------------**/
function Distractors() {
  const navigate = useNavigate();
  const [distractorsIndicators, setDistractorsIndicators] = useState('');
  const api_endpoint = process.env.REACT_APP_API_ENDPOINT;


   /**
   * Fetch the list of all entries of the resource
   */
  const fetchingDistractorsIndicators = async () => {
    const options = {method: 'GET', url: `${api_endpoint}/distractor`};

    axios.request(options).then(function (response) {
      setDistractorsIndicators(response.data);
    }).catch(function (error) {
      console.error(error);
    });
  }

  /** 
  * Executes after first render of the component
  * Calls function to fetch list of the resource to display
  */
  useEffect(() => {
    fetchingDistractorsIndicators();
  }, [])

  return (
    <div className='py-4 px-2'>
      <div className='flex flex-row items-center gap-3'>
        <h1 className='font-extrabold text-dark-blue'>Indicadores de Distractores</h1>
        <button>
          <FontAwesomeIcon icon={faCirclePlus} color = '#EF8354' size = "2xl" onClick={() => {
            navigate("/indicator/create", { state: { resource: 'distractors' }})
          }}/>
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-md">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-sm text-gray-800 uppercase bg-light-blue">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Nombre
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Descripción
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Tipo
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
              {distractorsIndicators && distractorsIndicators.map((indicator) => (
                  <tr className="bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-300">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {indicator.name}
                    </th>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900">
                        {indicator.description}
                    </th>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {indicator.data_type}
                    </th>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {indicator.indicator_group.school.name}
                    </th>
                    <td className="px-6 py-4 text-right">
                        <button
                           onClick={() => {

                            navigate("/indicator/edit", { state: { indicator: indicator, type: 'distractors' } });
                           }}
                        >
                          <FontAwesomeIcon icon={faPen} color = "#1B407F" size = "2xl"/>
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

export default Distractors;