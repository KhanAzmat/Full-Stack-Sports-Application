import React from "react";

const Input = (props) => {
  return (
    <input
      type={props.type}
      placeholder={props.placeholder}
      onChange={props.onChange}
      readOnly={props.readOnly}
      value={props.value}
      name={props.name}
      className={props.className}
      required={props.required}
      autoFocus={props.autoFocus}
      checked={props.checked}
      id={props.id}
    />
  );
};

export default Input;
