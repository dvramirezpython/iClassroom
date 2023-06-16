import {React, useState, useEffect, useRef} from 'react';
import HorizontalGauge from 'react-horizontal-gauge';



/**------------------------------------------------------------------------
 **                           DistractorsAnalytics
 *?  Renders DistractorsAnalytics component that includes a horizontal gauge for every distractor registered in the school
 *------------------------------------------------------------------------**/

function DistractorsAnalytics({class_session, classroom, setIsLoading}) {
  const ref = useRef(null);
  const [indicators, setIndicators] = useState('');
  const  gaugeTicks = [{label: '0', value: 0}, {label: '50', value: 50}, {label: '100', value: 100}];
  const [flag, setFlag] = useState(false);
  const [width, setWidth] = useState('');


  /**
   * Call to endpoint to fetch dummy data
   */
  const fetchData = async (class_session_id) => {
    console.log("Fetching Data");
    try {
      const arr = [];
      const response = await fetch(`http://localhost:5000/indicator_log/get_temp_distractors/${class_session_id}`);
      const data = await response.json();
      setFlag(false);
      Object.entries(data).forEach(async entry => {
        arr.push({name: entry[0], value: entry[1]});
        await setIndicators(arr);
        setFlag(true);
      });
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }  
  };

   /**
   * Executes first time the component is rendered
   * Sets interval to fetch data for the component according to the refresh rate
   */
  useEffect(async () => {
    fetchData(class_session)
    const timeUpdate = setInterval(function(){fetchData(class_session)},  classroom.refreshTime*1000);
    return () => clearInterval(timeUpdate);
  }, []);

  /**
   * Updates width for HorizontalGauge depending on the screen width
   */
  useEffect(() => {
    setWidth(ref.current ? ref.current.offsetWidth : 500);
  }, [ref.current]);

  return (
    <div className='bg-gray-200 rounded h-fit shadow-md'>
      <div className='bg-light-blue px-2 rounded-top'>
        <h3 className='text-white text-semibold py-1'>Distractores</h3>
      </div>  
      <div className='py-4' ref={ref}>  
        {flag  && indicators.map((indicator) => (
          <div className='mb-4 py-3 my-div' key = {indicator.name}>
            <h5 className='my-0 py-0'>{indicator.name}</h5>
            {width && <HorizontalGauge ticks={gaugeTicks} height={80} width = 
            {width} min={0} max={100} value={indicator.value} />}
          </div>
        ))}
      </div>
    </div>
  )
}

export default DistractorsAnalytics;