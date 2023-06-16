import {React, useState, useEffect} from 'react';
import GroupAnalytics from '../components/dashboard/GroupAnalytics';
import DistractorsAnalytics from '../components/dashboard/DistractorsAnalytics';
import NavBar from '../components/dashboard/NavBar';
import IndividualAnalytics from '../components/dashboard/IndividualAnalytics';
import Results from '../components/dashboard/Results';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


/**------------------------------------------------------------------------
 **                           MainDashboard
 *?  Renders dashboard that shows indicators
 *------------------------------------------------------------------------**/

function MainDashboard() {
  const [today, setToday] = useState(new Date);
  const opts = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
  const {state} = useLocation();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate()

  /*  
  *  Calls endpoints that populate database with dummy data 
  */ 
  const createLogs = () => {
    const options = {
      method: 'POST',
      url: `http://localhost:5000/indicator_log/auto_add/${state.class_session}`
    };
    
    axios.request(options).then(function (response) {
      //do nothing
    }).catch(function (error) {
      console.error(error);
    });
  }

  //Executes once view is first rendered
  useEffect(() => {
    const timeUpdate = setInterval(updateTime, 1000); //set interval that updates clock in greeting every second
    const timeUpdate2 = setInterval(createLogs, 1000); //set interval that calls createLogs every second
    if(!state){
      navigate("/"); //redirect to login if state wasn't received (user is not logged in)
    }else{
      setName(state.class.teacher); //sets teacher name
    }
    return () => {
      clearInterval(timeUpdate);
      clearInterval(timeUpdate2);
    };
  }, [])

  //updates clock in greeting
  const updateTime = () => {
    setToday(new Date);
  }


  return (
    <div className='bg-gray-100 h-100 pb-5'>
      <NavBar />
      <div className='my-4 text-center'>
        <h1 className='px-3'>¡Buenos días {name}!</h1>
        <p className='text-xl'>Hoy es {today.toLocaleDateString('es-ES', opts)} </p>  <p> La hora es: </p>
        <p className='font-bold text-3xl'>{`${today.getHours()}:${today.getMinutes() < 10? `0${today.getMinutes()}`: `${today.getMinutes()}` }`}</p>
      </div>
      <div>
        <div className='px-3'>
          <GroupAnalytics classroom={state.class} class_session={state.class_session}/>
        </div>
        <br />
        <div className='flex flex-col lg:flex-row px-3'>
          <div className='lg:w-1/3'>
            <DistractorsAnalytics setIsLoading = {setIsLoading} classroom={state.class} class_session={state.class_session}/>
          </div>
          <div className='pl-0 mt-3 lg:w-1/3 lg:pl-4 md:mt-0'>
            <IndividualAnalytics classroom={state.class} class_session={state.class_session}/>
          </div>
          <div className='pl-0 mt-3 lg:w-1/3 lg:pl-4 md:mt-0'>
            <Results  />
          </div>
        </div> 
      </div>
    </div>
  )
}

export default MainDashboard;