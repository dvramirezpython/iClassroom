import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

/**------------------------------------------------------------------------
 **                           IndividualAnalytics
 *?  Renders IndividualAnalytics component, that includes a circle per student in color depending on its analytics
 *------------------------------------------------------------------------**/
function IndividualAnalytics({classroom, class_session}) {
  const [values, setValues] = useState([]);
  const {state} = useLocation();


  /** 
   * Function to set each student's circle's color depending of value 
   */
  const calculateColor = (value) => {
    const green = Math.round((value / 100) * 255);
    const red = Math.round((1 - value / 100) * 255);
    return `rgb(${red},${green},0)`;
  };

  /**
   * Call to endpoint to fetch dummy data
   */
  const fetchData = async (class_session_id) => {
    console.log("Fetching Data");

    try {
      const response = await fetch(`http://localhost:5000/indicator_log/get_temp_individual/${class_session_id}`);
      const data = await response.json();
      const values = Object.values(data);
      setValues(values);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
    
  };

  /**
   * Executes first time the component is rendered
   * Sets interval to fetch data for the component according to the refresh rate
   */
  useEffect(async () => {
    fetchData(class_session);
    const timeUpdate = setInterval(function(){fetchData(class_session)}, classroom.refreshTime*1000);
    return () => clearInterval(timeUpdate);
  }, []);

  const rows = [];
  const rowSize = 3;

  for (let i = 0; i < values.length; i += rowSize) {
    const row = values.slice(i, i + rowSize);
    rows.push(row);
  }

  return (
    <div className='bg-gray-200 rounded h-fit shadow-md'>
      <div className='bg-light-blue px-2 rounded-top'>
        <h3 className='text-white text-semibold py-1'>Análisis Individual</h3>
      </div>      
      {rows.map((row, rowIndex) => (
        <div className="flex justify-center py-4" key={rowIndex}>
          {row.map((value, index) => (
            <div
              key={index}
              style={{
                height: '100px',
                width: '100px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: calculateColor(value),
                borderRadius: '50%',
                marginRight: '10px'
              }}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default IndividualAnalytics;