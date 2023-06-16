import {React, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo-tec.png';
import logoBlanco from '../../assets/logo-tec-blanco.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons/faAngleUp';

function SideBar({resourceCallback, selected}) {
  const navigate = useNavigate();
  const [resource, setResource] = useState('');
  const [hidden, setHidden] = useState(true);
  const [showUsers, setShowUsers] = useState(false);
  const [showSchoolEntities, setShowSchoolEntities] = useState(false);
  const [showIndicators, setShowIndicators] = useState(false);

  useEffect(() => {
    resourceCallback(resource);
  }, [resource])

  useEffect(() => {
    setResource(selected? selected : 'students');
  }, [])

  //ESTA BIEN FEO :(( 

  return (

    <div>
      <div className='bg-gray-dark md:h-screen'>

        <div className='hidden md:block'>
          <img src = {logoBlanco} className = "w-1/3 mx-auto" /> 
          <h3 className='text-white text-center mt-2 lg:text-4xl '>iClassroom</h3>
        </div>

        <div className='block md:hidden flex flex-row p-3 items-center'>
          <div className='w-1/3'>
            <img src = {logoBlanco} className = "" /> 
          </div>
          <div className='grid w-2/3 justify-items-end'>
            <FontAwesomeIcon onClick={() => {setHidden(!hidden)}} icon = {faBars} size = 'xl' color = 'white' className=''/>
          </div>
        </div>

        <br></br>
        {hidden && 
        <div>
          <div className= {`mx-auto text-center flex flex-col`} >
            <button 
                onClick={() => {setResource('approval')}}
            > 
              <div className='flex flex-row items-center justify-between px-3'>
                <span className={`${resource != 'approval' ? 'btn-admin' : 'btn-admin-selected'}`} >Aprobación de Cuentas</span>
              </div>
            </button>

            {/* USERS */}
            <button 
                onClick={() => {setResource('events')}}
            > 
              <div className='flex flex-row items-center justify-between px-3'>
                <span className={`${resource != 'events' ? 'btn-admin' : 'btn-admin-selected'}`} >Clases</span>
              </div>
            </button>


            {/* USERS */}
            <button 
                onClick={() => {
                  setShowUsers(!showUsers)
                }}
            > 
              <div className='flex flex-row items-center justify-between px-3'>
                <span className='btn-dropdown'>Usuarios</span>
                {!showUsers && <FontAwesomeIcon icon = {faAngleDown} color='white'/>}
                {showUsers && <FontAwesomeIcon icon = {faAngleUp} color='white'/>}
              </div>
            </button>
            {showUsers && <div className='flex flex-col block bg-black'>
              <button 
                className={resource != 'students' ? 'btn-admin' : 'btn-admin-selected'}
                onClick={() => {
                  setResource('students')
                }}
              >Estudiantes</button>

              <button 
                className={resource != 'teachers' ? 'btn-admin' : 'btn-admin-selected'}
                onClick={() => {
                  setResource('teachers')
                }}
              >Profesores</button>

              <button 
                className={resource != 'admins' ? 'btn-admin' : 'btn-admin-selected'}
                onClick={() => {
                  setResource('admins')
                }}
              >Administradores</button>

              <button 
                className={resource != 'supervisors' ? 'btn-admin' : 'btn-admin-selected'}
                onClick={() => {
                  setResource('supervisors')
                }}
              >Supervisores</button>
            </div>}


            <button 
                onClick={() => {
                  setShowSchoolEntities(!showSchoolEntities)
                }}
            > 
              <div className='flex flex-row items-center justify-between px-3 '>
                <span className='btn-dropdown'>Entidades Escolares</span>
                {!showSchoolEntities && <FontAwesomeIcon icon = {faAngleDown} color='white'/>}
                {showSchoolEntities && <FontAwesomeIcon icon = {faAngleUp} color='white'/>}
              </div>
            </button>
            {/* SCHOOL ENTITIES */}
            {showSchoolEntities &&
            <div className='flex flex-col block bg-black'>
              <button 
              className={resource != 'schools' ? 'btn-admin' : 'btn-admin-selected'}
              onClick={() => {
                setResource('schools')
              }}
              > Escuelas</button>
              <button 
                className={resource != 'areas' ? 'btn-admin' : 'btn-admin-selected'}
                onClick={() => {
                  setResource('areas')
                }}
              >Areas</button>

              <button 
                className={resource != 'degrees' ? 'btn-admin' : 'btn-admin-selected'}
                onClick={() => {
                  setResource('degrees')
                }}
              >Carreras</button>

              <button 
                className={resource != 'subjects' ? 'btn-admin' : 'btn-admin-selected'}
                onClick={() => {
                  setResource('subjects')
                }}
              >Materias</button>

              <button 
                className={resource != 'groups' ? 'btn-admin' : 'btn-admin-selected'}
                onClick={() => {
                  setResource('groups')
                }}
              >Grupos</button>

          
              <button 
                className={resource != 'rooms' ? 'btn-admin' : 'btn-admin-selected'}
                onClick={() => {
                  setResource('rooms')
                }}
              >Salones</button>
            </div>}

            <button 
                onClick={() => {
                  setShowIndicators(!showIndicators)
                }}
            > 
              <div className='flex flex-row items-center justify-between px-3'>
                <span className='btn-dropdown'>Indicadores</span>
                {!showIndicators && <FontAwesomeIcon icon = {faAngleDown} color='white'/>}
                {showIndicators && <FontAwesomeIcon icon = {faAngleUp} color='white'/>}
              </div>
            </button>



            {/* INDICATORS */}
            {showIndicators && <div className='flex flex-col block bg-black'>
              <button 
                className={resource != 'engagement' ? 'btn-admin' : 'btn-admin-selected'}
                onClick={() => {
                  setResource('engagement')
                }}
              >Engagement</button>
              <button 
                className={resource != 'distractors' ? 'btn-admin' : 'btn-admin-selected'}
                onClick={() => {
                  setResource('distractors')
                }}
              >Distractores</button>
              <button 
                className={resource != 'attention' ? 'btn-admin' : 'btn-admin-selected'}
                onClick={() => {
                  setResource('attention')
                }}
              >Atención</button>
              <button 
                className={resource != 'interaction' ? 'btn-admin' : 'btn-admin-selected'}
                onClick={() => {
                  setResource('interaction')
                }}
              >Interacción</button>
            </div>}
            <button onClick={() => navigate('/')} className='my-4 mx-auto'>
              <FontAwesomeIcon icon = { faSignOut } color='white' size='xl' />
            </button>
          </div>
        </div>
        }
      </div>
    </div>
  )
}

export default SideBar