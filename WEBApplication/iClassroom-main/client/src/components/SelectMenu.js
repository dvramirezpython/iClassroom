import { text } from "@fortawesome/fontawesome-svg-core";
import React from "react";
import { useState, useEffect} from "react";

export const SelectMenu = ({ selectMenuChange, selectMenu }) => {
  const [menuState, setMenuState] = useState("");

  useEffect(()=>{
    selectMenuChange(menuState)
  }, [menuState])

  const handleChange = (event) => {

    const newValue = event.target.value;

    setMenuState(newValue);

  };

  const { label_text, options, name, id } = selectMenu;
  return (
    <>
      <div className="flex flex-row justify-center">
        <label className="px-3 mt-2 w-1/6 left-0" htmlFor="userType">
          {label_text}:
        </label>
        <select
          value={menuState}
          onChange={handleChange}
          name={name}
          className="w-1/2 rounded"
          id={id}
        >
          <option>Seleccione una opción</option>
          {options.map((text_option) => {
            return (
              <option name={text_option} value={text_option}>
                {text_option}
              </option>
            );
          })}
        </select>
      </div>
    </>
  );
};
