
import { useEffect,useRef,useState } from "react";
import {useParams,Link} from 'react-router-dom'
import clienteAxios from "../config/clienteAxios";
import Alerta from '../components/Alerta'

const ConfirmarCuenta = () => {

  const [alerta,setAlerta] = useState({})
  const [cuentaConfirmada,setCuentaConfirmada] = useState(false)
  const params = useParams();
  const {token:id} =params;

  const firtMount = useRef(true)
  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const url = `/usuarios/confirmar/${id}`;
        const { data } = await clienteAxios.get(url);
  
        setAlerta({
          msg: data.msg,
          error: false,
        });
        setCuentaConfirmada(true);
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true,
        });
      }
    };
  
    if (firtMount.current){
      setCuentaConfirmada(true);
      firtMount.current = false
    }
  }, []); // Elimina cuentaConfirmada de las dependencias

  
  
  
  
  
  

  const {msg} = alerta;
  return (
    <>
        <h1 className="text-sky-600 font-black text-6xl capitalize">Confirma tu cuenta y comienza a crear tus {' '} 
            <span className="text-slate-700">proyectos</span>
        </h1>
        <div className="mt-20 md:mt-5 shadow-lg px-5 rounded-xl py-10 bg-white">
          { msg && <Alerta alerta={alerta}/>}
          {cuentaConfirmada && (
            <Link
                className="block text-center my-5 text-slate-500 uppercase text-sm"
                to="/"
            >
                Inicia Sesión
            </Link>
          )}
        </div>
    </>
  )
}

export default ConfirmarCuenta
