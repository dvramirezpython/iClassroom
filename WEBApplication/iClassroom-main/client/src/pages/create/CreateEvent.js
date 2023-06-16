import {React, useEffect, useState, } from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';



/**------------------------------------------------------------------------
 **                           CreateEvent
 *?  Renders form to create new event for a school
 *------------------------------------------------------------------------**/


function CreateEvent() {
  const navigate = useNavigate();
  const [areaSelection, setAreaSelection] = useState('');
  const [area, setArea] = useState('');
  const [schoolSelection, setSchoolSelection] = useState('');
  const [school, setSchool] = useState('');
  const [subject, setSubject] = useState('');
  const [tuitionList, setTuitionList] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [subjectSelection, setSubjectSelection] = useState('');
  const [groupSelection, setGroupSelection] = useState('');
  const [group, setGroup] = useState('');
  const [room, setRoom] = useState('');
  const [roomSelection, setRoomSelection] = useState('');
  const [professor, setProfessor] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [inputedStudent, setInputedStudent] = useState('');
  const [frecuency, setFrecuency] = useState([]);
  const [professorSelection, setProfessorSelection] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [supervisorSelection, setSupervisorSelection] = useState(false);
  const [studentWarning, setStudentWarning] = useState(false);
  const api_endpoint = process.env.REACT_APP_API_ENDPOINT;



  /**
   * Executes first time component finished rendering
   * 1) Fetches all schools for dropdown selection
   * 2) Fetches all supervisors for dropdown selection
   */
  useEffect(() => {
    //get schools
    let options = {method: 'GET', url: `${api_endpoint}/schools`};
    axios.request(options).then(function (response) {
      setSchoolSelection(response.data);
    }).catch(function (error) {
      console.error(error);
    });
    //get supervisors
    options = {method: 'GET', url: `${api_endpoint}/supervisors`};
    axios.request(options).then(function (response) {
      setSupervisorSelection(response.data);
    }).catch(function (error) {
      console.error(error);
    });
  }, [])


  /**
   * Executes every time users selects a new school from dropdown selection
   * Updates selections for the school the user just selected
   *  1) Areas
   *  2) Teacher
   *  3) Rooms 
   *  4) Student
   */
  useEffect(() => {
    if(school){
      //Get Areas for selected school
      let options = {
        method: 'GET',
        url: `${api_endpoint}/areasPerSchool/${school}`
      };

      axios.request(options).then(function (response) {
        setAreaSelection(response.data);
      }).catch(function (error) {
        console.error(error);
      });

      //Get teacher for selected school
      options = {
        method: 'GET',
        url: `${api_endpoint}/teachersPerSchool/${school}`
      };
      
      axios.request(options).then(function (response) {
        setProfessorSelection(response.data);
      }).catch(function (error) {
        console.error(error);
      });

      //Get rooms for selected school
      options = {
        method: 'GET',
        url: `${api_endpoint}/roomsPerSchool/${school}`
      };
      
      axios.request(options).then(function (response) {
        setRoomSelection(response.data);
      }).catch(function (error) {
        console.error(error);
      });

      //get students for selected school
      options = {method: 'GET', url: `${api_endpoint}/studentsPerSchool/${school}`};
      axios.request(options).then(function (response) {
        let arr = {};
        response.data.forEach((s) => { //creates dictionary where key is student's tuition and value is student object
          arr[s.tuition] = s;
        })
        setTuitionList(arr);
      }).catch(function (error) {
        console.error(error);
      });
    }
  }, [school] )

  /**
   * Executes everytime a user selects a new area
   * Fetches subjects for the area the user just selected
   */
  useEffect(() => {
    if(area){
      const options = {
        method: 'GET',
        url: `${api_endpoint}/subjectsPerArea/${area}`
      };

      axios.request(options).then(function (response) {
        setSubjectSelection(response.data);
      }).catch(function (error) {
        console.error(error);
      });
    }
  }, [area] )

  /** 
  * Executes evertime a user selects a new group
  * Fetches groups for the subject the user just selected
  */
  useEffect(() => {
    if(subject){
      const options = {
        method: 'GET',
        url: `${api_endpoint}/groupsPerSubject/${subject}`
      };

      axios.request(options).then(function (response) {
        setGroupSelection(response.data);
      }).catch(function (error) {
        console.error(error);
      });
    }
  }, [subject]);


  /**
   * Calls endpoint to create new event
   */
  const createNewEvent = () => {
    const options = {
      method: 'POST',
      url: `${api_endpoint}/class_room/add`,
      headers: {'Content-Type': 'application/json'},
      data: {
        refreshTimeSecs: 5,
        start_cron: `${startTime} ${frecuency.toString().replaceAll(',', '')}`, //sends starting time + days of the week 
        end_cron: endTime,
        school: school,
        room: room,
        subject: subject,
        group: group,
        teacher: professor,
        active: 'false',
        students: selectedStudents.map((s) => s._id), //send array of students' tutions
        supervisor: supervisor
      }
    };
    console.log(options.data);
    axios.request(options).then(function (response) {
      navigate("/admin", { state: { resource: 'events' } }); //redirect to admin dashboard if event successfully created
    }).catch(function (error) {
      alert("Error al crear evento.")
    });
  }

  //Executes every time the user selects or deselects day in frecuency
  const handleCheckBoxPress = (dia) => {
    if(!frecuency.includes(dia)){
      setFrecuency((prevList) => [ ...prevList, dia]); //add day in frecuency string if not already there
    }else{
      setFrecuency(frecuency.filter((t) => t != dia)) //deletes day from frecuency string if it was already selected
    }
  } 

  
  const checkIfTuitionValid = () => {
    if(Object.keys(tuitionList).includes(inputedStudent)){//checks if tuition inputed by the user exits in school's students list
      setStudentWarning(false);
      if(!selectedStudents.includes(tuitionList[inputedStudent])){ //checks if student was previosly selected to avoid repeating student
        setSelectedStudents((prevList) => [ ...prevList, tuitionList[inputedStudent]]); //if valid add to selected students
      }
    }else{
      setStudentWarning(true); //if student doesn't exist in schools tuition list show warning
    }
  }
 
  //erase student from selected students
  const deleteStudent = (student) => {
    setSelectedStudents(selectedStudents.filter((t) => t != student))
  }

  return (
    <div className='h-screen px-3'>
      <div className = 'edit-container w-full' >
        <div className='flex flex-row items-center gap-4'>
          <h1 className='mb-2'>Creando Nueva Clase</h1>
        </div>

        <div className='flex flex-row'> 
          <div className="w-1/2">
            <h5 className='text-2xl text-dark-blue font-bold'>Escuela</h5>
            <div className='flex flex-row gap-1'>
              <select className =  'input' onChange={(e) => {setSchool(e.target.value)}}>
                <option></option>
                {schoolSelection && schoolSelection.map((s) => {
                    return <option key={s._id} value={s._id}  >
                        {s.name}
                    </option>
                })}
              </select>
            </div>


            <br />

            <h5 className='text-2xl text-dark-blue font-bold'>Area</h5>
            <div className='flex flex-row gap-1'>
              <select className =  'input' onChange={(e) => {setArea(e.target.value)}}>
                <option></option>
                {areaSelection && areaSelection.map((a) => {
                    return <option key={a._id} value={a._id}  >
                        {a.name}
                    </option>
                })}
              </select>
            </div>

            <br />

            <h5 className='text-2xl text-dark-blue font-bold'>Materia</h5>
            <div className='flex flex-row gap-1'>
              <select className =  'input' onChange={(e) => {setSubject(e.target.value)}}>
                <option></option>
                {subjectSelection && subjectSelection.map((s) => {
                    return <option key={s._id} value={s._id}  >
                        {s.name}
                    </option>
                })}
              </select>
            </div>

            <br/>
              
            <h5 className='text-2xl text-dark-blue font-bold'>Grupo</h5>
            <div className='flex flex-row gap-1'>
              <select className =  'input' onChange={(e) => {setGroup(e.target.value)}}>
                <option></option>
                {groupSelection && groupSelection.map((s) => {
                    return <option key={s._id} value={s._id}  >
                        {s.group_key}
                    </option>
                })}
              </select>
            </div>

            <br/>
              
            <h5 className='text-2xl text-dark-blue font-bold'>Salón</h5>
            <div className='flex flex-row gap-1'>
              <select className =  'input' onChange={(e) => {setRoom(e.target.value)}}>
                <option></option>
                {roomSelection && roomSelection.map((s) => {
                    return <option key={s._id} value={s._id}  >
                        {s.name}
                    </option>
                })}
              </select>
            </div>

            <br/>
              
            <h5 className='text-2xl text-dark-blue font-bold'>Horario</h5>
            <div className='flex flex-row gap-1'>
              <div className='w-1/2'>
                <h6>Horario Inicio</h6>
                <input type='time' onChange={(e) => setStartTime(e.target.value)} value={startTime} />
                <br/><br/> 
                <h6>Horario Fin</h6>
                <input type='time' onChange={(e) => setEndTime(e.target.value)} value={endTime} />
              </div>
              <div className='w-1/2'>
                <h6>Frecuencia</h6>
                <input type = "checkbox" value = 'Lu' onChange={() => handleCheckBoxPress('Lu')}></input>
                <label>Lunes</label>
                <br/>
                <input type = "checkbox" value = 'Ma' onChange={() => handleCheckBoxPress('Ma')}></input>
                <label>Martes</label>
                <br/>
                <input type = "checkbox" value = 'Mi' onChange={() => handleCheckBoxPress('Mi')}></input>
                <label>Miércoles</label>
                <br/>
                <input type = "checkbox" value = 'Ju' onChange={() => handleCheckBoxPress('Ju')}></input>
                <label>Jueves</label>
                <br/>
                <input type = "checkbox" value = 'Vi' onChange={() => handleCheckBoxPress('Vi')}></input>
                <label>Viernes</label>
                <br/>
                <input type = "checkbox" value = 'Sa' onChange={() => handleCheckBoxPress('Sa')}></input>
                <label>Sábado</label>
              </div>
            </div>
          </div> 

          <div className="w-1/2 px-3">
            <h5 className='text-2xl text-dark-blue font-bold'>Profesor Encargado</h5>
            <div className='flex flex-row gap-1'>
              <select className =  'input' onChange={(e) => {setProfessor(e.target.value)}}>
                <option></option>
                {professorSelection && professorSelection.map((s) => {
                    return <option key={s._id} value={s._id}  >
                        {s.name + " " + s.last_name}
                    </option>
                })}
              </select>
            </div>

            <br/>


            <h5 className='text-2xl text-dark-blue font-bold'>Supervisor</h5>
            <div className='flex flex-row gap-1'>
              <select className =  'input' onChange={(e) => {setSupervisor(e.target.value)}}>
                <option></option>
                {supervisorSelection && supervisorSelection.map((s) => {
                    return <option key={s._id} value={s._id}  >
                        {s.name + " " + s.last_name}
                    </option>
                })}
              </select>
            </div>

            <br/>

            <h5 className='text-2xl text-dark-blue font-bold'>Alumnos</h5>
            <div className='flex flex-row gap-1'>
              <input type = 'text' placeholder='A12345678' onChange={(e) => setInputedStudent(e.target.value)}/>
              <button onClick={()=>checkIfTuitionValid()}>Añadir Alumno</button>
            </div>
            
            {studentWarning && <p className='text-red-400'>Matricula no registrada en el sistema</p>}

            <div className='my-2'>
              {selectedStudents && <table className='w-100' style={{width: '100%'}}>
                  <thead>
                    <tr className='text-left'>
                      <th>Nombre</th>
                      <th>Matrícula</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudents.map((s) => (
                      <tr key = {s._id}>
                        <td>{s.name + " " + s.last_name}</td>
                        <td>{s.tuition}</td>
                        <td>
                          <button 
                            className='text-blue-500'
                            onClick={() => deleteStudent(s)}
                          >Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody> 
              </table>}
            </div>
          </div>
        </div>

        <div className='flex flex-row gap-3 justify-end'>
          <button className='btn-admin-forms-back mt-3' onClick={() => {
            navigate("/admin", { state: { resource: 'events' } });
          }}>
            Back
          </button>
          <button className='btn-admin-forms mt-3' onClick={() => {
            createNewEvent()
          }}>
            Crear Evento de Clase
          </button>
        </div>

      </div> 
    </div>
  )
}

export default CreateEvent;