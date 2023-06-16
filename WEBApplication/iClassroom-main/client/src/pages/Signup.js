import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { TextLabel } from "../components/TextLabel";
import { SelectMenu } from "../components/SelectMenu";
import { FileInput } from "../components/FileInput";
import logo from "../assets/logo-tec.png";
const host = process.env.REACT_APP_API_ENDPOINT;


/**------------------------------------------------------------------------
 **                           SignupForm
 *?  Renders sign up form to create new account in the system
 *------------------------------------------------------------------------**/


const SignupForm = () => {
  const navigate = useNavigate();

  const [progress, setProgress] = useState(0); //audio's recording progress

  const [isVisible, setIsVisible] = useState(false); 

  const [mensaje, setMensaje] = useState("Grabando");

  const [audioBlob, setAudioBlob] = useState("");

  const [tuition, setTuition] = useState('');

  const [showTuition, setShowTuition] = useState('');

  const [userTypeMenu, setUserTypeMenu] = useState("");

  const [schoolMenu, setSchoolMenu] = useState("holas");

  const [schools, setSchools] = useState([]);

  const [schoolMenuVisible, setschoolMenuVisible] = useState(false);

  const MAX_LENGTH = 50;

  useEffect(() => {
    const fetchSchools = async () => { //Calls endpoint to fetch schools to show in dropdown menu 
      const school_get_endpoint = host + "/schools";

      try {
        const response = await fetch(school_get_endpoint, {
          method: "GET",
        });

        if (response.status != 200) {
          const error = await response.json();
          alert(error["error"]);
        } else {
          const fetched_schools = await response.json();
          setSchools(fetched_schools); //set schools state with the schools fetched
        }
      } catch (error) {
        alert(error);
      }
    };

    fetchSchools(); //fetches school for dropdown menu
  }, []);


  //executes every time users chooses/changes the account type to be created
  useEffect(() => {
    if (userTypeMenu == "Profesor" || userTypeMenu == "Alumno") { //shows schools dropdown if account is of a teacher or student
      setschoolMenuVisible(true);
    } else {
      setschoolMenuVisible(false);
    }
    if(userTypeMenu == "Alumno"){ //shows field to input tuition if account is of a student
      setShowTuition(true);
    }else{
      setShowTuition(false);
    }
  }, [userTypeMenu]);


  //update account type to be created
  const changeSelectMenuOption = (newValue) => {
    setUserTypeMenu(newValue);
  };

  //Basic input validation, not so small values for name, last_name or email
  const validateForm = (formValues) => {
    const { name, last_name, email } = formValues;
    if (
      name.length > MAX_LENGTH ||
      last_name.length > MAX_LENGTH ||
      email.length > MAX_LENGTH
    ) {
      return (
        "Los campos 'Nombre', 'Apellido' y 'Correo Institucional' no deben superar los " +
        MAX_LENGTH +
        " caracteres."
      );
    }
    return null;
  };

  //executes once the user click on "Create account"
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkboxRef.current.checked) {
      alert(`Acepte los términos de privacidad`);
      return; //makes sure users accepted terms and conditions before creating account
    }

    //gets user's inputs
    const formData = new FormData(formRef.current);

    for (const [name, value] of formData) {
      if (typeof value == "string" && name != "school")
        formData.set(name, value.toLocaleLowerCase());
    }

    //if uses is student get tuition
    if (formData.get("user_type") == "alumno") {
      formData.append("tuition", tuition);
    }

    //update user type from spanish to english (to work with backend)
    if (formData.get("user_type") == "profesor") {
      formData.set("user_type", "teacher");
    }else if(formData.get("user_type") == "alumno"){
      formData.set("user_type", "student")
    }


    //Uppercase name and last_name correctly
    const name = formData.get("name");
    const last_name = formData.get("last_name");
    formData.set("name", name.charAt(0).toUpperCase() + name.slice(1));
    formData.set("last_name", last_name.charAt(0).toUpperCase() + last_name.slice(1));



    formData.append("voice_register_url", audioBlob);
    const formValues = Object.fromEntries(formData.entries());

    //show alert if any input is empty 
    for (const key in formValues) {
      if (formValues[key] === "") {
        alert("Por favor, complete todos los campos.");
        return;
      }
    }

    //validate email format
    const validemail = formValues["email"];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(validemail)) {
      alert("Dirección de correo inválida"); //show alert if email is not valid
      return;
    }

    const errorMessage = validateForm(formValues);
    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    /**
     * Call to endpoint to create account
     */
    try {
      const endpoint = host + "/user/add";
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (response.status != 200) {
        const error = await response.json();
        alert(error["message"]); //show error message if account couldn't be created
      } else {
        navigate("/login"); //if account created successfully redirect to login 
      }
    } catch (error) {
      alert(error);
    }
  };

  /**
   * Updates progess bar's progess when recording audio
   */
  const startProgressBar = async () => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress === 100) {
          setMensaje("Listo");
          clearInterval(interval);
          return 100;
        } else {
          return prevProgress + 20;
        }
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  };

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        startProgressBar();
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const recorder = new MediaRecorder(stream);

        const chunks = [];
        recorder.ondataavailable = (event) => chunks.push(event.data);
        recorder.onstop = () => {
          const audioBlob = new Blob(chunks, {
            type: "audio/ogg; codecs=opus",
          });
          const audioFile = new File([audioBlob], "audio.ogg", {
            type: "audio/ogg",
          });
          setAudioBlob(audioFile);
        };

        recorder.start();
        setTimeout(() => recorder.stop(), 6000); // Stop recording after 5 seconds
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const textLabels = [
    {
      name: "name",
      text: "Nombre",
      type: "text",
      required: true,
    },
    {
      name: "last_name",
      text: "Apellido",
      type: "text",
      required: true,
    },
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

  const selectMenu = [
    {
      label_text: "Tipo de usuario",
      name: "user_type",
      options: ["Profesor", "Alumno", "Admin", "Supervisor"],
    },
  ];

  const photo_files = [
    {
      label_text: "Foto de frente",
      name: "front_photo_url",
    },
    {
      label_text: "Foto de izquierda",
      name: "left_photo_url",
    },
    {
      label_text: "Foto de derecha",
      name: "right_photo_url",
    },
  ];

  const formRef = useRef(null);
  const checkboxRef = useRef(null);

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-4 py-6 px-8 w-10/12 mx-auto rounded-lg shadow-lg bg-blue-50">
          <div className="logo-container w-26 h-16 mb-4">
            <img src={logo} className="w-26 h-16" />
          </div>
          {textLabels.map((label, index) => {
            return <TextLabel label={{ ...label, id: index }} />;
          })}

          {selectMenu.map((menu, index) => {
            return (
              <SelectMenu
                selectMenuChange={changeSelectMenuOption}
                selectMenu={{ ...menu, id: index }}
              />
            );
          })}


          {showTuition && <div className="flex flex-row justify-center">
              <label className="px-3 mt-2 w-1/6 left-0" htmlFor="userType">
                Matrícula:
              </label>
              <input type = "text" className="w-1/2 rounded" onChange={(e) => setTuition(e.target.value)}></input>
          </div>}

          {schoolMenuVisible && (
            <div className="flex flex-row justify-center">
              <label className="px-3 mt-2 w-1/6 left-0" htmlFor="userType">
                Escuela:
              </label>
              <select
                value={schoolMenu}
                name="school"
                className="w-1/2 rounded"
                onChange={(event) => setSchoolMenu(event.target.value)}
              >
                <option>Seleccione una opcion </option>
                {schools.map((school) => {
                  return (
                    <option name={school.name} value={school._id}>
                      {school.name}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {photo_files.map((file, index) => {
            return <FileInput file={{ ...file, id: index }} />;
          })}
          <div className="flex flex-row justify-center">
            <label className="px-3 mt-2 w-1/6 left-0"> Audio: </label>
            <button
              type="button"
              className="h-10 bg-light-blue text-white text-xl font-bold hover:bg-dark-blue rounded w-1/6"
              onClick={startRecording}
            >
              Grabar
            </button>
            <div className="w-1/3"></div>
          </div>
          <div
            className="w-5 h-6 bg-light-blue rounded truncate"
            style={{
              display: isVisible ? "inline" : "none",
              width: `${progress}%`,
            }}
          >
            <div className="h-full bg-dark-blue text-white flex items-center justify-center transition-width duration-200 ease-in-out">
              {mensaje}!
            </div>
          </div>
          <div className="flex justify-center">
            <input
              className="mr-2"
              type="checkbox"
              id="checkbox"
              defaultChecked={false}
              ref={checkboxRef}
            />
            <label htmlFor="checkbox" className="text-black-500 font-bold">
    Acepto los{' '}
    <a href="" target="_blank" rel="noopener noreferrer">
      términos y privacidad
    </a>{' '}
  </label>
          </div>
          <div className="flex flex-row justify-center mt-5">
            <button
              className="h-10 bg-light-blue text-white text-xl font-bold hover:bg-dark-blue rounded w-1/6"
              type="submit"
            >
              Registrarse
            </button>
          </div>
          <div className="flex flex-row justify-center mt-5">

          <button className="h-10 bg-light-blue text-white text-xl font-bold hover:bg-dark-blue rounded w-1/6" onClick={()=>navigate("/login")}>Log in</button>
          </div>
        </div>
      </form>
    </>
  );
};

export default SignupForm;
