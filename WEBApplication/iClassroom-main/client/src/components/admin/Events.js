import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { eventsDummy } from './eventsDummy';
import axios from "axios";


/**------------------------------------------------------------------------
 **                           Events
 *?  Renders a list of the entries for the given resource (Events)
 *------------------------------------------------------------------------**/
function Events() {
  const navigate = useNavigate();
  const api_endpoint = process.env.REACT_APP_API_ENDPOINT;
  const [events, setEvents] = useState('');


   /**
   * Fetch the list of all entries of the resource
   */
  const fetchEvents = async () => {
    const options = {method: 'GET', url: `${api_endpoint}/class_rooms`};

    axios.request(options).then(function (response) {
      setEvents(response.data);
    }).catch(function (error) {
      console.error(error);
    });
  }

  /** 
  * Executes after first render of the component
  * Calls function to fetch list of the resource to display
  */
  useEffect(() => {
    fetchEvents();
  }, [])

  return (
    <div className='py-4 px-2'>
      <div className='flex flex-row items-center gap-3'>
        <h1 className='font-extrabold text-dark-blue'>Clases</h1>
        <button>
          <FontAwesomeIcon icon={faCirclePlus} color = '#EF8354' size = "2xl" onClick={() => {
            navigate("/event/create")
          }}/>
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-md">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-lg font-bold text-gray-800 uppercase bg-light-blue">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Escuela
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Materia
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Salón
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Horario
                    </th>
                    <th scope="col" className="px-6 py-3">
                        <span className="sr-only">Edit</span>
                    </th>
                </tr>
            </thead>
            <tbody>
              {events && events.map((event) => (
                  <tr className="bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-300">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {event.school.name}
                    </th>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {event.subject.name}
                    </th>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {event.room.name}
                    </th>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {event.start_cron}
                    </th>
                    <td className="px-6 py-4 text-right">
                        <button
                           onClick={() => {
                            navigate("/event/edit", { state: { event: event } });
                           }}
                        >
                          <FontAwesomeIcon icon={faPen} color = "#1B407F" size='2xl'/>
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

export default Events;