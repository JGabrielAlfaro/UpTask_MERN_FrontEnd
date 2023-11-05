import {BrowserRouter, Route,Routes} from 'react-router-dom'

import AuthLayout from './layouts/AuthLayout'
import Login from './pages/Login'
import Registrar from './pages/Registrar'
import NuevoPassword from './pages/NuevoPassword'
import OlvidePassword from './pages/OlvidePassword'
import ConfirmarCuenta from './pages/ConfirmarCuenta'

import RutaProtegida from './layouts/RutaProtegida'
import Proyectos from './pages/Proyectos'
import Proyecto from './pages/Proyecto'
import NuevoProyecto from './pages/NuevoProyecto'
import EditarProyecto from './components/EditarProyecto'

import {AuthProvider} from './context/AuthProvider'
import {ProyectosProvider} from './context/ProyectosProvider'
import NuevoColaborador from './pages/NuevoColaborador'

function App() {
 
  return (
    <BrowserRouter>
        <AuthProvider>
            <ProyectosProvider>
                <Routes>
                    {/* PUBLICA */}
                        <Route path='/' element={<AuthLayout />} >
                            <Route index element={<Login />} />  {/* Este index refiere al path='/' */}
                            <Route path="registrar" element={ <Registrar />} /> {/* No se le debe poner /, porque el path lo tiene */}
                            <Route path="olvide-password/" element={ <OlvidePassword />} />
                            <Route path="olvide-password/:token" element={ <NuevoPassword />} />
                            <Route path="confirmar/:token" element={ <ConfirmarCuenta />} />
                            NuevoPassword
                        </Route>
                    {/* PRIVADA */}
                    <Route path="/proyectos" element={<RutaProtegida/> } >
                         <Route index element={<Proyectos />} />
                         <Route path="crear-proyecto" element={<NuevoProyecto/>}/>
                         <Route path=":id" element={<Proyecto/>}/> 
                         <Route path="editar/:id" element={<EditarProyecto/>}/> 
                         <Route path="nuevo-colaborador/:id" element={<NuevoColaborador/>}/>
                    </Route>
                </Routes>
            </ProyectosProvider>
        </AuthProvider>
    </BrowserRouter>
  )
}

export default App
