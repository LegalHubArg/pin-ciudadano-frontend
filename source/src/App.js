import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate, useLocation, Outlet } from "react-router-dom";
//Spinner
import Spinner from "./Components/Spinner/Spinner";


//Obelisco
import '@gcba/obelisco/dist/obelisco.css';


//VISTAS BO
const Home = React.lazy(() => import('./Pages/boletin-oficial'));
const InformacionGeneral = React.lazy(() => import('./Pages/informacion-general'));
const RequisitosGenerales = React.lazy(() => import('./Pages/requisitos-generales'));
const Tarifa = React.lazy(() => import('./Pages/tarifa'));
const NormasDestacadas = React.lazy(() => import('./Pages/normas-destacadas'));
const Contacto = React.lazy(() => import('./Pages/contacto'));
const Institucional = React.lazy(() => import('./Pages/institucional'));
const Digestos = React.lazy(() => import('./Pages/digestos'));
const SDINBusqueda = React.lazy(() => import('./Pages/sdin-busqueda'));
const BusquedaAvanzada = React.lazy(() => import('./Pages/busqueda-avanzada'));
const ContactoNormativa = React.lazy(() => import('./Pages/NormativaDigesto/contacto-normativa'));
const QueHacemos = React.lazy(() => import('./Pages/NormativaDigesto/que-hacemos'));
const ComoUtilizarlo = React.lazy(() => import('./Pages/NormativaDigesto/como-utilizarlo'));
const NormativaRelevante = React.lazy(() => import('./Pages/NormativaDigesto/normativa-relevante'));
const QueEs = React.lazy(() => import('./Pages/NormativaDigesto/que-es'));
const IndiceTematico = React.lazy(() => import('./Pages/NormativaDigesto/arbol-tematico'));
const Digesto = React.lazy(() => import('./Pages/NormativaDigesto/digesto'));
const DigestoBusqueda = React.lazy(() => import('./Pages/digesto-busqueda'));
const SDINResultados = React.lazy(() => import('./Pages/sdin-resultados'));
const SDINDetalle = React.lazy(() => import('./Pages/sdin-detalle'));
const SDINArchivoADescargar = React.lazy(() => import('./Pages/archivo-a-descargar'));
const SDINAdjuntoNormaSDIN = React.lazy(() => import('./Pages/adjunto-norma-sdin'));
const DigestoDetalle = React.lazy(() => import('./Pages/digesto-detalle'));
const ArbolTematico = React.lazy(() => import('./Pages/arbol-tematico'));
const ArchivosBucket = React.lazy(() => import('./Pages/archivos-bucket'));

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <React.Suspense fallback={<Spinner />}><Home/></React.Suspense> } />
        <Route path="/informacion-general" element={ <React.Suspense fallback={<Spinner />}><InformacionGeneral/></React.Suspense> } />
        <Route path="/requisitos-generales" element={ <React.Suspense fallback={<Spinner />}><RequisitosGenerales/></React.Suspense> } />
        <Route path="/tarifa" element={ <React.Suspense fallback={<Spinner />}><Tarifa/></React.Suspense> } />
        <Route path="/normas-destacadas" element={ <React.Suspense fallback={<Spinner />}><NormasDestacadas/></React.Suspense> } />
        <Route path="/contacto" element={ <React.Suspense fallback={<Spinner />}><Contacto /></React.Suspense> } />
        <Route path="/institucional" element={ <React.Suspense fallback={<Spinner />}><Institucional /></React.Suspense> } />
        <Route path="/digestos" element={ <React.Suspense fallback={<Spinner />}><Digestos /></React.Suspense> } />
        <Route path="/sdin-busqueda" element={ <React.Suspense fallback={<Spinner />}><SDINBusqueda /></React.Suspense> } />
        <Route path="/busqueda-avanzada" element={ <React.Suspense fallback={<Spinner />}><BusquedaAvanzada /></React.Suspense> } />
        <Route path="/contacto-normativa" element={ <React.Suspense fallback={<Spinner />}><ContactoNormativa /></React.Suspense> } />
        <Route path="/que-hacemos" element={ <React.Suspense fallback={<Spinner />}><QueHacemos /></React.Suspense> } />
        <Route path="/como-utilizarlo" element={ <React.Suspense fallback={<Spinner />}><ComoUtilizarlo /></React.Suspense> } />
        <Route path="/normativa-relevante" element={ <React.Suspense fallback={<Spinner />}><NormativaRelevante /></React.Suspense> } />
        <Route path="/que-es" element={ <React.Suspense fallback={<Spinner />}><QueEs /></React.Suspense> } />
        <Route path="/indice-tematico" element={ <React.Suspense fallback={<Spinner />}><IndiceTematico /></React.Suspense> } />
        <Route path="/digesto" element={ <React.Suspense fallback={<Spinner />}><Digesto /></React.Suspense> } />
        <Route path="/digesto-busqueda" element={ <React.Suspense fallback={<Spinner />}><DigestoBusqueda /></React.Suspense> } />
        <Route path="/sdin-resultados" element={ <React.Suspense fallback={<Spinner />}><SDINResultados /></React.Suspense> } />
        <Route path="/sdin-busqueda/norma/:idNorma" element={ <React.Suspense fallback={<Spinner />}><SDINDetalle /></React.Suspense> } />
        <Route path="/sdin-busqueda/norma/:idNorma/imagen/:numero" element={ <React.Suspense fallback={<Spinner />}><SDINArchivoADescargar /></React.Suspense> } />
        <Route path="/sdin/documentos/:nombre" element={ <React.Suspense fallback={<Spinner />}><SDINAdjuntoNormaSDIN /></React.Suspense> } />
        <Route path="/digesto-busqueda/norma/:idNorma" element={ <React.Suspense fallback={<Spinner />}><DigestoDetalle /></React.Suspense> } />
        <Route path="/digesto/arbol-tematico" element={ <React.Suspense fallback={<Spinner />}><ArbolTematico /></React.Suspense> } />
        <Route path="/boletin-oficial/documentos/:nombre" element={ <React.Suspense fallback={<Spinner />}><ArchivosBucket /></React.Suspense> } />
      </Routes>
    </div>
  )
}

export default App;
