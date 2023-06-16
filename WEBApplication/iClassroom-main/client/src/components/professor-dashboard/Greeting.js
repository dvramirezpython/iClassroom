import {React, useState, useEffect} from 'react'


/**------------------------------------------------------------------------
 **                           Greeting
 *?  Renders Greeting component, that includes a clock, date and name of teacher signed in
 *------------------------------------------------------------------------**/
function Greeting({teacher}) {
  const [today, setToday] = useState(new Date());
  const opts = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}

  //updates clock's time
  useEffect(() => {
    updateTime();
  }, [])

  const updateTime = () => {
    setToday(new Date());
    setTimeout(updateTime, 1000); //set interval to update clocks time every second
  }  

  return (
    <div className='bg-gray-200 shadow-xl rounded-xl p-3 text-center text-xl justify-center flex flex-col' style={{height: '100%'}}>
      <p className='text-2xl'>Bienvenido profesor 
        <span className='font-semibold'> {teacher.name.charAt(0).toUpperCase() + teacher.name.slice(1) + " " + teacher.last_name.charAt(0).toUpperCase() + teacher.last_name.slice(1)}</span>
      </p>
      <p className='text-2xl'>Hoy es {today.toLocaleDateString('es-ES', opts)} {'\n'} La hora es: </p>

      <p className='font-bold text-3xl'>{`${today.getHours()}:${today.getMinutes() < 10? `0${today.getMinutes()}`: `${today.getMinutes()}` }`}</p>
    </div>
  )
}

export default Greeting