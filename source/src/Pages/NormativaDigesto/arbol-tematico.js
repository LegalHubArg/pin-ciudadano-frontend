import React, { useState, useEffect } from 'react';
import HeaderInfoNormativa from '../Layout/HeaderInfoNormativa'
import Footer from '../Layout/Footer'
import Spinner from "../../Components/Spinner/Spinner";
import { ApiComunicator } from '../../Helpers/ApiComunicator'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import './arbol-tematico.css'
//HTML decode
import { decode } from 'html-entities';


const ArbolTematico = () => {

  const [isLoading, setLoading] = useState(false)
  const [jerarquia, setJerarquia] = useState([])
  const [normas, setNormas] = useState()
  const [paginacion, setPaginacion] = useState({
    paginaActual: 1,
    limite: 15,
    totalPaginas: 1,
    botones: [],
    cambiarPagina: false
  })

  const buscarNormas = async (e, idTema) => {
    e.preventDefault();
    if (normas?.idTema === idTema) {
      setNormas(null);
      return;
    }
    document.body.style.cursor = 'wait';
    let body = {
      temas: idTema,
      ...paginacion
    };
    try {
      const boletines = await ApiComunicator('/api/v1/sdin/normas', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).then((res) => res.json());
      if (boletines.data.normas.length > 0) {
        setNormas({ idTema: idTema, normas: boletines.data.normas });
      }
      document.body.style.cursor = 'default';
    } catch (e) {
      document.body.style.cursor = 'default';
    }
  };

  const getJerarquia = async () => {
    console.log("EJECUTANDO JERARQUIA")
    try {
      const data = await ApiComunicator('/api/v1/sdin/traer/jerarquia', { method: "GET" })
        .then(res => res.json())
      setJerarquia(data.data.map(n => ({ ...n, show: false })))
    }
    catch (err) { }
  }

  const getChildren = (e, idTema) => {
    e.preventDefault();
    let auxJerarquia = jerarquia;
    auxJerarquia = auxJerarquia.map(n => (n.idTema === idTema ? { ...n, show: !n.show } : { ...n }))
    setJerarquia(auxJerarquia)
  }

  const Arbol = (children) => {
    let jerarquiaAux = [...jerarquia];

    if (!children) {

      //Busco los nodos raíz, tienen padre null
      let raices = jerarquiaAux.filter(elem => jerarquiaAux.findIndex(n => n.idTemaHijo === elem.idTema) === -1);
      //Elimino repetidos
      raices = [...new Set(raices.map(n => n.idTema))].map(item => jerarquiaAux.find(n => n.idTema === item))

      let arboles = [];

      for (const raiz of raices) {

        let temasHijos = jerarquiaAux.filter(elem => elem.idTema === raiz.idTema).map(n => ({ idTema: n.idTemaHijo, tema: n.temaHijo, show: n.show }));
        temasHijos.sort((a, b) => a.tema.localeCompare(b.tema))
        arboles.push(
          <div>
            <div className="tarjeta">{decode(raiz.tema)}
              {temasHijos.length > 0 && ( // Verificar si hay hijos antes de mostrar el botón
                <button className="btn btn-primary btn-sm" onClick={e => getChildren(e, raiz.idTema)}>
                  <FaArrowDown />
                </button>
              )}
            </div>
            {temasHijos.length > 0 ? Arbol(temasHijos) : null}
            {normas && normas.idTema === raiz.idTema && normas.normas.map(n =>
              <div className="tarjeta-norma">
                <a href={"sdin-busqueda/norma/" + n.idNormaSDIN}
                  target="_blank">
                  {decode(n?.normaTipo)}&nbsp;N°{n?.normaNumero}
                  {n.reparticion ? <>&nbsp;/&nbsp;{decode(n.reparticion)}</> : null}
                  {n.organismo ? <>&nbsp;/&nbsp;{decode(n.organismo)}</> : null}
                  {n.normaAnio ? <>&nbsp;/&nbsp;{n.normaAnio}</> : null}
                </a>
                <div style={{ fontSize: 12 }}>{n?.normaSumario}</div>
              </div>)}
          </div>)
      }

      return (arboles)
    }

    let nodos = [];
    for (const child of children) {

      let temasHijos = jerarquiaAux.filter(elem => elem.idTema === child.idTema).map(n => ({ idTema: n.idTemaHijo, tema: n.temaHijo, show: n.show }));
      temasHijos.sort((a, b) => a.tema.localeCompare(b.tema))
      if (child.show) {
        nodos.push(<div style={{ paddingLeft: "2em" }}>
          <div className="tarjeta">{decode(child.tema)}
            {temasHijos.length > 0 && ( // Verificar si hay hijos antes de mostrar el botón
              <button className="btn btn-primary btn-sm" onClick={e => getChildren(e, child.idTema)}>
                <FaArrowDown />
              </button>
            )}
          </div>
          {temasHijos.length > 0 ? Arbol(temasHijos) : null}
          {normas && normas.idTema === child.idTema && normas.normas.map(n =>
            <div className="tarjeta-norma">
              {/* <a href={"sdin-busqueda/norma/" + n.idNormaSDIN}
                                target="_blank">
                                {decode(n?.normaTipo)}&nbsp;N°{n?.normaNumero}
                                {n.reparticion ? <>&nbsp;/&nbsp;{decode(n.reparticion)}</> : null}
                                {n.organismo ? <>&nbsp;/&nbsp;{decode(n.organismo)}</> : null}
                                {n.normaAnio ? <>&nbsp;/&nbsp;{n.normaAnio}</> : null}
                            </a> */}
              <a href={"sdin-busqueda/norma/" + n.idNormaSDIN} target="_blank">
                <span dangerouslySetInnerHTML={{ __html: decode(n?.normaTipo) }}></span>
                N°<span dangerouslySetInnerHTML={{ __html: n?.normaNumero }}></span>
                {n.reparticion ? <>&nbsp;/&nbsp;<span dangerouslySetInnerHTML={{ __html: n.reparticion }}></span></> : null}
                {n.organismo ? <>&nbsp;/&nbsp;<span dangerouslySetInnerHTML={{ __html: n.organismo }}></span></> : null}
                {n.normaAnio ? <>&nbsp;/&nbsp;<span dangerouslySetInnerHTML={{ __html: n.normaAnio }}></span></> : null}
              </a>
              <div style={{ fontSize: 12 }} dangerouslySetInnerHTML={{ __html: n?.normaSumario }}
              />
            </div>)}
        </div>)
      }
    }
    return nodos;
  }

  useEffect(() => {
    setLoading(true)
    getJerarquia()
    setLoading(false)
  }, [])

  if (isLoading)
    return <Spinner />
  else
    return (
      <>
        <HeaderInfoNormativa></HeaderInfoNormativa>
        <main>
          <article class="pb-5">
            <div class="container pt-4 mb-5">
              <h2>Árbol Temático</h2>
              <hr></hr>


              <div className="container responsive mb-5">
                {jerarquia.length > 0 && Arbol()}
              </div>


            </div>
          </article>
        </main>
        <Footer></Footer>
      </>
    );
};

export default ArbolTematico;
