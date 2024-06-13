import React, { useEffect, useState } from "react";
import Header from './Layout/Header'
import Footer from './Layout/Footer'
import moment from 'moment'
import Spinner from '../Components/Spinner/Spinner'
import { ApiComunicator } from "../Helpers/ApiComunicator";

const DigestoBusqueda = () => {
  const [loading, setLoading] = useState(false)
  const [resultados, setResultados] = useState()
  const [tiposNorma, setTiposNorma] = useState()
  const [temas, setTemas] = useState()
  const [ramas, setRamas] = useState()
  const [paginacion, setPaginacion] = useState({
    paginaActual: 1,
    limite: 15,
    totalPaginas: 1,
    cambiarPagina: false
  })
  const initForm = {
    boletinNumero: null,
    fechaPublicacionDesde: '',
    fechaPublicacionHasta: '',
    idNormaTipo: null,
    normaNumero: null,
    normaAnio: null,
    texto: '',
    vigente: null,
    textoSoloSumario: false
  }
  const [form, setForm] = useState(initForm)

  const handleForm = (e) => {
    let value;
    switch (e.target.name) {
      case 'fechaPublicacionDesde':
        value = e.target.value;
        setForm({ ...form, fechaPublicacionDesde: value })
        break;
      case 'fechaPublicacionHasta':
        value = e.target.value;
        setForm({ ...form, fechaPublicacionHasta: value })
        break;
      case 'boletinNumero':
        value = parseInt(e.target.value);
        if (isNaN(value)) {
          setForm({ ...form, boletinNumero: '' })
          break;
        }
        setForm({ ...form, boletinNumero: value })
        break;
      case 'idNormaTipo':
        value = parseInt(e.target.value);
        if (isNaN(value)) {
          setForm({ ...form, idNormaTipo: '' })
          break;
        }
        setForm({ ...form, idNormaTipo: value })
        break;
      case 'texto':
        value = String(e.target.value);
        setForm({ ...form, texto: value })
        break;
      case 'textoSoloSumario':
        value = e.target.checked;
        setForm({ ...form, textoSoloSumario: value })
        break;
      case 'vigente':
        value = e.target.value;
        setForm({ ...form, vigente: value })
        break;
      default:
        value = e.target.value;
        setForm({ ...form, [e.target.name]: value })
        break;
    }
  }

  async function getTiposNormas() {
    const tipos = await ApiComunicator('/api/v1/bo/mostrar/tipos-normas', { method: "GET" })
      .then(res => res.json())
    setTiposNorma(tipos.data)

  }

  const getRamas = async () => {
    const results = await ApiComunicator('/api/v1/dj/ramas', { method: "GET" })
      .then((res) => res.json())
    setRamas(results.data)
  }

  const getTemas = async () => {
    const results = await ApiComunicator('/api/v1/dj/temas', { method: "GET" })
      .then((res) => res.json())
    setTemas(results.data)
  }

  const buscar = async (e) => {
    let body = { ...paginacion, ...form }
    if (e) {
      //Si llega el evento es porque viene del boton de buscar
      e.preventDefault();
      //Seteo la paginacion a su valor inicial pero con cambiarPagina en true para que entre en el hook de efecto
      setPaginacion({ paginaActual: 1, limite: 15, totalPaginas: 1, cambiarPagina: true })
      return; // retorno, porque cuando se dispare el hook, va a llegar a esta funcion pero sin el evento
    };
    const normas = await ApiComunicator('/api/v1/dj/normas', { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then((res) => res.json())
    setResultados(normas.data)
    let auxPaginacion = { ...paginacion };
    auxPaginacion.totalPaginas = Math.ceil(normas.data.totalNormas / auxPaginacion.limite);
    setPaginacion({ ...auxPaginacion });
    document.getElementById('tabla-resultados').scrollIntoView({ behavior: "smooth" });
  }

  function cambiarPagina(e, page) {
    e.preventDefault();
    if (page < 1 || page > paginacion.totalPaginas) return;
    let auxPaginacion = paginacion;
    auxPaginacion.paginaActual = page;
    auxPaginacion.cambiarPagina = true;
    setPaginacion({ ...auxPaginacion })
  }

  useEffect(async () => {
    if (paginacion.cambiarPagina === true) {
      let auxPaginacion = paginacion;
      auxPaginacion.cambiarPagina = false;
      setPaginacion({ ...auxPaginacion })
      await buscar()
    }
  }, [paginacion])

  useEffect(async () => {
    setLoading(true)
    await getTemas()
    await getRamas()
    await getTiposNormas()
    setLoading(false)
  }, [])

  if (loading) return <Spinner />
  else return (
    <>
      <Header></Header>
      <main>
        <article class="pb-5">
          <div class="container mb-5">
            <div class="row">
              <div class="col-12">
                <h2 class="card-title">Digesto G.C.B.A.</h2>
                <div class="form-wrapper">
                  <form class="form" onSubmit={(e) => buscar(e)}>
                    <div className="row">
                      <div class="form-group col-6">
                        <label class="form-label">Tipo de normas</label>
                        <select class="custom-select custom-select-sm" id="idNormaTipo" name="idNormaTipo"
                          value={form.idNormaTipo ? form.idNormaTipo : -1} onChange={(e) => handleForm(e)}>
                          <option selected value={-1}></option>
                          {tiposNorma && (tiposNorma.length > 0) ? (
                            tiposNorma.map((p, index) => (
                              <option value={p.idNormaTipo} key={'opt-sec-' + index}>{p.normaTipo}</option>
                            ))

                          ) : (<option selected disabled>No hay tipos de norma</option>)
                          }
                        </select>
                      </div>
                      <div className="row">
                        <div class="form-group col">
                          <label class="form-label">Número</label>
                          <input
                            type="text"
                            class="form-control input-text form-control-sm"
                            id="normaNumero"
                            name="normaNumero"
                          />
                        </div>
                        <div class="form-group col">
                          <label class="form-label">Año</label>
                          <input
                            type="number"
                            class="form-control input-text form-control-sm"
                            id="normaAnio"
                            name="normaAnio"
                          />
                        </div>
                      </div>
                      <div class="form-group col-6">
                        <label class="form-label" for="vigente">Estado</label>
                        <select class="custom-select custom-select-sm" id="vigente" name="vigente"
                          onChange={(e) => handleForm(e)} value={form.vigente}>
                          <option value={null}>Todos</option>
                          <option value={0}>No Vigente</option>
                          <option value={1}>Vigente</option>
                        </select>
                      </div>
                      <div className="form-group col">
                        <label class="form-label">Tema</label>
                        <select class="custom-select custom-select-sm" id="idTema" name="idTema"
                          value={form.idTema ? form.idTema : -1} onChange={(e) => handleForm(e)}>
                          <option selected value={-1}></option>
                          {temas && (temas.length > 0) ? (
                            temas.map((p, index) => (
                              <option value={p.idTema} key={'opt-sec-' + index}>{p.tema}</option>
                            ))

                          ) : (<option selected disabled>No hay temas para mostrar</option>)
                          }
                        </select>
                      </div>
                      <div className="form-group col">
                        <label class="form-label">Rama</label>
                        <select class="custom-select custom-select-sm" id="idRama" name="idRama"
                          value={form.idRama ? form.idRama : -1} onChange={(e) => handleForm(e)}>
                          <option selected value={-1}></option>
                          {ramas && (ramas.length > 0) ? (
                            ramas.map((p, index) => (
                              <option value={p.idRama} key={'opt-sec-' + index}>{p.rama}</option>
                            ))

                          ) : (<option selected disabled>No hay ramas para mostrar</option>)
                          }
                        </select>
                      </div>
                      <div class="form-group col-12">
                        <label class="form-label">Texto</label>
                        <input
                          type="text"
                          class="form-control form-control-sm input-text"
                          id="texto"
                          name="texto"
                          value={form.texto}
                          onChange={(e) => handleForm(e)}
                        />
                      </div>
                      <div class="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          class="custom-control-input"
                          id="textoSumario"
                          name="textoSoloSumario"
                          checked={form.textoSoloSumario}
                          onChange={(e) => handleForm(e)}
                        />
                        <label className="custom-control-label" for="textoSumario">Buscar texto sólo en el sumario de la norma</label>
                      </div>
                    </div>
                    <h4 class='mt-3'>Datos del Boletín</h4>
                    <div className="row">
                      <div class="form-group col">
                        <label class="form-label">Fecha Publicación Desde</label>
                        <input
                          type="date"
                          class="form-control form-control-sm input-date"
                          id="fechaPublicacionDesde"
                          name="fechaPublicacionDesde"
                          value={form.fechaPublicacionDesde}
                          onChange={(e) => handleForm(e)}
                        />
                      </div>
                      <div className="form-group col">
                        <label class="form-label">Fecha Publicación Hasta</label>
                        <input
                          type="date"
                          class="form-control form-control-sm input-date"
                          id="fechaPublicacionHasta"
                          name="fechaPublicacionHasta"
                          value={form.fechaPublicacionHasta}
                          onChange={(e) => handleForm(e)}
                        />
                      </div>
                      <div className="form-group col">
                        <label class="form-label">Número</label>
                        <input
                          type="text"
                          class="form-control form-control-sm input-text"
                          id="boletinNumero"
                          name="boletinNumero"
                          value={form.boletinNumero}
                          onChange={(e) => handleForm(e)}
                        />
                      </div>
                    </div>
                    <button class="btn btn-primary">Buscar</button>
                    <button type="button" class="btn btn-secondary ml-2" onClick={() => setForm(initForm)}>Borrar</button>
                  </form>
                </div>
                {resultados && resultados.normas && <>
                  <table className="table table-hover mt-3" id="tabla-resultados">
                    <thead>
                      <tr>
                        <th>Norma</th>
                        <th>Año</th>
                        <th>Fecha de publicación</th>
                        <th>Tema</th>
                        <th>Rama</th>
                        <th>Temas Generales</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultados.normas.map(n =>
                        <tr>
                          <td><a href={"digesto-busqueda/norma/" + n.idNormaFinal}>{n.normaTipo}&nbsp;N°{n.normaNumero}</a></td>
                          <td>{n.normaAnio}</td>
                          <td>{n.fechaPublicacion ? moment(n.fechaPublicacion).format('DD/MM/YYYY') : null}</td>
                          <td>{ }</td>
                          <td>{n.rama}</td>
                          <td>{n.temasGenerales}</td>
                        </tr>)}
                    </tbody>
                  </table>
                  <div className="mt-2 d-flex justify-content-center">
                    <nav className="">
                      <ul className="pagination">
                        {paginacion?.paginaActual !== 1 &&
                          <li className="page-item">
                            <a className="page-link" onClick={(e) => cambiarPagina(e, paginacion?.paginaActual - 1)}>
                              <span className="page-previous-icon" aria-hidden="true"></span>
                              <span className="page-previous-text">Anterior</span>
                            </a>
                          </li>}
                        <li className={paginacion?.paginaActual === 1 ? "page-item active no-events" : "page-item"}>
                          <a className="page-link" onClick={(e) => cambiarPagina(e, 1)}>1</a>
                        </li>
                        {paginacion?.paginaActual > 2 && <li className="page-item no-events"><span className="page-link">...</span></li>}
                        {paginacion?.paginaActual > 1 && paginacion?.paginaActual !== paginacion?.totalPaginas &&
                          <li className="page-item active no-events"><a className="page-link">{paginacion?.paginaActual}</a></li>}
                        {paginacion?.paginaActual < paginacion?.totalPaginas - 1 && paginacion?.totalPaginas > 2 &&
                          <li className="page-item no-events"><span className="page-link">...</span></li>}
                        {paginacion?.totalPaginas > 1 &&
                          <li className={paginacion?.totalPaginas === paginacion?.paginaActual ? "page-item active no-events" : "page-item"}>
                            <a className="page-link" onClick={(e) => cambiarPagina(e, paginacion?.totalPaginas)}>{paginacion?.totalPaginas}</a>
                          </li>}
                        {paginacion?.paginaActual !== paginacion?.totalPaginas &&
                          <li className="page-item">
                            <a className="page-link" onClick={(e) => cambiarPagina(e, paginacion?.paginaActual + 1)}>
                              <span className="page-next-text">Siguiente</span>
                              <span className="page-next-icon" aria-hidden="true"></span>
                            </a>
                          </li>}
                      </ul>
                    </nav>
                    <div style={{ position: "absolute", right: 20, fontSize: 12 }}>Total de resultados: {resultados.totalNormas}</div>
                  </div>
                </>}
              </div>
            </div>
          </div>
        </article>
      </main>
    </>
  );
};

export default DigestoBusqueda;