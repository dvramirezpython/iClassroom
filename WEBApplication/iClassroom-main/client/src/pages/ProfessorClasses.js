import {React, useState, useEffect} from 'react';
import NavBar from '../components/professor-dashboard/NavBar';
import MyClasses from '../components/professor-dashboard/MyClasses';
import Greeting from '../components/professor-dashboard/Greeting';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

/**------------------------------------------------------------------------
 **                           ProfessorClasses
 *?  Renders teacher's MyClasses dashboard
 *------------------------------------------------------------------------**/
function ProfessorClasses() {

  const navigate = useNavigate()
  const { state } = useLocation(''); 
  const [teacher, setTeacher] = useState();

  useEffect(() => {
    if(!state){
      navigate("/"); //redirect to login if state wasn't received (user is not logged in)
    }else{
      setTeacher(state.teacher) //sets teacher object
    }
  }, [])

  return (
    <div className='bg-gray-100 md:h-screen'>
      <NavBar />
      <div className='md:flex flex-row h-4/5'>
        <div className='p-3 h-100 md:w-1/3'>
          {teacher && <Greeting teacher = {teacher}/>}
        </div>
        <div className='p-3 h-100 md:w-2/3'>
          {teacher && <MyClasses teacher = {teacher} />}
        </div>
      </div>
    </div>
  )
}

export default ProfessorClasses