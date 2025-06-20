import React from "react";

interface InputFieldProps {
  inputData: {
    name: string;
    label: string;
    type: string;
    required?: boolean;
    options?: string[];
    [key: string]: any;
  }[];
}

const InputField: React.FC<InputFieldProps> = ({ inputData }) => {

  return (
    <>
      {inputData.map((inputProps, index) => {
        const { name, label, type, required, options, ...rest } = inputProps;

        return (
          <div className="field-form" key={index}>
            <label htmlFor={name} className="input-label">
              {label}{required === true ? <span style={{color:"red"}}> *</span>:""}
            </label>

            {type === "select" ? (
              <select
                id={name}
                name={name}
                required={required === true}
                className="select-form"
              >
                <option value="">Velg...</option>
                {Array.isArray(options) &&
                  options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
              </select>
            ) : type === "textarea" ? (
                <textarea
                id={name}
                name={name}
                required={required === true}
                className="input-text-area"
                {...rest}
              />
            ) : (
                <input
                id={name}
                name={name}
                type={type}
                required={required === true}
                className="input-form"
                {...rest}
              />
            )}

          </div>
        );
      })}
    </>
  );
};

export default InputField;

