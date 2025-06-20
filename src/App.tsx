import { useState } from 'react'
import './App.css'
import FormModal from './components/FormModal'

function App() {

  const [formWasSubmitted, setFormWasSubmitted] = useState(false)

  if (formWasSubmitted) {
    return (<div className='message'>
      <h1>Skjemaet ditt er sendt inn! 🥳🎉</h1>
    </div>)
  }

  return (
    <>
      <FormModal setFormWasSubmitted={setFormWasSubmitted} />
    </>
  )
}

export default App
