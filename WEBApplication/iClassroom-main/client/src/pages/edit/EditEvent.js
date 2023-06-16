import {React, useEffect, useState, } from 'react';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert'; 
import axios from 'axios';


/**------------------------------------------------------------------------
 **                           EditEvent
 *?  Renders form to edit an existing event 
 *------------------------------------------------------------------------**/

function EditEvent() {
  const navigate = useNavigate();
  const { state } = useLocation('');
  const [area, setArea] = useState('');
  const [school, setSchool] = useState('');
  const [subject, setSubject] = useState('');
  const [tuitionList, setTuitionList] = useState([]);
  const [studentsDisable, setStudentsDisable] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
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
  const [professorDisable, setProfessorDisable] = useState(true);
  const [supervisorDisable, setSupervisorDisable] = useState(true);
  const [roomDisable, setRoomDisable] = useState(true);
  const [timeDisable, setTimeDisable] = useState(true);


   /**
   * Executes first time the component finishes rendering
   * Gets state's object to set attributes of the existing degree
   */
  useEffect(() => {
    setSchool(state.event.school);
    setArea(state.event.subject.area);
    setSubject(state.event.subject);
    setGroup(state.event.group);
    setRoom(state.event.room._id);
    setProfessor(state.event.teacher._id);
    setSupervisor(state.event.supervisor);
    //setStartTime(state.event.startTime);
    const t = state.event.start_cron.split(" ");
    ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].forEach(d => { //Constructs frecuency array from the string
      if(t[1].includes(d)){
        setFrecuency((prevList) => [ ...prevList, d]);
      }
    });
    
    setStartTime(t[0]); //sets starting time only from first part of start_cron
    setEndTime(state.event.end_cron);
  }, [])

  useEffect(() => {
    if(school){
      //Get teacher for selected school
      let options = {
        method: 'GET',
        url: `http://localhost:5000/teachersPerSchool/${school._id}`
      };
      
      axios.request(options).then(function (response) {
        setProfessorSelection(response.data);
      }).catch(function (error) {
        console.error(error);
      });

      //Get rooms for selected school
      options = {
        method: 'GET',
        url: `http://localhost:5000/roomsPerSchool/${school._id}`
      };
      
      axios.request(options).then(function (response) {
        setRoomSelection(response.data);
      }).catch(function (error) {
        console.error(error);
      });

      //get supervisors
      options = {method: 'GET', url: 'http://localhost:5000/supervisors'};

      axios.request(options).then(function (response) {
        setSupervisorSelection(response.data);
      }).catch(function (error) {
        console.error(error);
      });

      //get students
      options = {method: 'GET', url: `http://localhost:5000/studentsPerSchool/${school._id}`};
      axios.request(options).then(function (response) {
        let arr = {};
        let arr2 = [];
        response.data.forEach((s) => {
          arr[s.tuition] = s;
          if(state.event.students.includes(s._id)){
            arr2.push(s);
          }
        })
        setTuitionList(arr);
        setSelectedStudents(arr2);
      }).catch(function (error) {
        console.error(error);
      });
    }
  }, [school] )

  /**
   * Calls endpoint to update existing resource with the sent data
   */
  const editEvent = () => {

    const options = {
      method: 'POST',
      url: `http://localhost:5000/class_room/update/${state.event._id}`,
      headers: {'Content-Type': 'application/json'},
      data: {
        refreshTimeSecs: 5,
        start_cron: `${startTime} ${frecuency.toString().replaceAll(',', '')}`, //creates frecuency string start time + days of the week
        end_cron: endTime,
        school: school._id,
        room: room,
        subject: subject._id,
        group: group._id,
        teacher: professor,
        active: 'false',
        students: selectedStudents.map((s) => s._id), //creates array of selected students' tuition
        supervisor: supervisor
      }
    };

    axios.request(options).then(function (response) {
      navigate("/admin", { state: { resource: 'events' } });
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
      if(!selectedStudents.includes(tuitionList[inputedStudent])){//checks if student was previosly selected to avoid repeating student
        setSelectedStudents((prevList) => [ ...prevList, tuitionList[inputedStudent]]);//if valid add to selected students
      }
    }else{
      setStudentWarning(true);//if student doesn't exist in schools tuition list show warning
    }
  }

  //erase student from selected students
  const deleteStudent = (student) => {
    setSelectedStudents(selectedStudents.filter((t) => t != student))
  }


   /*
    Calls endpoint to delete resource. If successfull redirect the user to the admin dashboard and list of the deleted resource's type to show deleted entry. If not successfull show error message
  */
  const confirmDelete = () => {
    confirmAlert({
      title: '',
      message: '¿Está seguro de eliminar este registro?',
      buttons: [
        {
          label: 'Sí',
          onClick: () => {
            console.log("Borrando usuario");
            const options = {
              method: 'GET',
              url: `http://localhost:5000/class_room/delete/${state.event._id}`,
              headers: {'Content-Type': 'application/json'}
            };
        
            axios.request(options).then(function (response) {
              navigate("/admin", { state: {resource: 'events'}});
            }).catch(function (error) {
              alert("Error borrando la clase.");
            });
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  }

  return (
    <div className='h-screen px-3'>
      <div className = 'edit-container w-full' >
        <div className='flex flex-row items-center gap-4'>
          <h1 className='mb-2'>Editando Clase</h1>
          <button onClick={confirmDelete}>
            <FontAwesomeIcon icon = { faTrash } color = '#d43131' size='xl'  />
          </button>
        </div>

        <div className='flex flex-row'> 
          <div className="w-1/2">
            <h5 className='text-2xl text-dark-blue font-bold'>Escuela</h5>
            <div className='flex flex-row gap-1'>
              <input 
                value={school.name}
                type='text'
                size = '30'
                disabled={true}
                className="input"
              />
            </div>


            <br />

            <h5 className='text-2xl text-dark-blue font-bold'>Area</h5>
            <div className='flex flex-row gap-1'>
              <input 
                value={area.name}
                type='text'
                size = '30'
                disabled={true}
                className="input"
              />
            </div>

            <br />

            <h5 className='text-2xl text-dark-blue font-bold'>Materia</h5>
            <div className='flex flex-row gap-1'>
              <input 
                value={subject.name}
                type='text'
                size = '30'
                disabled={true}
                className="input"
              />
            </div>

            <br/>
              
            <h5 className='text-2xl text-dark-blue font-bold'>Grupo</h5>
            <div className='flex flex-row gap-1'>
              <input 
                value={group.group_key}
                type='text'
                size = '30'
                disabled={true}
                className="input"
              />
            </div>

            <br/>
              
            <h5 className='text-2xl text-dark-blue font-bold'>Salón</h5>
            <div className='flex flex-row gap-1'>
              <select className =  'input' onChange={(e) => {setRoom(e.target.value)}} 
                disabled={roomDisable}>
                {roomSelection && roomSelection.map((s) => {
                    return <option key={s._id} value={s._id} selected={s._id == room}  >
                        {s.name}
                    </option>
                })}
              </select>
              <button className='h-full' onClick={() => {setRoomDisable(!roomDisable)}} >
                {roomDisable && <FontAwesomeIcon icon = { faPen } />}
                {!roomDisable && <FontAwesomeIcon icon= { faCheck } />}
              </button>
            </div>

            <br/>
              
            <div className='flex flex-row gap-2 items-center'>
              <h5 className='text-2xl text-dark-blue font-bold'>Horario</h5>
              <button className='h-full' onClick={() => {setTimeDisable(!timeDisable)}} >
              {timeDisable && <FontAwesomeIcon icon = { faPen } />}
              {!timeDisable && <FontAwesomeIcon icon= { faCheck } />}
              </button>
            </div>
            <div className='flex flex-row gap-1'>
              <div className='w-1/2'>
                <h6>Horario Inicio</h6>
                <input type='time' disabled = {timeDisable} onChange={(e) => setStartTime(e.target.value)} value={startTime} />
                <br/><br/> 
                <h6>Horario Fin</h6>
                <input type='time' disabled = {timeDisable} onChange={(e) => setEndTime(e.target.value)} value={endTime} />
              </div>
              <div className='w-1/2'>
                <h6>Frecuencia</h6>
                <input type = "checkbox" disabled = {timeDisable} value = 'Lu' onChange={() => handleCheckBoxPress('Lu')} checked = {frecuency.includes('Lu')} ></input>
                <label>Lunes</label>
                <br/>
                <input type = "checkbox" disabled = {timeDisable} value = 'Ma' onChange={() => handleCheckBoxPress('Ma')} checked = {frecuency.includes('Ma')}></input>
                <label>Martes</label>
                <br/>
                <input type = "checkbox" disabled = {timeDisable} value = 'Mi' onChange={() => handleCheckBoxPress('Mi')} checked = {frecuency.includes('Mi')}></input>
                <label>Miércoles</label>
                <br/>
                <input type = "checkbox" disabled = {timeDisable} value = 'Ju' onChange={() => handleCheckBoxPress('Ju')} checked = {frecuency.includes('Ju')}></input>
                <label>Jueves</label>
                <br/>
                <input type = "checkbox" disabled = {timeDisable} value = 'Vi' onChange={() => handleCheckBoxPress('Vi')} checked = {frecuency.includes('Vi')}></input>
                <label>Viernes</label>
                <br/>
                <input type = "checkbox" disabled = {timeDisable} value = 'Sa' onChange={() => handleCheckBoxPress('Sa')} checked = {frecuency.includes('Sa')}></input>
                <label>Sábado</label>
              </div>
            </div>
          </div> 

          <div className="w-1/2 px-3">
            <h5 className='text-2xl text-dark-blue font-bold'>Profesor Encargado</h5>
            <div className='flex flex-row gap-1'>
              <select className =  'input' onChange={(e) => {setProfessor(e.target.value)}} disabled={professorDisable}>
                {professorSelection && professorSelection.map((s) => {
                    return <option key={s._id} value={s._id} selected={s._id == professor} >
                        {s.name + " " + s.last_name}
                    </option>
                })}
              </select>
              <button className='h-full' onClick={() => {setProfessorDisable(!professorDisable)}} >
                {professorDisable && <FontAwesomeIcon icon = { faPen } />}
                {!professorDisable && <FontAwesomeIcon icon= { faCheck } />}
              </button>
            </div>

            <br/>


            <h5 className='text-2xl text-dark-blue font-bold'>Supervisor</h5>
            <div className='flex flex-row gap-1'>
              <select className =  'input' onChange={(e) => {setSupervisor(e.target.value)}} disabled={supervisorDisable}>
                {supervisorSelection && supervisorSelection.map((s) => {
                    return <option key={s._id} value={s._id} selected={s._id == supervisor} >
                        {s.name + " " + s.last_name}
                    </option>
                })}
              </select>
              <button className='h-full' onClick={() => {setSupervisorDisable(!supervisorDisable)}} >
                {supervisorDisable && <FontAwesomeIcon icon = { faPen } />}
                {!supervisorDisable && <FontAwesomeIcon icon= { faCheck } />}
              </button>
            </div>

            <br/>

            <div className='flex flex-row gap-2 items-center'>
              <h5 className='text-2xl text-dark-blue font-bold'>Alumnos</h5>
              <button className='h-full' onClick={() => {setStudentsDisable(!studentsDisable)}} >
              {studentsDisable && <FontAwesomeIcon icon = { faPen } />}
              {!studentsDisable && <FontAwesomeIcon icon= { faCheck } />}
              </button>
            </div>
        
            <div className='flex flex-row gap-1'>
              <input type = 'text' placeholder='A12345678' onChange={(e) => setInputedStudent(e.target.value)} disabled={studentsDisable}/>
              <button onClick={()=>checkIfTuitionValid()} disabled={studentsDisable}>Añadir Alumno</button>
            </div>
            
            {studentWarning && <p className='text-red-400'>Matricula no registrada en el sistema</p>}

            <div className='my-2 w-100'>
              {selectedStudents && <table className='w-100' style={{width: '100%'}}>
                  <thead>
                    <tr className='text-left'>
                      <th>Nombre</th>
                      <th>Matrícula</th>
                      <th scope="col" className="">
                        <span className="sr-only">Edit</span>
                      </th>
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
            editEvent()
          }}>
            Actualizar registro
          </button>
        </div>

      </div> 
    </div>
  )
}

export default EditEvent;