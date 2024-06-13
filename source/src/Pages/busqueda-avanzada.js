import React, { useEffect, useState } from "react";
import Header from './Layout/Header'
import Footer from './Layout/Footer'
import { ApiComunicator } from "../Helpers/ApiComunicator";
import Spinner from "../Components/Spinner/Spinner";
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap';
import { Link } from "react-router-dom";

var b64toBlob = require('b64-to-blob')

const BusquedaAvanzada = () => {

  const [loading, setLoading] = useState(false)
  const [loadingNormas, setLoadingNormas] = useState(false)
  const [secciones, setSecciones] = useState()
  const [tipos, setTipos] = useState()
  const [subtipos, setSubtipos] = useState()
  const [reparticiones, setReparticiones] = useState()
  const [organismo, setOrganismo] = useState()
  const [busqueda, setBusqueda] = useState()
  const [modal, setModal] = useState(false)
  const initForm = {
    fechaPublicacionDesde: '',
    fechaPublicacionHasta: '',
    idReparticion: null,
    idSeccion: null,
    idNormaTipo: null,
    idNormaSubtipo: null,
    normaNumero: '',
    normaAnio: '',
    palabras: '',
    organismoEmisor: '',
    numeroBoletin: ''
  }
  const [form, setForm] = useState(initForm)

  const [paginacion, setPaginacion] = useState({
    paginaActual: 1,
    limite: 15,
    totalPaginas: 1,
    cambiarPagina: false
  })

  useEffect(async () => {
    if (paginacion.cambiarPagina === true) {
      let auxPaginacion = paginacion;
      auxPaginacion.cambiarPagina = false;
      setPaginacion({ ...auxPaginacion })
      await buscar()
    }
  }, [paginacion])

  function cambiarPagina(e, page) {
    if (e) {
      e.preventDefault();
    }
    //e.preventDefault();
    if (page < 1 || page > paginacion.totalPaginas) return;
    let auxPaginacion = paginacion;
    auxPaginacion.paginaActual = page;
    auxPaginacion.cambiarPagina = true;
    setPaginacion({ ...auxPaginacion })
  }

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
      case 'idReparticion':
        value = parseInt(e.target.value);
        if (isNaN(value)) {
          setForm({ ...form, idReparticion: -1 })
          break;
        }
        setForm({ ...form, idReparticion: value })
        break;
      case 'idSeccion':
        value = parseInt(e.target.value);
        if (isNaN(value)) {
          setForm({ ...form, idSeccion: -1 })
          break;
        }
        setForm({ ...form, idSeccion: value })
        break;
      case 'idNormaTipo':
        value = parseInt(e.target.value);
        if (isNaN(value)) {
          setForm({ ...form, idNormaTipo: -1 })
          break;
        }
        setForm({ ...form, idNormaTipo: value })
        break;
      case 'idNormaSubtipo':
        value = parseInt(e.target.value);
        if (isNaN(value)) {
          setForm({ ...form, idNormaSubtipo: -1 })
          break;
        }
        setForm({ ...form, idNormaSubtipo: value })
        break;
      case 'normaNumero':
        value = parseInt(e.target.value);
        if (isNaN(value)) {
          setForm({ ...form, normaNumero: value })
          break;
        }
        setForm({ ...form, normaNumero: value })
        break;
      case 'normaAnio':
        value = e.target.value;
        if (isNaN(value)) {
          setForm({ ...form, normaAnio: value })
          break;
        }
        setForm({ ...form, normaAnio: value })
        break;
      case 'palabras':
        value = String(e.target.value);
        setForm({ ...form, palabras: value })
        break;
      case 'organismoEmisor':
        value = String(e.target.value);
        setForm({ ...form, organismoEmisor: value })
        break;
      case 'numeroBoletin':
        value = parseInt(e.target.value);
        if (isNaN(value)) {
          setForm({ ...form, numeroBoletin: value })
          break;
        }
        setForm({ ...form, numeroBoletin: value })
        break;
    }
  }

  async function getSecciones() {
    const secciones = await ApiComunicator('/api/v1/bo/mostrar/secciones', { method: "GET" })
      .then(res => res.json())
    setSecciones(secciones.data)
  }

  async function getTiposNormas() {
    const tipos = await ApiComunicator('/api/v1/bo/mostrar/tipos-normas', { method: "GET" })
      .then(res => res.json())
    setTipos(tipos.data)

  }

  async function getSubtiposNormas() {
    const subtipos = await ApiComunicator('/api/v1/bo/mostrar/subtipos-normas', { method: "GET" })
      .then(res => res.json())
    setSubtipos(subtipos.data)

  }

  async function getReparticiones() {
    const reparticiones = await ApiComunicator('/api/v1/bo/mostrar/reparticiones', { method: "GET" })
      .then(res => res.json())
    setReparticiones(reparticiones.data)

  }

  async function getOrganismo() {
    const organismo = await ApiComunicator('/api/v1/bo/mostrar/organismos', { method: "GET" })
      .then(res => res.json())
    setOrganismo(organismo.data)

  }

  const buscar = async (e) => {
    //e.preventDefault();
    setLoadingNormas(true)
    let body = { ...form, ...paginacion }
    if (e) {
      //Si llega el evento es porque viene del boton de buscar
      e.preventDefault();
      //Seteo la paginacion a su valor inicial pero con cambiarPagina en true para que entre en el hook de efecto
      setPaginacion({ paginaActual: 1, limite: 15, totalPaginas: 1, cambiarPagina: true })
      return; // retorno, porque cuando se dispare el hook, va a llegar a esta funcion pero sin el evento
    };

    try {
      const boletines = await ApiComunicator('/api/v1/bo/mostrar/boletines/normas', { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        .then((res) => res.json())
        setBusqueda(boletines.data)
        let auxPaginacion = { ...paginacion };
        auxPaginacion.totalPaginas = Math.ceil(boletines.total / auxPaginacion.limite);
        setPaginacion({ ...auxPaginacion });  
        /* document.getElementById('tabla-resultados').scrollIntoView({ behavior: "smooth" }); */
    } catch (e) {
    } finally {
      setLoadingNormas(false)
    }
  }

  async function traerDocumento(nombreArchivo) {
    // window.open("http://api-restboletinoficial.buenosaires.gob.ar/download/" + nombreArchivo, "_blank");
    try {
      const archivo = await ApiComunicator('/api/v1/traer-archivo', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archivo: nombreArchivo, tipo: "boletin" })
      })
        .then(res => res.text())
      let blob = b64toBlob(archivo, 'application/pdf')
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.target = '_blank'
      link.click()
    } catch (error) {
      setModal(true)
    }
  }

  const dataNormas = (repa, normaTipo, seccion) => {
    let control = null;
    let arrayNormas = [];
    let aux = busqueda.filter(norma => normaTipo === norma.idNormaTipo && seccion === norma.idSeccion && repa === norma.idReparticion);

    for (const norma of aux) {
      if (norma.idNorma !== control) {
        control = norma.idNorma;
        arrayNormas.push(
          <div className="mb-4">
            <p>{norma.reparticiones}</p>
            <button className="btn btn-link"
              style={{ marginBottom: "6px" }} type="button" id="descargar-archivoPublicado"
              onClick={() => traerDocumento(norma.archivoPublicado)
              }>
              {norma.normaTipo}&nbsp;N°{norma.normaNumero}-{norma.organismoEmisor}/{norma.normaAnio}
            </button>
            <p>{norma.normaSumario}</p>
            {norma.anexos?.length > 0 ? norma.anexos.map(n =>
              <p className="m-1">
                <button className="btn btn-secondary"
                style={{ marginBottom: "6px" }} type="button" id="descargar-anexo"
                onClick={() => traerDocumento(n.archivoPublico)
                }>
                {n.normaAnexoArchivo}
              </button>
              </p>
            ) : null}
            <hr></hr>
          </div>
        )
      }
    }
    return arrayNormas;
  }

  const getReparticion = (normaTipo, seccion) => {
    let control = null;
    let accordions = [];
    let aux = busqueda?.filter(norma => normaTipo === norma.idNormaTipo && seccion === norma.idSeccion);

    for (const norma of aux) {
      if (norma.idReparticion !== control) {
        control = norma.idReparticion;
        accordions.push(
          <div>
            <h5>{norma.reparticion}</h5>
            {dataNormas(norma.idReparticion, normaTipo, seccion)}
          </div>
        )
      }
    }
    return accordions
  }

  const getTipo = (res) => {
    let control = null;
    let accordions = [];
    try {
      for (const corte of busqueda?.filter(norma => res === norma.idSeccion)) {
        if (corte.idNormaTipo !== control) {
          control = corte.idNormaTipo;
          accordions.push(
            <div>
              <h3>{corte.normaTipo}</h3>
              {getReparticion(corte.idNormaTipo, corte.idSeccion)}
            </div>
          )
        }
      }
    }
    catch (e) { }
    return accordions
  }

  const tabla = () => {
    let control = null;
    let accordions = [];
    let counter = 0; // Contador para generar ids únicos

    if (busqueda && busqueda.length > 0) {
      for (const corte of busqueda) {
        if (corte.idSeccion !== control) {
          control = corte.idSeccion;
          counter++; // Incrementar el contador
          const collapseId = `collapse-${control}-${counter}`; // Generar id único

          accordions.push(
            <div className="card" key={control}>
              <button
                className="card-header card-link"
                data-toggle="collapse"
                data-target={`#${collapseId}`}
              >
                {corte.seccion}
              </button>
              <div
                id={collapseId}
                className="collapse show"
                data-parent="#accordion"
              >
                <div className="card-body">
                  {getTipo(corte.idSeccion)}
                </div>
              </div>
            </div>
          );
        }
      }
    }
    return accordions;
  };

  useEffect(async () => {
    setLoading(true)
    await getSecciones()
    await getTiposNormas()
    await getSubtiposNormas()
    await getReparticiones()
    await getOrganismo()
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
                <h2 class="card-title">Busqueda Avanzada</h2>
                <div class="form-wrapper">
                  <form class="form" onSubmit={(e) => buscar(e)}>
                    <div className="row">
                      <div class="form-group col-12">
                        <label class="form-label">Seleccionar Sección</label>
                        <select class="custom-select" id="idSeccion" name="idSeccion"
                          value={form.idSeccion ? form.idSeccion : -1} onChange={(e) => handleForm(e)}
                          placeholder="Seleccione una sección">
                          <option selected value={-1}>Seleccione una sección</option>
                          {secciones && (secciones.length > 0) ? (
                            secciones.map((p, index) => (
                              <option value={p.idSeccion} key={'opt-sec-' + index}>{p.seccion}</option>
                            ))

                          ) : (<option selected disabled>No hay secciones</option>)
                          }
                        </select>
                      </div>
                      <div class="form-group col-6">
                        <label class="form-label">Tipo de Norma</label>
                        <select class="custom-select" id="idNormaTipo" name="idNormaTipo"
                          value={form.idNormaTipo ? form.idNormaTipo : -1} onChange={(e) => handleForm(e)}
                          placeholder="Seleccione un tipo de norma">
                          <option selected value={-1}>Seleccione un tipo de norma</option>
                          {tipos && (tipos.length > 0) ? (
                            tipos.map((p, index) => (
                              <option value={p.idNormaTipo} key={'opt-sec-' + index}>{p.normaTipo}</option>
                            ))

                          ) : (<option selected disabled>No hay tipos de norma</option>)
                          }
                        </select>
                      </div>
                      <div class="form-group col-6">
                        <label class="form-label">Subtipo</label>
                        <select class="custom-select" id="idNormaSubtipo" name="idNormaSubtipo"
                          value={form.idNormaSubtipo ? form.idNormaSubtipo : -1} onChange={(e) => handleForm(e)}
                          placeholder="Seleccione un subtipo de norma">
                          <option selected value={-1}>Seleccione un subtipo de norma</option>
                          {subtipos && (subtipos.length > 0) ? (
                            subtipos.map((p, index) => (
                              <option value={p.idNormaSubtipo} key={'opt-sec-' + index}>{p.normaSubtipo}</option>
                            ))

                          ) : (<option selected disabled>No hay tipos de norma</option>)
                          }
                        </select>
                      </div>
                      <div class="form-group col-12">
                        <label class="form-label">Reparticiones</label>
                        <select class="custom-select" id="idReparticion" name="idReparticion"
                          value={form.idReparticion ? form.idReparticion : -1} onChange={(e) => handleForm(e)}
                          placeholder="Seleccione una repartición">
                          <option selected value={-1}>Seleccione una repartición</option>
                          {reparticiones && (reparticiones.length > 0) ? (
                            reparticiones.map((p, index) => (
                              <option value={p.idReparticion} key={'opt-sec-' + index}>{p.reparticion}</option>
                            ))

                          ) : (<option selected disabled>No hay reparticiones</option>)
                          }
                        </select>
                      </div>
                      <div className="form-group col-8">
                        <label for="normaNumero" class="form-label">Número de Norma</label>
                        <input
                          type="number"
                          class="form-control input-number"
                          id="normaNumero"
                          name="normaNumero"
                          placeholder="Número de Norma"
                          onChange={(e) => handleForm(e)} value={form.normaNumero}
                        />
                      </div>
                      <div className="form-group col-4">
                        <label for="normaAnio" class="form-label">Año</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Ej: 23" 
                          id="normaAnio" 
                          name="normaAnio" 
                          onChange={(e) => handleForm(e)} value={form.normaAnio} 
                          maxlength="2" 
                          onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ""))}
                        />
                      </div>
                    </div>
                    <br></br>
                    <div className="row">
                      <div class="form-group col-12">
                        <label for="palabras" class="form-label">Con las palabras</label>
                        <input
                          type="text"
                          class="form-control input-text"
                          id="palabras"
                          name="palabras"
                          placeholder="Ingrese las palabras..."
                          onChange={(e) => handleForm(e)}
                          value={form.palabras}
                        />
                      </div>
                    </div>
                    <br></br>
                    <div className="row">
                      <div class="form-group col-12">
                        <label class="form-label">Organismo emisor</label>
                        <select class="custom-select" id="organismoEmisor" name="organismoEmisor"
                          value={form.organismoEmisor ? form.organismoEmisor : -1} onChange={(e) => handleForm(e)}
                          placeholder="Seleccione un organismo emisor">
                          <option selected value={-1}>Seleccione un organismo emisor</option>
                          {organismo && (organismo.length > 0) ? (
                            organismo.map((p, index) => (
                              <option value={p.sigla} key={'opt-sec-' + index}>{p.nombre}</option>
                            ))

                          ) : (<option selected disabled>No hay organismos</option>)
                          }
                        </select>
                      </div>
                    </div>
                    <br></br>
                    <div className="row">
                      <div className="form-group col-4">
                        <label>N° de Boletín</label>
                      </div>
                      <div className="form-group col-8">
                        <label>Fecha de publicacion</label>
                      </div>
                    </div>
                    <div className="row">
                      <div class="form-group col-4">
                        <label for="numeroBoletin" class="form-label" style={{ color: "white", height: "40px" }}>-</label>
                        <input
                          type="number"
                          class="form-control input-number"
                          id="numeroBoletin"
                          name="numeroBoletin"
                          min="0"
                          placeholder="Número de Boletín"
                          onChange={(e) => handleForm(e)}
                          value={form.numeroBoletin}
                        />
                      </div>
                      <div class="form-group col-4">
                        <label class="form-label" style={{ height: "40px" }}>Desde</label>
                        <input
                          type="date"
                          class="form-control input-date"
                          id="fechaPublicacionDesde"
                          name="fechaPublicacionDesde"
                          onChange={(e) => handleForm(e)}
                          value={form.fechaPublicacionDesde}
                        />
                      </div>
                      <div className="form-group col-4">
                        <label class="form-label" style={{ height: "40px" }}>Hasta</label>
                        <input
                          type="date"
                          class="form-control input-date"
                          id="fechaPublicacionHasta"
                          name="fechaPublicacionHasta"
                          onChange={(e) => handleForm(e)}
                          value={form.fechaPublicacionHasta}
                        />
                      </div>
                    </div>
                    <br></br>
                    <button type="submit" class="btn btn-primary">Buscar</button>
                    <button type="button" class="btn btn-secondary ml-2" onClick={() => setForm(initForm)}>Limpiar</button>
                  </form>
                  <br></br>
                  <br></br>
                  <div id="accordion">
                    <div className="accordion-wrapper">
                      <div className="accordion" id="accordionExample">
                        {busqueda?.length > 0 && tabla()}
                      </div>
                    </div>
                  </div>
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
                    </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer></Footer>
      <Modal show={modal}>
        <Modal.Header>
          <Modal.Title>
            Ocurrio un Error
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <br/>
          No es posible encontrar este documento
          <br/>
          <br/>
          <hr/>
        </Modal.Body>
        <Modal.Footer>
          <button class="btn btn-danger" onClick={() => setModal(false)}>
            Cerrar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BusquedaAvanzada;
