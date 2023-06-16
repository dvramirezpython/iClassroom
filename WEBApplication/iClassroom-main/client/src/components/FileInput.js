import React from "react";

export const FileInput = ({ file }) => {
  const { label_text, name, id } = file;
  return (
    <>
      <div className="flex flex-row justify-center">
        <label className="px-3 mt-2 w-1/6 left-0" htmlFor="FotoF">
          {label_text}:
        </label>
        <input name={name} className="w-1/2 rounded" type="file" id={id} accept="image/*" />
      </div>
    </>
  );
};
