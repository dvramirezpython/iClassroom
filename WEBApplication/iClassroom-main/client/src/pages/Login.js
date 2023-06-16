import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { TextLabel } from "../components/TextLabel";
import axios from "axios";
import logo from "../assets/logo-tec.png";
const api_endpoint = process.env.REACT_APP_API_ENDPOINT;


/**------------------------------------------------------------------------
 **                           LoginForm
 *?  Renders login form to sign in into the dashboard of either admin or teacher
 *------------------------------------------------------------------------**/

const LoginForm = () => {

  const navigate = useNavigate()
  const [showMessageNotApproved, setShowMessageNotApproved] = useState(false); //if true show message of account not approved
  const [showMessageNoAccount, setShowMessageNoAccount] = useState(false); //if true show message of account doesn't exist

  const handleSubmit = async (e) => {
    e.preventDefault();

    //get data from forms (user's input)
    const formData = new FormData(formRef.current)


    for (const [name, value] of formData) {
      if (typeof value == "string") formData.set(name, value.toLowerCase());
    }

    const query_params = new URLSearchParams(formData).toString()

    //call endpoint to login, send email and password
    const options = {
      method: 'GET',
      url: `${api_endpoint}/login?${query_params}`,
    };
  
    axios.request(options).then(function (response) {
      if(response.data.__t == 'Teacher'){
        if(response.data.activated != true){  
          setShowMessageNotApproved(true); //account not approved
        }else {
          navigate("/myclasses", {state: {teacher: response.data}}); //redirect to teacher dashboard
        }
      }else if(response.data.__t == 'Administrator'){
        if(response.data.activated != true){ 
          setShowMessageNotApproved(true); //account not approved
        }else {
          navigate("/admin", {state: {admin: response.data}}); //redirect to admin dashboard
        }
      }else if(response.data.__t == 'Student'){
        if(response.data.activated != true){
          setShowMessageNotApproved(true); //account not approved
        }else { 
          //!TODO create student dashboard 
        }
      }
    }).catch(function (error) { //account doesn't exist or credentials are wrong
      setShowMessageNoAccount(true);
    });
  };


  //Text labels used in the forms
  const textLabels = [
    {
      name: "email",
      text: "Correo Institucional",
      type: "text",
      required: true,
    },
    {
      name: "password",
      text: "Contraseña",
      type: "password",
      required: true,
    },
  ];


  const formRef = useRef(null);


  return (
    <>
    <form ref={formRef} onSubmit={handleSubmit}>
    <div className="container mx-auto flex flex-col justify-evenly mt-5">
    {/* Logo y título */}
    <div className="text-center m-5 pt-10">
      <h1 className="text-black-500 font-bold text-4xl">¡Classroom</h1>
    </div>

    {/* Formulario */}
    <div className="flex flex-col space-y-4 py-20 px-8 w-10/12 mx-auto rounded-lg shadow-lg bg-blue-50">
      <div className="logo-container w-26 h-16 mb-4 mx-auto">
        <img src={logo} className="w-26 h-16" alt="logo" />
      </div>

      {/* Inputs */}
      {textLabels.map((label, index) => (
        <TextLabel key={index} label={{ ...label, id: index }} />
      ))}

      {/* Botones */}
      <div className="flex flex-row justify-center mt-10 space-x-4">
        <button className="h-10 bg-light-blue text-white text-xl font-bold hover:bg-dark-blue rounded w-1/6" type="submit">
          Iniciar sesión
        </button>
        </div>
        <div className="flex flex-row justify-center mt-10 space-x-4">
        <button className="h-10 bg-light-blue text-white text-xl font-bold hover:bg-dark-blue rounded w-1/6" type="button" onClick={()=> navigate("/signup")}>
          Registrarse
        </button>
      </div>
      {showMessageNotApproved && <h5 className="text-red-400 text-center">Su cuenta no ha sido aprobada. Espere a que una administrador la apruebe o pongase en contacto con uno.</h5>}
      {showMessageNoAccount && <h5 className="text-red-400 text-center">Cuenta no existe o contraseña no coincide.</h5>}
    </div>
  </div>
</form>
</>
  );
};

export default LoginForm;
