import { React, useState, useEffect} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { dummyData } from '../../dummyData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';


/**------------------------------------------------------------------------
 **                           Subjects
 *?  Renders a list of the entries for the given resource (Subjects)
 *------------------------------------------------------------------------**/
function Subjects() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState('');
  const api_endpoint = process.env.REACT_APP_API_ENDPOINT;
  const [schools, setSchools] = useState({});


   /**
   * Fetch the list of all entries of the resource
   */
  const fetchSubjects = async () => {
    const optionsSchools = {method: 'GET', url: `${api_endpoint}/schools`}; //get all schools
    const schoolsAux = {}
    axios.request(optionsSchools).then(function (response) {
      response.data.forEach((school) => {
        schoolsAux[school._id.toString()] = school.name; //create dictionary with the key being the id and value the school name
      })
    }).catch(function (error) {
      console.error(error);
    });
    await setSchools(schoolsAux);

    const optionsSubjects = {method: 'GET', url: 'http://localhost:5000/subjects'}; //get subjects
    axios.request(optionsSubjects).then(function (response) {
      setSubjects(response.data);
    }).catch(function (error) {
      console.error(error);
    });
  }


/** 
  * Executes after first render of the component
  * Calls function to fetch list of the resource to display
  */
  useEffect(() => {
    fetchSubjects();
  }, [])

  return (
    <div className='py-4 px-2'>
      <div className='flex flex-row items-center gap-3'>
        <h1 className='font-extrabold text-dark-blue'>Materias</h1>
        <button>
          <FontAwesomeIcon icon={faCirclePlus} color = '#EF8354' size = "2xl" onClick={() => {
            navigate("/subject/create")
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
                        Area
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
              {subjects && subjects.map((subject) => (
                  <tr key = {subject._id} className="bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-300">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {subject.name}
                    </th>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {subject.area ? subject.area.name : 'NULL'}
                    </th>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {subject.area ? subject.area.school.name : 'NULL'}
                    </th>
                    <td className="px-6 py-4 text-right">
                        <button
                           onClick={() => {
                            navigate("/subject/edit", { state: { subject: subject } });
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



      {/* {dummyData.students.map((student) => (
        <p>{student.name}</p>
      ))} */}
    </div>
  )
}

export default Subjects;