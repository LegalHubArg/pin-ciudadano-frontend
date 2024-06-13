import React, { useState, useEffect } from "react";
import Header from './Layout/Header'
import Footer from './Layout/Footer'
import moment from "moment";
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap';
import { ApiComunicator } from "../Helpers/ApiComunicator";
import { Link } from "react-router-dom";

var b64toBlob = require('b64-to-blob')

const BoletinOficialDefault = () => {

  const fecha = new Date

  const [datos, setDatos] = useState();
  const [datosBackup, setDatosBackup] = useState();
  const [fechaPublicacion, setFechaPublicacion] = useState();
  const [numeroBoletin, setNumeroBoletin] = useState();
  const [separata, setSeparata] = useState();
  const [modal, setModal] = useState(false)

  const [secciones, setSecciones] = useState([])
  const [tipos, setTipos] = useState([])
  const [reparticiones, setReparticiones] = useState([])

  const initFormBusqueda = {
    idSeccion: null,
    idReparticionOrganismo: null,
    idNormaTipo: null,
    texto: '',
    reparticiones: ''
  }
  const [formBusqueda, setFormBusqueda] = useState(initFormBusqueda)

  const handleFormBusqueda = (e) => {
    let value;
    switch (e.target.name) {
      case 'idSeccion':
        value = parseInt(e.target.value);
        setFormBusqueda({
          ...formBusqueda,
          ['idSeccion']: value
        })
        break;
      case 'idReparticionOrganismo':
        value = parseInt(e.target.value);
        if (isNaN(value)) break;
        setFormBusqueda({
          ...formBusqueda,
          ['idReparticionOrganismo']: value
        })
        break;
      case 'idNormaTipo':
        value = parseInt(e.target.value);
        setFormBusqueda({
          ...formBusqueda,
          ['idNormaTipo']: value
        })
        break;
      case 'texto':
        value = e.target.value;
        setFormBusqueda({
          ...formBusqueda,
          ['texto']: value
        })
        break;
      case 'reparticiones':
        value = e.target.value;
        setFormBusqueda({
          ...formBusqueda,
          ['reparticiones']: value
        })
        break;
    }
  }

  function borrarFiltros(e) {
    e.preventDefault()
    setFormBusqueda({ ...initFormBusqueda })
    if (datosBackup) setDatos([...datosBackup])
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let aux = [...datosBackup];
    if (formBusqueda.idSeccion)
      aux = aux.filter(n => n.idSeccion === formBusqueda.idSeccion)
    if (formBusqueda.idReparticionOrganismo)
      aux = aux.filter(n => n.idReparticionOrganismo === formBusqueda.idReparticionOrganismo)
    if (formBusqueda.idNormaTipo)
      aux = aux.filter(n => n.idNormaTipo === formBusqueda.idNormaTipo)
    if (formBusqueda.texto.length > 0)
      aux = aux.filter(n => n.normaSumario.includes(formBusqueda.texto))
    if (formBusqueda.reparticiones.length > 0)
      aux = aux.filter(n => n.reparticiones.includes(formBusqueda.reparticiones))
    setDatos([...aux])
  }

  async function mostrarBoletines() {
    try {
      const result = await ApiComunicator('/api/v1/bo/mostrar/boletines', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
        .then(response => response.json())
        .catch(e => { throw e })

      setDatos(result?.data.bo)
      setDatosBackup(result?.data.bo)
      setSeparata(result?.data.separatas)
    }
    catch (e) { }
  }

  async function buscarBoletinPorNumero() {
    const result = await ApiComunicator('/api/v1/bo/mostrar/boletines', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numeroBoletin: numeroBoletin })
    })
      .then(response => response.json())

    setDatos(result?.data.bo)
    setDatosBackup(result?.data.bo)
    setSeparata(result?.data.separatas)

  }
  async function buscarBoletinPorFecha() {
    const result = await ApiComunicator('/api/v1/bo/mostrar/boletines', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fechaPublicacion: fechaPublicacion })
    })
      .then(response => response.json())

    setDatos(result?.data.bo)
    setDatosBackup(result?.data.bo)
    setSeparata(result?.data.separatas)

  }


  async function mostrarSecciones() {
    const secciones = await ApiComunicator('/api/v1/bo/mostrar/secciones', { method: "GET" })
      .then(res => res.json())
    setSecciones(secciones.data)

  }

  async function mostrarTiposNormas() {
    const tipos = await ApiComunicator('/api/v1/bo/mostrar/tipos-normas', { method: "GET" })
      .then(res => res.json())
    setTipos(tipos.data)

  }

  async function traerDocumento(nombreArchivo) {
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
    let aux = datos.filter(norma => normaTipo === norma.idNormaTipo && seccion === norma.idSeccion && repa === norma.idReparticionOrganismo);

    for (const norma of aux) {
      if (norma.idNorma !== control) {
        control = norma.idNorma;
        arrayNormas.push(
          <div className="mb-4">
            <p>{norma.reparticiones}</p>
            <div>
              <button className="btn btn-link"
                style={{ marginBottom: "6px" }} type="button" id="descargar-archivoPublicado"
                onClick={() => traerDocumento(norma?.archivoBoletin)
                }>
                {norma.normaTipo}&nbsp;N°{norma.normaNumero}-{norma.organismoEmisor}/{norma.normaAnio}
              </button>
            </div>
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
    let aux = datos?.filter(norma => normaTipo === norma.idNormaTipo && seccion === norma.idSeccion);

    for (const norma of aux) {
      if (norma.idReparticionOrganismo !== control) {
        control = norma.idReparticionOrganismo;
        accordions.push(
          <div>
            <h5>{norma.organismo}</h5>
            {dataNormas(norma.idReparticionOrganismo, normaTipo, seccion)}
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
      for (const corte of datos?.filter(norma => res === norma.idSeccion)) {
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

  const descagarBoletin = (idFileserver) => {
    window.open("http://api-restboletinoficial.buenosaires.gob.ar/download/" + idFileserver, "_blank");
  }

  const getCorte = () => {
    let control = null;
    let accordions = [];
    let counter = 0; // Contador para generar ids únicos

    if (datos && datos.length > 0) {
      for (const corte of datos) {
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
                  {corte.idSeccion ? (
                    getTipo(corte.idSeccion)
                  ) : null}
                </div>
              </div>
            </div>
          );
        }
      }
    } else {
      accordions.push(
        <div className="alert alert-info">
          <p>No se encontraron normas para este boletín.</p>
        </div>
      );
    }
    return accordions;
  };

  useEffect(() => {
    mostrarBoletines(); mostrarSecciones(); mostrarTiposNormas()
  },
    []
  )

  useEffect(() => {
    if (datosBackup?.length > 0 && datosBackup instanceof Array) {
      let aux = datosBackup.map(item => item.reparticiones)

      aux = [...new Set(aux)]

      setReparticiones(aux)
    }
  },
    [datosBackup]
  )

  return (
    <>
      <Header></Header>
      <main>
        <article class="pb-5">
          <div class="container pt-4 mb-5">
            <div class="row">
              <div class="col-12 col-lg-8">
                {datos && datos.length > 0 && <h2 class="card-title">Boletín Oficial N° {datos[0].numeroBoletin} - {moment(datos[0].fechaPublicacion).format('DD/MM/YYYY')}</h2>}
                <div class="row mt-4">

                  {datos && datos.length > 0 ?
                    <div class="col align-items-end" style={{ alignSelf: "center" }}>
                      <button className="btn btn-primary btn-block"
                        style={{ marginBottom: "6px", height: "60px" }} type="button" id="descargar-boletin"
                        onClick={() => traerDocumento(datos[0].archivoBoletin)
                        }>
                        Descargar Boletin
                      </button>
                    </div>
                    :
                    datos && <div className="alert alert-info">No se encontró un documento para este boletín.</div>}

                  <div className="col align-items-end">
                    {separata && separata.length > 0 ? (
                      separata.map((n) => (
                        <div>
                          <button className="btn btn-primary btn-block"
                            style={{ marginBottom: "6px", height: "60px" }} type="button" id="descargar-separata"
                            onClick={() => traerDocumento(n.archivoS3)
                            }>
                            Descargar {n.nombre || "Anexo"}
                          </button>
                        </div>
                      ))
                    ) : (
                      separata && <div className="alert alert-info">No se encontraron anexos para este boletín</div>
                    )}
                  </div>


                </div>
                <br></br>
                <form className="form mb-2" onSubmit={e => handleSubmit(e)} id="form-buscar">
                  <div class="form-wrapper bg-light p-4">
                    <b>BUSCAR EN LA EDICIÓN DEL DÍA</b>
                    <div class="row mt-4">
                      <div class="col" style={{ minWidth: "10em" }}>
                        <label for="idSeccion" class="form-label">Sección</label>
                        <select class="custom-select custom-select-sm" id="idSeccion" name="idSeccion"
                          onChange={(e) => handleFormBusqueda(e)}
                          value={formBusqueda.idSeccion ? formBusqueda.idSeccion : -1}>
                          <option selected value={-1}></option>
                          {secciones && (secciones.length > 0) ? (
                            secciones.map((p, index) => (
                              <option value={p.idSeccion} key={'opt-sec-' + index}>{p.seccion}</option>
                            ))

                          ) : (<option selected disabled>No hay secciones para mostrar</option>)
                          }
                        </select>
                      </div>
                      <div class="col" style={{ minWidth: "10em" }}>
                        <label for="idNormaTipo" class="form-label">Tipo de Norma</label>
                        <select class="custom-select custom-select-sm" id="idNormaTipo" name="idNormaTipo"
                          onChange={(e) => handleFormBusqueda(e)}
                          value={formBusqueda.idNormaTipo ? formBusqueda.idNormaTipo : -1}>
                          <option selected value={-1}></option>
                          {tipos && (tipos.length > 0) ? (
                            tipos.map((p, index) => (
                              <option value={p.idNormaTipo} key={'opt-sec-' + index}>{p.normaTipo}</option>
                            ))

                          ) : (<option selected disabled>No hay tipos para mostrar</option>)
                          }
                        </select>
                      </div>
                      <div class="col" style={{ minWidth: "10em" }}>
                        <label for="reparticiones" class="form-label">Reparticiones</label>
                        <select class="custom-select custom-select-sm" id="reparticiones" name="reparticiones"
                          onChange={(e) => handleFormBusqueda(e)}
                          value={formBusqueda.reparticiones ? formBusqueda.reparticiones : -1}>
                          <option selected value={-1}></option>
                          {reparticiones && (reparticiones.length > 0) ? (
                            reparticiones.map((p, index) => (
                              <option value={p} key={'opt-sec-' + index}>{p}</option>
                            ))

                          ) : (<option selected disabled>No hay reparticiones para mostrar</option>)
                          }
                        </select>
                      </div>
                    </div>
                    <div class="row mt-4">
                      <div class="col-8">
                        <label for="inputEmail4" class="form-label">Buscar en Resúmen</label>
                        <div class="form-wrapper">
                          <form class="form-search">
                            <div class="form-group">
                              <input
                                type="search"
                                class="form-control input-search form-control-sm"
                                id="texto"
                                name="texto"
                                placeholder="Buscar..."
                                onChange={(e) => handleFormBusqueda(e)}
                                value={formBusqueda.texto}
                              />
                              <button class="reset" type="reset" onClick={() => setFormBusqueda({ ...formBusqueda, texto: '' })}></button>
                            </div>
                          </form>
                        </div>
                      </div>

                      <div class="col d-flex align-items-end">
                        <button className="btn btn-primary btn-block" style={{ marginBottom: "8px" }} type="submit" id="boton-buscar">Buscar</button>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col d-flex justify-content-end">
                        <div class="btn btn-link btn-sm" onClick={(e) => borrarFiltros(e)} id="boton-borrar-filtros">Borrar Filtros</div>
                      </div>
                    </div>
                  </div>
                </form>
                <div id="accordion">
                  <div class="accordion-wrapper">
                    <div class="accordion" id="accordionExample">
                      {getCorte()}
                    </div>
                  </div>
                </div>
              </div>

              <aside class="col-12 col-lg-4 mt-5 mt-lg-0">
                {/* <div class="bg-light shadow-sm rounded-lg px-4 pt-4 pb-3">
                  <div class="card card-simple panel-list-link">
                    <div class="card-body">
                      <h3 class="card-title">Accesos</h3>

                          <br></br>
                      
                          <button className="btn btn-primary btn-block" style={{ marginBottom: "6px" }} type="submit" id="descargar-boletin">Información Normativa</button>
                      
                          <button className="btn btn-primary btn-block" style={{ marginBottom: "6px" }} type="submit" id="descargar-separata">Acceso a TAD</button>
                          
                    </div>
                    //{datos && datos.length > 0 && datos[0].archivoBoletin &&
                      <div class="list-link">
                        <h4 class="list-link-item-title">Descargas Boletín</h4>
                        <button type="button" class="btn btn-secondary btn-sm download-link card-link" onClick={() => traerDocumento(datos[0].archivoBoletin)}>
                          Descargar Boletín del día
                        </button>
                      </div>
                    //}
                  </div>
                </div> */}

                <div class="bg-light shadow-sm rounded-lg px-4 pt-4 pb-3 mt-4">
                  <div class="card card-simple panel-list-link">
                    <div class="card-body">
                      <h3 class="card-title">Buscador Histórico</h3>
                    </div>
                    <div class="list-link">
                      <label for="fechaDesde">Ir a la Fecha</label>
                      <input
                        type="date"
                        className={"form-control "}
                        id="fechaDesde"
                        name="fechaDesde"
                        aria-describedby="date-help"
                        onChange={e => setFechaPublicacion(e.target.value)} value={fechaPublicacion}
                      />
                      <button type="button" class="btn btn-primary mt-4" onClick={() => { buscarBoletinPorFecha() }}>Buscar</button>
                    </div>
                  </div>
                </div>

                <div class="bg-light shadow-sm rounded-lg px-4 pt-4 pb-3 mt-4">
                  <div class="card card-simple panel-list-link">
                    <div class="card-body">
                      <h3 class="card-title">Buscador por Número</h3>
                    </div>
                    <div class="list-link">
                      <label for="numero">Número de Boletín</label>
                      <input
                        type="text"
                        className={"form-control "}
                        id="numero"
                        name="numero"
                        aria-describedby="date-help"
                        value={numeroBoletin}
                        onChange={(e) => setNumeroBoletin(e.target.value)}
                      />
                      <button type="button" class="btn btn-primary mt-4" onClick={() => { buscarBoletinPorNumero() }}>Buscar</button>
                    </div>
                  </div>
                </div>

                <div class="bg-light shadow-sm rounded-lg px-4 pt-4 pb-3 mt-4">
                  <div class="card card-simple panel-list-link">
                    <div class="card-body">
                      <h3 class="card-title">Busqueda Avanzada</h3>
                    </div>
                    <div class="list-link" style={{ textAlignLast: "center" }}>
                      <Link class="btn btn-primary mt-4" to="/busqueda-avanzada" type="button" preventScrollReset={true}><span>Ir a busqueda avanzada</span></Link>
                    </div>
                    <br></br>
                  </div>
                </div>
              </aside>

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

export default BoletinOficialDefault;
