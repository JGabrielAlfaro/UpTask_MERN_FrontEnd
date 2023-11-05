
import { useState,useEffect, useRef } from "react";
import {Link,useParams} from 'react-router-dom'
import clienteAxios from "../config/clienteAxios";
import Alerta from '../components/Alerta'

const NuevoPassword = () => {

  const [password,setPassword] = useState('')
  const [passwordModficado,setPasswordModificado] = useState(false)
  const [tokenValido, setTokenValido] = useState(false)
  const [alerta,setAlerta] = useState({})
  const params = useParams()
  const {token} = params;


  const firtMount = useRef(true);

  useEffect( () =>{
    const comprobarToken = async () => {
      try {

       await clienteAxios.get(`/usuarios/olvide-password/${token}`)
        setTokenValido(true)
      } catch (error) {
   
        setAlerta({
          msg: error.response.data.msg,
          error: true,
        })

      }
    }

    if (firtMount.current){
      comprobarToken();
      firtMount.current = false
    }

    
  },[])
 
  const {msg} = alerta;

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (password.length < 6){
      setAlerta({
        msg: "El password debe ser minimo de 6 caracteres",
        error: true
      })
      return;
    }

    try {
     
      const url = `/usuarios/olvide-password/${token}`
      const {data} = await clienteAxios.post(url,{password})

      setAlerta({
        msg: data.msg,
        error: false,
      })
      setPasswordModificado(true)
      setPassword('')
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error:false,
      })
    }
  }

  return (
    <>
        <h1 className="text-sky-600 font-black text-6xl capitalize">Restablece tu password y no pierdas acceso a tus {' '} 
            <span className="text-slate-700">proyectos</span>
        </h1>
    
        { msg && <Alerta alerta={alerta}/> }

        {tokenValido && (
          <form 
              className="my-10 bg-white shadow rounded-lg p-10"
              onSubmit={handleSubmit}
          >

              <div className="my-5">
                    <label htmlFor="password" className="uppercase text-gray-600 block text-xl font-bold">Nuevo Password</label>
                    <input
                      id="password"
                      type="password"
                      placeholder="Escribe tu nuevo password"
                      className="w-full mt-3 p-3 border rounded-lg bg-gray-50"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
              </div>

              <input 
                type="submit" 
                className="bg-sky-700 w-full mb-5 py-3 text-white font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors" 
                value="Guardar nuevo password" 
              />
          </form>
        )}

          {passwordModficado && (
            <Link
                className="block text-center my-5 text-slate-500 uppercase text-sm"
                to="/"
            >
                Inicia Sesión
            </Link>
          )}
    </>
  )
}

export default NuevoPassword
