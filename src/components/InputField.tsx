// InputField.tsx
import React, { useState, type ChangeEvent } from "react";

interface InputFieldProps {
  inputData: {
    name: string;
    label: string;
    type: string;
    required?: boolean;
    options?: string[];
    errorMessage?: string; // Add errorMessage to the type
    [key: string]: any;
  }[];
}

const InputField: React.FC<InputFieldProps> = ({ inputData }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focused, setfocused] = useState<Record<string, boolean>>({});

  const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setfocused((prevfocused) => ({ ...prevfocused, [name]: true }));
    validateField(name, value, e.target.type);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (focused[name]) {
      validateField(name, value, e.target.type);
    }
  };

  const validateField = (name: string, value: string, type: string) => {
    const fieldConfig = inputData.find(field => field.name === name);
    
    if (!fieldConfig) return;

    let errorMessage = "";

    if (fieldConfig.required && !value.trim()) {
      errorMessage = "Dette feltet er påkrevd."; 
    } else if (type === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
      errorMessage = fieldConfig.errorMessage || "Vennligst skriv inn en gyldig e-postadresse.";
    }

    if (type === "text" || type === "textarea") {
      if (fieldConfig.minLength && value.length < Number(fieldConfig.minLength)) {
        errorMessage = `Krever minst ${fieldConfig.minLength} tegn.`;
      }
      if (fieldConfig.maxLength && value.length > Number(fieldConfig.maxLength)) {
        errorMessage = `Kan ikke overstige ${fieldConfig.maxLength} tegn.`;
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  };


  return (
    <>
      {inputData.map((inputProps, index) => {
        const { name, label, type, required, options, errorMessage: customErrorMessage, ...rest } = inputProps;
        const hasError = focused[name] && errors[name];

        return (
          <div className="field-form" key={index}>
            <label htmlFor={name} className="input-label">
              {label}{required === true ? <span style={{ color: "red" }}> *</span> : ""}
            </label>

            {type === "select" ? (
              <select
                id={name}
                name={name}
                required={required === true}
                className="select-form"
                onBlur={handleBlur}
                onChange={handleChange}
              >
                <option value="">Velg...</option>
                {Array.isArray(options) &&
                  options.map((option, optIndex) => (
                    <option key={optIndex} value={option}>{option}</option>
                  ))}
              </select>
            ) : type === "textarea" ? (
              <textarea
                id={name}
                name={name}
                required={required === true}
                className="input-text-area"
                onBlur={handleBlur}
                onChange={handleChange}
                {...rest}
              />
            ) : (
              <input
                id={name}
                name={name}
                type={type}
                required={required === true}
                className="input-form"
                onBlur={handleBlur}
                onChange={handleChange}
                {...rest}
              />
            )}
            {hasError && <div className="error-message">{errors[name]}</div>}
          </div>
        );
      })}
    </>
  );
};

export default InputField;