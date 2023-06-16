import {React, useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmileBeam } from '@fortawesome/free-solid-svg-icons';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { faMugHot } from '@fortawesome/free-solid-svg-icons';

/**------------------------------------------------------------------------
 **                           Results
 *?  Renders Results component that includes suggestions for the teacher **PENDING**
 *------------------------------------------------------------------------**/

function Results() {
  const [iconColor, setIconColor] = useState('');
  const [messageColor, setMessageColor] = useState('');
  const [message, setMessage] = useState('');
  const [face, setFace] = useState('');

  const getValue = () => {
    const value = 0.73;
    if(value < 0.20){
      setMessage('¡Acción Requerida!');
      setFace(faTriangleExclamation);
      setIconColor('#f79448');
      setMessageColor('red');
    }else if(value < 0.80){
      setMessage('Tómate un Descanso');
      setFace(faMugHot);
      setIconColor('#78614f');
      setMessageColor('black');
    }else{
      setMessage('¡Buen Trabajo!');
      setFace(faFaceSmileBeam);
      setIconColor('limegreen');
      setMessageColor('black');
    }
  }

  useEffect(() => {
    getValue();
  }, []) 

  return (
    <div className='bg-gray-200 rounded h-fit shadow-md'>
      <div className='bg-light-blue px-2 rounded-top'>
        <h3 className='text-white text-semibold py-1'>Resultados</h3>
      </div>      
      <div className='flex flex-col px-4 justify-items-center'>
        <FontAwesomeIcon icon = { face } size = '9x' className='my-3' color = {iconColor} />
        <h4 className='text-center mb-3 font-bold text-4xl' style={{'color': messageColor}}>{message}</h4>
      </div>
      
    </div>
  )
}

export default Results