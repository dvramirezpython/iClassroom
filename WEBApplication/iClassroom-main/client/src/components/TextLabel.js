import React from "react";

export const TextLabel = ({label}) => {
  const {name, text, type, id} = label
  return (
    <>
      <div className="flex flex-row justify-center">
        <label className="px-3 mt-2 w-1/6 left-0" htmlFor={name}>{text}:</label>
        <input name={name}className="w-1/2 rounded" type={type} id={id}/>
      </div>
    </>
  );
};
