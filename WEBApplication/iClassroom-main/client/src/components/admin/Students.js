import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyData } from '../../dummyData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPen } from '@fortawesome/free-solid-svg-icons';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip'
import axios from "axios";


/**------------------------------------------------------------------------
 **                           Students
 *?  Renders a list of the entries for the given resource (Students)
 *------------------------------------------------------------------------**/
function Students() {
  const api_endpoint = process.env.REACT_APP_API_ENDPOINT;
  const navigate = useNavigate();
  const [students, setStudents] = useState();


  /** 
  * Executes after first render of the component
  * Calls function to fetch list of the resource to display
  */
  useEffect(() => {
     /**
     * Fetch the list of all entries of the resource
     */
    const fetchStudents = () => {
      const options = {method: 'GET', url: `${api_endpoint}/students`};
      axios.request(options).then(function (response) {
        console.log("Fetching students");
        setStudents(response.data.filter((s) => s.activated == true));
      }).catch(function (error) {
        console.error(error);
      });
    }
    fetchStudents();
  }, [])

  

  return (
    <div className='py-4 px-2'>
      <div className='flex flex-row items-center gap-3'>
        <h1 className='font-extrabold text-dark-blue'>Estudiantes</h1>
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
                        Matrícula
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Escuela
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Fecha de Creación
                    </th>
                    <th scope="col" className="px-6 py-3" id="edit">
                        <span className="sr-only">Edit</span>
                    </th>
                </tr>
            </thead>
            <tbody>
              {students && students.map((student) => (
                  <tr key = {student._id} className="bg-white border-b  dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-300">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {student.name}
                    </th>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {student.last_name}
                    </th>
                    <td className="px-6 py-4">
                        {student.email}
                    </td>
                    <td className="px-6 py-4">
                        {student.tuition}
                    </td>
                    <td className="px-6 py-4">
                        {student.school ? student.school.name : 'NULL'}
                    </td>
                    <td className="px-6 py-4">
                        {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                    <td className="pr-5 py-4 text-right">
                        <button
                           onClick={() => {
                            navigate("/student/edit", { state: { student: student } });
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
      {/* {dummyData.students.map((student) => (
        <p>{student.name}</p>
      ))} */}
    </div>
  )
}

export default Students