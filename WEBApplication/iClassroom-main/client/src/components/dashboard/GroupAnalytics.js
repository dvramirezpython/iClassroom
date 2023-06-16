import {React, useState, useEffect} from 'react';
import ReactSpeedometer from "react-d3-speedometer";
const host = process.env.REACT_APP_API_ENDPOINT;

/**------------------------------------------------------------------------
 **                           GroupAnalytics
 *?  Renders GroupAnalytics component that includes four accelerometer for the four indicator groups 
 *------------------------------------------------------------------------**/

function GroupAnalytics({classroom, class_session}) {
  const [engagement, setEngagement] = useState(23);
  const [distractors, setDistractors] = useState(50);
  const [attention, setAttention] = useState(10);
  const [interaction, setInteraction] = useState(65);
  
  const endpoint = host + `/indicator_log/get_temp_group/${class_session}`;


  /**
   * Call to endpoint to fetch dummy data
   */
  const fetch_data = async()=>{
    const response = await fetch(endpoint, {
      method: "GET",
    });

    if (response.status != 200) {
      alert("Server error, something went wrong!");
    } else {
      const data = await response.json();

      const engagement = Math.ceil(data.Engagement);
      const attention = Math.ceil(data.Attention);
      const interaction = Math.ceil(data.Interaction);
      const distractions = Math.ceil(data.Distractions);

      setEngagement(engagement);
      setDistractors(distractions);
      setAttention(attention);
      setInteraction(interaction);
    }
  }

   /**
   * Executes first time the component is rendered
   * Sets interval to fetch data for the component according to the refresh rate
   */
  useEffect(async()=>{
    const timeUpdate = setInterval(fetch_data, classroom.refreshTime*1000);
    return () => clearInterval(timeUpdate);
  },[])

  return (
    <div className='bg-gray-200 rounded h-fit shadow-md'>
      <div className='bg-light-blue px-2 rounded-top'>
        <h3 className='text-white text-semibold py-1'>Análisis Grupal</h3>
      </div>      
      <div className='medidores flex flex-col md:flex-row justify-between px-4' style={{overflow: 'scroll'}}>
        <div className='text-center items-center'>
          <h5 className='font-bold my-3'>Engagement</h5>
          <h4 className='font-bold'>{engagement}%</h4>
          <ReactSpeedometer
            value={engagement}
            width={300}
            height={200}
            minValue={0}
            maxValue={100}
          />
        </div>
        <div className='text-center'>
          <h5 className='font-bold my-3'>Distractores</h5>
          <h4 className='font-bold'>{distractors}%</h4>
          <ReactSpeedometer  
            value={distractors}
            width={300}
            height={200}
            minValue={0}
            maxValue={100}
          />
        </div>
        <div className='text-center'>
          <h5 className='font-bold my-3'>Atención</h5>
          <h4 className='font-bold'>{attention}%</h4>
          <ReactSpeedometer   
            value={attention}
            width={300}
            height={200}
            minValue={0}
            maxValue={100}
          />
        </div>
        <div className='text-center'>
          <h5 className='font-bold my-3'>Interacción</h5>
          <h4 className='font-bold'>{interaction}%</h4>
          <ReactSpeedometer   
            value={interaction}
            width={300}
            height={200}
            minValue={0}
            maxValue={100}
          />
        </div>
      </div>

    </div>
  )
}

export default GroupAnalytics