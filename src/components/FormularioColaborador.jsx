import {useState} from 'react'
import useProyectos from '../hooks/useProyectos'
import Alerta from './Alerta';

const FormularioColaborador = () => {
    const [email,setEmail] = useState('')

    const {mostrarAlerta,alerta,submitColaborador} = useProyectos();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (email === ''){
            mostrarAlerta({
               msg: "El email es obligatorio",
               error: true,
            })
            return
        }
        submitColaborador(email)
    }
    const {msg} = alerta;
  return (


    <form
        className="bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow"
        onSubmit={handleSubmit}
    >
        {msg && <Alerta alerta={alerta}/>}
      <div className="mb-5">
            <label 
                className='text-gray-700 uppercase font-bold text-sm'
                htmlFor='email'
            >
                Email Colaborador
            </label>
            <input 
                type='email'
                id='email'
                placeholder='Email del usuario'
                className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
      </div>
      <input 
            type='submit'
            className='bg-sky-600 font-bold hover:bg-sky-700 p-3 text-white cursor-pointer transition-colors rounded text-sm w-full'
            value='Buscar Colaborador'
      />
    </form>
  )
}

export default FormularioColaborador
