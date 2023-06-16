import {React, useState, useEffect} from 'react';
import { classesDummy } from './classesDummy';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

/**------------------------------------------------------------------------
 **                           MyClasses
 *?  Renders MyClasses component, that includes a list a today's classes for the teacher signed in
 *------------------------------------------------------------------------**/

function MyClasses({teacher}) {
  const now = new Date();
  const navigate = useNavigate();
  const [showPrompt, setShowPrompt] = useState(false);
  const [currentClass, setCurrentClass] = useState(false);
  const [frecuency, setFrecuency] = useState([]);
  const [classes, setClasses] = useState([]);
  const api_endpoint = process.env.REACT_APP_API_ENDPOINT;
  const days = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];


  /**  
   * Calls endpoint to create new class session for the current classroom
   */
  const generateClassSession = (classroom_id) => {
    const options = {
      method: 'POST',
      url: 'http://localhost:5000/class_session/add',
      headers: {'Content-Type': 'application/json'},
      data: {active: true, classroom: currentClass.id, date: new Date()}
    };

    axios.request(options).then(function (response) {
      navigate('/dashboard', {state: {class : currentClass, class_session: response.data._id}}) //navigate to indicators dashboard and send recently created class session object
    }).catch(function (error) {
      console.error(error);
    });
  }

  /** 
  * Calls endpoint to fetch all classes for the teacher signed in 
  * For every class check if it is scheduled for today
  */
  const fetchClassRooms = async () => {
    const options = {
      method: 'GET',
      url: `${api_endpoint}/class_roomsPerTeacher/${teacher._id}`
    };
  
    await axios.request(options).then(function (response) {
      const today = new Date();
      response.data.forEach((c) => { //for each class
        const t = c.start_cron.split(" "); //separate starting time and days frecuency
        if(t[1].includes(days[today.getDay() - 1])){ //checks current day agains frencuency string
          setClasses((prev) => [...prev, {id: c._id, name: c.subject.name, group: c.group.group_key, room: c.room.name, endTime: c.end_cron, startTime: c.start_cron.split(" ")[0], frecuency: c.start_cron.split(" ")[1], teacher: c.teacher.name + " " + c.teacher.last_name,  refreshTime: c.refreshTimeSecs}]) //add new class
        }
      })
    }).catch(function (error) {
      console.error(error);
    });
  }

  //check if one of a teacher's classes for today is currently happening
  const checkIfCurrentClass = () => {
    classes.forEach((c) => {
      if(c.startTime < now.toLocaleTimeString('it-IT') && c.endTime > now.toLocaleTimeString('it-IT')){ //if starttime was in the past and end time is in the future
        setShowPrompt(true); //show message to go to indicators dashboard 
        setCurrentClass(c); //set current class to show name of the class
      }
    })
  }

  //once classes are set call function to check if any of them is happening at the moment
  useEffect(() => {
    checkIfCurrentClass();
  }, [classes])

  /**
  * Executes once the component finishes rendering
  * Fetches classes of the teacher signed in 
  */
  useEffect(() => {
    setShowPrompt(false);
    fetchClassRooms();
  }, [])

  return (
    <div className='md:h-full bg-gray-200 shadow-xl rounded-xl p-3'>
      <div className='h-3/4'>
        <span className='font-semibold text-xl'>Su agenda del día de hoy:</span>
        {classes.length == 0 && <div>
          <h3 className='text-3xl text-center'>¡No tienes clases hoy!</h3>  
        </div>}
        {classes.length != 0 && <table className='mt-4 w-full text-lg text-left text-gray-500 dark:text-gray-400'>
          <thead className='font-bold text-black text-lg'>
            <th>Clase</th>
            <th>Grupo</th>
            <th>Salón</th>
            <th>Horario</th>
            <th></th>
          </thead>
          <tbody>
            {classes.map((c) => (
              <tr key = {c.id}>
                <td>{c.name}</td>
                <td>{c.group}</td>
                <td>{c.room}</td>
                <td>{c.startTime}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>}
      </div>
      {showPrompt && <div className='bg-[#a1eaf7] rounded-xl w-fit px-5 py-3 mx-auto'> 
        <p className='font-bold text-xl'>Clase en curso {currentClass.name}, ¿desea activar el sistema?</p>
        <div className='flex flex-row gap-4 justify-center'>
          <button className='bg-white rounded px-2 py-1' 
            onClick={async () => {
              await generateClassSession();}
            }>Sí</button>
          <button className='bg-white rounded px-2 py-1'>No</button>
        </div>
      </div>}
    </div>
  )
}

export default MyClasses