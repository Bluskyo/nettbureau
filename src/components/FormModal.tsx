
// FormModal.tsx
import InputField from './InputField';
import './FormModal.css'
import { useState, type ChangeEvent, type Dispatch, type SetStateAction } from 'react';
import type React from 'react';

interface SetFormWasSubmitted {
  setFormWasSubmitted: Dispatch<SetStateAction<boolean>>;
}

// forventet format for json filer:
interface Field {
  label: string;
  type: string;
  name: string;
  errorMessage?: string; 
  required?: boolean;
  options?: string[];
  minLength?: string;
  maxLength?: string;
}

interface FormData {
  title: string;
  fields: Field[];
}


export default function FormModal({ setFormWasSubmitted }: SetFormWasSubmitted) {
  const [jsonContent, setJsonContent] = useState<FormData | null>(null);
  const [fileErrorMessage, setFileErrorMessage] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result;

      if (typeof result === "string") {
        try {
          const parsedJson = JSON.parse(result);

          if(validateJson(parsedJson)) {
            setJsonContent(parsedJson);
            setFileErrorMessage("");
          } else {
            setFileErrorMessage('Ugyldig JSON-struktur. Filen må inneholde en "title" (streng) og et "fields" (array av objekter) med gyldige feltdefinisjoner. Se form-property.json');          }
        } catch (err) {
          console.error("Error parsing JSON:", err);
          setFileErrorMessage(".json filen kunne ikke bli lest! Vennligst bruk en annen fil!")
        }
      }

    };

    reader.readAsText(file);
  }

  function validateJson(data: any) {
    // sjekker at json formatet har forventet struktur title og fields
    if (typeof data.title !== "string" || data.title.trim() === "") {
      return false;
    }

    if (!Array.isArray(data.fields)) {
      return false;
    }

    // sjekker etter om fields inneholder et object og nødvending html elementer
    for (const field of data.fields) {
      if (typeof field !== "object" || field === null) {
        return false;
      }

      if (typeof field.label !== "string" || field.label.trim() === "") {
        return false;
      }
      if (typeof field.name !== "string" || field.name.trim() === "") {
        return false;
      }
      if (typeof field.type !== "string" || field.type.trim() === "") {
        return false;
      }

      // sjekk for at select options er en array og har bare strings i arry-en
      if (field.type === "select") {
        if (!Array.isArray(field.options)) {
          return false; 
        }
        if (field.options.some((option: any) => typeof option !== "string")) {
          return false;
        }
      }
    }

    return true;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    console.log("Submitted data:", Object.fromEntries(formData))
    setFormWasSubmitted(true)
  }

  if (jsonContent) {
    return (
      <form onSubmit={handleSubmit} className="window-form">
        <h2>{jsonContent.title}</h2>
        <InputField inputData={jsonContent.fields} />
        <button className="button-form" type="submit">Send inn</button>
      </form>
    )
  }

  return (
    <div className="form-wrapper">
      <div className="window-form">
        <h1>Velg en .json fil som skal bli renderet!</h1>
        <p style={{ color: "#626263" }}>Det er inkludert 3 test filer som kan bli brukt til å teste under <code>src/data</code>.</p>
        <input
          onChange={handleFileChange}
          className={`input-upload-form${fileErrorMessage ? " error-input-upload-form" : ""}`}
          type="file"
          id="form-file"
          name="form-file"
          accept=".json" />
        {fileErrorMessage && <div className="error-message">{fileErrorMessage}</div>}
      </div>
    </div>
  )
}