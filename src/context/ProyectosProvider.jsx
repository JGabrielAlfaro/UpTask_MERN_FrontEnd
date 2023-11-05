import { useState, useEffect, createContext } from "react"
import clienteAxios from "../config/clienteAxios"
import {useNavigate} from 'react-router-dom'
import useAuth from "../hooks/useAuth"
import io from 'socket.io-client'
let socket;

const ProyectosContext = createContext();

const ProyectosProvider = ({children}) => {

    const [proyectos, setProyectos] = useState([]);
    const [alerta, setAlerta] = useState({});
    const [proyecto, setProyecto] = useState({});
    const [cargando, setCargando] = useState(false);
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
    const [tarea,setTarea] = useState({})
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false);
    const [colaborador,setColaborador] = useState({})
    const [modalEliminarColaborador,setModalEliminarColaborador] = useState(false)
    const [buscador,setBuscador] = useState(false)

    const navigate = useNavigate();
    const {auth}= useAuth();
    
    useEffect(()=>{
        const obtenerProyecto = async () => {
           try {
                    
                    const token = localStorage.getItem('token')
                    if (!token)return
                    const config = {
                        headers: {
                            "Content-type": "application/json",
                            Authorization: `Bearer ${token}`
                        }
                    }
                    const {data} = await clienteAxios.get('/proyectos',config)
                    setProyectos(data)
           } catch (error) {
                console.log(error)
           } 
        }
        obtenerProyecto();
    },[auth])

    //Abrimo la conexión
    useEffect(()=>{
        socket = io(import.meta.env.VITE_BACKEND_URL)

    },[])

    //A la escucha
    useEffect(()=>{
       socket.on('tarea agregada',(tareaNueva)=>{
            console.log(tareaNueva)
       })

    })


    const mostrarAlerta = (alerta) => {
        setAlerta(alerta)

        setTimeout(()=>{
            setAlerta({})
        },5000)
    }

    const submitProyecto = async (proyecto) => {
        //Si id es null, es nuevo, caso contrario es editar.
        if (proyecto.id){
            await editarProyecto(proyecto)
        }else{
            await nuevoProyecto(proyecto);
        }
       

    }

    const editarProyecto = async(proyecto)=>{
        try {
            const token = localStorage.getItem('token')
            if (!token)return
 
            const config = {
                 headers: {
                     "Content-type": "application/json",
                     Authorization: `Bearer ${token}`
                 }
            }
            const {data} = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto,config)
            // console.log(data)
 
            // Sincronizar el state
            const proyectosActualizados = proyectos.map( p => p._id === data._id ? data : p )
            // console.log(proyectosActualizados)
            setProyectos(proyectosActualizados)
            

            setAlerta({
                msg: "Proyecto actualizado correctamente",
                error: false
              })

              setTimeout(()=>{
               setAlerta({})
               navigate('/proyectos')
              },3000)


         } catch (error) {
             console.log(error)
         }

    }

    const nuevoProyecto = async(proyecto)=>{
        
        try {
            const token = localStorage.getItem('token')
            if (!token)return
 
            const config = {
                 headers: {
                     "Content-type": "application/json",
                     Authorization: `Bearer ${token}`
                 }
            }
            delete proyecto?.id //elimine el campo null y no retorne el valor en null de base de datos.
            const {data} = await clienteAxios.post('/proyectos', proyecto,config)
            //  console.log(data)
            setProyectos( [...proyectos,data] ) // es como si estuvieramos consultando de nuevo a la base de datos.
            // console.log(proyectos)

            setAlerta({
              msg: "Proyecto creado correctamente",
              error: false
            })
 
            setTimeout(()=>{
             setAlerta({})
             navigate('/proyectos')
            },3000)

         } catch (error) {
             console.log(error)
         }

    }

    const obtenerProyecto = async (id) => {

      setCargando(true)
       try {
            const token = localStorage.getItem('token')
            if (!token)return

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.get(`/proyectos/${id}`,config)
            setProyecto(data)
            setAlerta({})
       } catch (error) {
          navigate('/proyectos')
          setAlerta({
            msg: error.response.data.msg,
            error:true
          })
          limpiarAlerta(3000)
       }finally{
            setCargando(false)
       }
       
    }

    const eliminarProyecto = async (id) => {
        try {
            const token = localStorage.getItem('token')
            if (!token)return

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.delete(`/proyectos/${id}`,config)
            //  console.log(data,{id})
            //Sincronizar el state.
            const proyectosActualizados = proyectos.filter( p => p._id !== id)
            //  console.log(proyectosActualizados)

             setProyectos(proyectosActualizados)

            setAlerta({
                msg: data.msg,
                error:false
            })

            setTimeout(()=>{
                setAlerta({})
                navigate('/proyectos')
               },3000)

        } catch (error) {
            console.log(error)
        }
    }

    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})
    }

    const submitTarea = async (tarea) => {

          if (tarea?.id){
             await editarTarea(tarea);
          }else {
            delete tarea.id;
            await crearTarea(tarea);
          }

    }

    const crearTarea = async (tarea) => {
        try {
            const token = localStorage.getItem('token')
            if (!token)return

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post('/tareas/',tarea, config)

            setAlerta({})
            setModalFormularioTarea(false)

            //SOCKET IO
            socket.emit('nueva tarea',data)


          } catch (error) {
            console.log(error)
          }
    }
    const editarTarea = async (tarea) => {
        try {
            const token = localStorage.getItem('token')
            if (!token)return

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.put(`/tareas/${tarea.id}`,tarea, config)

            setAlerta({})
            setModalFormularioTarea(false)

            //SOCKET IO
            socket.emit('actualizar tarea',data)
           
          } catch (error) {
            console.log(error)
          }
    }

    const handelModalEditarTarea = tarea => {
        setTarea(tarea)
        setModalFormularioTarea(true)
    }

    const handleModalEliminarTarea = (tarea) => {
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea)

    }

    const eliminarTarea = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token)return

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
            setAlerta({
                msg: data.msg,
                error: false,
            })

            setModalEliminarTarea(false)
            
            //SOCKET IO
            socket.emit("eliminar tarea", tarea)

            // const proyectoActualizado ={...proyecto}
            // proyectoActualizado.tareas = proyectoActualizado.tareas.filter(ts => ts._id !== tarea._id)
            // setProyecto(proyectoActualizado)

            setTarea({})
            limpiarAlerta(3000)
        } catch (error) {
            console.log(error)
        }
    }

    const limpiarAlerta = (segundos) =>{
        setTimeout(()=>{
            setAlerta({})
           },segundos)
    }

    const submitColaborador = async email =>{
       setCargando(true)
       try {
            const token = localStorage.getItem('token')
            if (!token)return

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post('/proyectos/colaboradores', {email}, config)
            // console.log(data)
            setColaborador(data)
            setAlerta({})
       } catch (error) {
         setAlerta({
            msg: error.response.data.msg,
            error:true

         })
         limpiarAlerta(3000)
       }finally{
        setCargando(false)
       }
    }

    const agregarColaborador = async (email) => {
        try {
            const token = localStorage.getItem('token')
            if (!token)return

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            //Ya venia como objeto email, así que le quitamos {email} y lo pasamos como email
            const {data} = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)
            // console.log(data)
            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})

            limpiarAlerta(3000)

        } catch (error) {
           setAlerta({
            msg: error.response.data.msg,
            error:true
           })

           limpiarAlerta(3000)
        }
    }

    const handleModalEliminarColaborador = (colaborador) => {
        setModalEliminarColaborador(!modalEliminarColaborador)
        setColaborador(colaborador)
    }

    const eliminarColaborador = async() =>{
        try {
            const token = localStorage.getItem('token')
            if (!token)return

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            //Ya venia como objeto email, así que le quitamos {email} y lo pasamos como email
            const {data} = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, {id:colaborador._id}, config)

            const proyectoActualizado = {...proyecto}
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter (c =>c._id !== colaborador._id)
            setProyecto(proyectoActualizado)
            setAlerta({
                msg: data.msg,
                error: false,
            })
            
            setColaborador({})
            setModalEliminarColaborador(false)
            limpiarAlerta(3000)

        } catch (error) {
            console.log(error.response)
        }
    }

    const completarTarea = async (id) => {
        try {
            const token = localStorage.getItem('token')
            if (!token)return

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            
            const {data} = await clienteAxios.post(`/tareas/estado/${id}`,{}, config)
            // console.log(data)
            // const proyectoActualizado = {...proyecto}
            // proyectoActualizado.tareas = proyectoActualizado.tareas.map(t => t._id === data._id ? data : t)
            // setProyecto(proyectoActualizado)
            setTarea({})
            setAlerta({})

            //SOCKET IO
            socket.emit('cambiar estado',data)

        } catch (error) {
           console.log(error.response) 
        }
    }

    const handleBuscador = () => {
        setBuscador(!buscador)
        // setProyecto({})
    }

    //Socket io
    const submitTareasProyecto = (tarea) => {
         //Agrega tarea al state
         const proyectoActualizado = {...proyecto}
         proyectoActualizado.tareas = [...proyectoActualizado.tareas,tarea]
         setProyecto(proyectoActualizado)
         setAlerta({})
         setModalFormularioTarea(false)
    }

    const eliminarTareaProyecto = tarea => {
            const proyectoActualizado ={...proyecto}
            proyectoActualizado.tareas = proyectoActualizado.tareas.filter(ts => ts._id !== tarea._id)
            setProyecto(proyectoActualizado)
    }

    const actualizarTareaProyecto = tarea => {

        const proyectoActualizado ={...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map (item => item._id === tarea._id ? tarea : item)
        setProyecto(proyectoActualizado)
    }

    const cambiarEstadoTarea = (tarea) =>{
            const proyectoActualizado = {...proyecto}
            proyectoActualizado.tareas = proyectoActualizado.tareas.map(item => item._id === tarea._id ? tarea : item)
            setProyecto(proyectoActualizado)
    }

    const cerrarSesionProyectos = () => {
        setProyectos([])
        setProyecto({})
        setAlerta({})

    }
    return (
                <ProyectosContext.Provider
                    value={{
                        proyectos,
                        mostrarAlerta,
                        alerta,
                        submitProyecto,
                        obtenerProyecto,
                        proyecto,
                        cargando,
                        eliminarProyecto,
                        modalFormularioTarea,
                        handleModalTarea,
                        submitTarea,
                        handelModalEditarTarea,
                        tarea,
                        modalEliminarTarea,
                        handleModalEliminarTarea,
                        eliminarTarea,
                        submitColaborador,
                        colaborador,
                        agregarColaborador,
                        handleModalEliminarColaborador,
                        modalEliminarColaborador,
                        eliminarColaborador,
                        completarTarea,
                        handleBuscador,
                        buscador,
                        submitTareasProyecto,
                        eliminarTareaProyecto,
                        actualizarTareaProyecto,
                        cambiarEstadoTarea,
                        cerrarSesionProyectos
                    }}
                > {children}
                </ProyectosContext.Provider>
        )
}

export {ProyectosProvider}

export default ProyectosContext;