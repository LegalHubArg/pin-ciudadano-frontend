import React, { useEffect, useState } from "react";
import HeaderInfoNormativa from './Layout/HeaderInfoNormativa'
import Footer from './Layout/Footer'
import moment from 'moment'
import Spinner from '../Components/Spinner/Spinner'
import { ApiComunicator } from "../Helpers/ApiComunicator";
//HTML decode
import { decode } from 'html-entities';
import { FaEye, FaTimes, FaTrashAlt } from "react-icons/fa";

const SDINBusqueda = () => {
  const [loading, setLoading] = useState(false)
  const [loadingResultados, setLoadingResultados] = useState(false)
  const [resultados, setResultados] = useState()
  const [tiposNorma, setTiposNorma] = useState()
  const [organismos, setOrganismos] = useState()
  const [alcances, setAlcances] = useState()
  const [clases, setClases] = useState()
  const [estados, setEstados] = useState()
  const [gestiones, setGestiones] = useState()
  const [filtros, setFiltros] = useState(false)
  const [stateSumario, setStateSumario] = useState(false)
  const [stateContenido, setStateContenido] = useState(false)
  const [tematicas, setTematicas] = useState([])
  const [ramas, setRamas] = useState([])
  const [dependencias,setDependencias] = useState([])
  const [paginacion, setPaginacion] = useState({
    paginaActual: 1,
    limite: 15,
    totalPaginas: 1,
    cambiarPagina: false
  })
  const initForm = {
    fechaPublicacionDesde: '',
    fechaPublicacionHasta: '',
    fechaSancionDesde: '',
    fechaSancionHasta: '',
    idNormaTipo: null,
    idClase: null,
    normaNumero: '',
    normaAnio: '',
    texto: '',
    textoSumario: '',
    textoContenido: '',
    textoSum: '',
    textoCont: '',
    sinSumario: '',
    sinContenido: '',
    alcance: '',
    idOrganismo: null,
    //idDependencia:null,
    idGestion: null,
    estado: null,
    textoConsolidado: false,
    textoActualizado: false,
    tematica: null,
    tematicaNombre: '',
    rama: '',
    textoBO: '',
    dependencias: { dependencias: [] }
  }
  const [form, setForm] = useState(initForm)
  console.log("form",form)
  
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
      case 'fechaSancionDesde':
        value = e.target.value;
        setForm({ ...form, fechaSancionDesde: value })
        break;
      case 'fechaSancionHasta':
        value = e.target.value;
        setForm({ ...form, fechaSancionHasta: value })
        break;
      case 'idNormaTipo':
        value = parseInt(e.target.value);
        if (isNaN(value)) {
          setForm({ ...form, idNormaTipo: null })
          break;
        }
        setForm({ ...form, idNormaTipo: value })
        break;
      case 'idOrganismo':
        value = parseInt(e.target.value);
        if (isNaN(value)) {
          setForm({ ...form, idOrganismo: null })
          break;
        }
        setForm({ ...form, idOrganismo: value })
        break;
      /* case 'idDependencia':
        value = parseInt(e.target.value)
        if (isNaN(value)) {
          setForm({ ...form, idDependencia: null })
          break;
        }
        setForm({...form, idDependencia: value})
        break; */
      case 'dependencias':
        value = parseInt(e.target.value);
        if (isNaN(value)) {
          break;
        }
        setForm({
          ...form,
          ['dependencias']: { dependencias: [...form.dependencias.dependencias, value] }
        })
        break;
      case 'normaNumero':
        value = parseInt(e.target.value);
        if (isNaN(value)) {
          setForm({ ...form, normaNumero: null })
          break;
        }
        setForm({ ...form, normaNumero: value })
        break;
      case 'normaAnio':
        value = parseInt(e.target.value);
        if (isNaN(value)) {
          setForm({ ...form, normaAnio: null })
          break;
        }
        setForm({ ...form, normaAnio: value })
        break;
      case 'texto':
        value = String(e.target.value);
        setForm({ ...form, texto: value })
        break;
      case 'textoSumario':
        value = String(e.target.value);
        setForm({ ...form, textoSumario: value })
        break;
      case 'textoContenido':
        value = String(e.target.value);
        setForm({ ...form, textoContenido: value })
        break;
      case 'textoSum':
        value = String(e.target.value);
        setForm({ ...form, textoSum: value })
        break;
      case 'textoCont':
        value = String(e.target.value);
        setForm({ ...form, textoCont: value })
        break;
      case 'sinSumario':
        value = String(e.target.value);
        setForm({ ...form, sinSumario: value })
        break;
      case 'sinContenido':
        value = String(e.target.value);
        setForm({ ...form, textoCont: value })
        break;
      case 'alcance':
        value = e.target.value;
        setForm({ ...form, alcance: value })
        break;
      case 'idClase':
        value = parseInt(e.target.value);
        if (isNaN(value)) {
          setForm({ ...form, idClase: null })
          break;
        }
        setForm({ ...form, idClase: value })
        break;
      case 'estado':
        value = parseInt(e.target.value);
        if (isNaN(value)) {
          setForm({ ...form, estado: null })
          break;
        }
        setForm({ ...form, estado: value })
        break;
      case 'gestion':
        value = parseInt(e.target.value);
        if (isNaN(value)) {
          setForm({ ...form, idGestion: null })
          break;
        }
        setForm({ ...form, idGestion: value })
        break;
      case 'textoActualizado':
        value = e.target.checked;
        setForm({
          ...form,
          textoActualizado: value
        })
        break;
      case 'textoConsolidado':
        value = e.target.checked;
        setForm({
          ...form,
          textoConsolidado: value
        })
        break;
      case 'tematica':
        const valor = e.target.value;
        // devuelve los elementos del option y busca en el datalist con id=opcionesBusqueda
        const tema = document.querySelector(`#opcionesBusqueda option[value="${valor}"]`);
        
        if (tema) {
          // obtiene el idTema del elemento data-idtema como string y con el parse lo transformo en entero
          const idTema = parseInt(tema.getAttribute('data-idtema'));
          setForm({ ...form, tematica: idTema, tematicaNombre: valor });
        } else {
          // setea el form cuando se borra el tema elegido para elegir otro
          setForm({ ...form, tematica: null, tematicaNombre: valor });
        }
        break;
      case 'rama':
        value = String(e.target.value);
        setForm({ ...form, rama: value })
        break;
      case 'textoBO':
        value = String(e.target.value);
        setForm({ ...form, textoBO: value })
        break;
    }
  }

  useEffect(async () => {
    if (paginacion.cambiarPagina === true) {
      let auxPaginacion = paginacion;
      auxPaginacion.cambiarPagina = false;
      setPaginacion({ ...auxPaginacion })
      await buscar()
    }
  }, [paginacion])

  function cambiarPagina(e, page) {
    e.preventDefault();
    if (page < 1 || page > paginacion.totalPaginas) return;
    let auxPaginacion = paginacion;
    auxPaginacion.paginaActual = page;
    auxPaginacion.cambiarPagina = true;
    setPaginacion({ ...auxPaginacion })
  }

  async function getTiposNormas() {
    const tipos = await ApiComunicator('/api/v1/sdin/tipos-normas', { method: "GET" })
      .then(res => res.json())
    setTiposNorma(tipos.data)
  }

  async function getOrganismos() {
    const orgs = await ApiComunicator('/api/v1/sdin/organismos', { method: "GET" })
      .then(res => res.json())
    setOrganismos(orgs.data)
  }

  async function getDependencias(){
    const dep = await ApiComunicator('/api/v1/sdin/dependencias',{method:"GET"})
      .then(res=>res.json())
      setDependencias(dep.data)
  }

  async function getAlcances() {
    const alcances = await ApiComunicator('/api/v1/sdin/alcances', { method: "GET" })
      .then(res => res.json())
    setAlcances(alcances.data)
  }

  async function getClases() {
    const clases = await ApiComunicator('/api/v1/sdin/clases', { method: "GET" })
      .then(res => res.json())
    setClases(clases.data)
  }

/*   async function getEstados() {
    const estados = await ApiComunicator('/api/v1/sdin/estados', { method: "GET" })
      .then(res => res.json())
    setEstados(estados.data)
  } */

  async function getGestiones() {
    const gestiones = await ApiComunicator('/api/v1/sdin/gestion', { method: "GET" })
      .then(res => res.json())
    setGestiones(gestiones.data)
  }
  
  const buscar = async (e) => {
    setLoadingResultados(true)
    let body = { ...paginacion, ...form }
    if (e) {
      //Si llega el evento es porque viene del boton de buscar
      e.preventDefault();
      //Seteo la paginacion a su valor inicial pero con cambiarPagina en true para que entre en el hook de efecto
      setPaginacion({ paginaActual: 1, limite: 15, totalPaginas: 1, cambiarPagina: true })
      return; // retorno, porque cuando se dispare el hook, va a llegar a esta funcion pero sin el evento
    };
    const normas = await ApiComunicator('/api/v1/sdin/normas', { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then((res) => res.json())
    setResultados(normas.data)
    setLoadingResultados(false)
    let auxPaginacion = { ...paginacion };
    auxPaginacion.totalPaginas = Math.ceil(normas.data.totalNormas / auxPaginacion.limite);
    setPaginacion({ ...auxPaginacion });
    document.getElementById('tabla-resultados').scrollIntoView({ behavior: "smooth" });
  }

  const getRamas = async () => {
    const results = await ApiComunicator('/api/v1/dj/ramas', { method: "GET" })
      .then((res) => res.json())
    setRamas(results.data)
  }

  const getTemas = async () => {
    const results = await ApiComunicator('/api/v1/dj/temas', { method: "GET" })
      .then((res) => res.json())
    setTematicas(results.data)
  }

  useEffect(async () => {
    setLoading(true)
    await getTiposNormas()
    await getOrganismos()
    await getDependencias()
    await getAlcances()
    await getClases()
/*     await getEstados() */
    await getGestiones()
    await getRamas()
    await getTemas()
    setLoading(false)
  }, [])

  if (loading) return <Spinner />
  else return (
    <>
      <main>
        <HeaderInfoNormativa></HeaderInfoNormativa>
        <article class="pb-5">
          <div class="container mb-5">
            <div class="row">
              <div class="col-12">
                <h2 class="card-title">Servicio de Información Normativa</h2>
                <div class="form-wrapper">
                  <form class="form" onSubmit={(e) => buscar(e)}>
                    <div className="row">
                      <div class="form-group col-6">
                        <label class="form-label">Tipo de norma</label>
                        <select class="custom-select" id="idNormaTipo" name="idNormaTipo"
                          value={form.idNormaTipo ? form.idNormaTipo : null} onChange={(e) => handleForm(e)}>
                          <option selected value={null}></option>
                          {tiposNorma && (tiposNorma.length > 0) ? (
                            tiposNorma.map((p, index) => (
                              <option value={p.idNormaTipo} key={'opt-sec-' + index}>{decode(p.normaTipo)}</option>
                            ))

                          ) : (<option selected disabled>No hay tipos de norma</option>)
                          }
                        </select>
                      </div>
                      <div class="form-group col-3">
                        <label class="form-label">Número</label>
                        <input
                          type="number"
                          class="form-control input-text"
                          id="normaNumero"
                          name="normaNumero"
                          onChange={(e) => handleForm(e)} value={form.normaNumero}
                        />
                      </div>
                      <div class="form-group col-3">
                        <label class="form-label">Año de la norma</label>
                        <input
                          type="text"
                          class="form-control input-text"
                          placeholder="Ej: 17"
                          id="normaAnio"
                          name="normaAnio"
                          onChange={(e) => handleForm(e)} value={form.normaAnio}
                          maxlength="2" 
                          onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ""))}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div class="form-group col-6">
                        <label class="form-label">Organismo emisor</label>
                        <select class="custom-select" id="idOrganismo" name="idOrganismo"
                          value={form.idOrganismo ? form.idOrganismo : null} onChange={(e) => handleForm(e)}>
                          <option selected value={null}></option>
                          {organismos && (organismos.length > 0) ? (
                            organismos.map((p, index) => (
                              <option value={p.idOrganismo} key={'opt-sec-' + index}>{p.sigla} - {decode(p.organismo)}</option>
                            ))

                          ) : (<option selected disabled>No hay organismos</option>)
                          }
                        </select>
                      </div>
                      {/* <div className="form-group col-3">
                          <label className="form-label">Dependencias</label>
                          <select class="custom-select" id="idDepencenia" name="idDependencia"
                          value={form.idDependencia ? form.idDependencia : null} onChange={(e) => handleForm(e)}>
                          <option selected value={null}></option>
                          {dependencias && (dependencias.length > 0) ? (
                            dependencias.map((p, index) => (
                              <option value={p.idDependencia} key={'opt-sec-' + index}>{decode(p.dependencia)}</option>
                            ))

                          ) : (<option selected disabled>No hay organismos</option>)
                          }
                        </select>
                      </div> */}
                      <div className="form-group col-3">
                        <label for="">Dependencias</label>
                        <select className="custom-select" id="dependencias" name="dependencias"
                          onChange={e => handleForm(e)} value={form.dependencias.dependencias}><option selected value="" hidden />
                          {dependencias && (dependencias.length > 0) ? (
                            dependencias.filter((dep) => !(form.dependencias.dependencias.includes(dep.idDependencia))).map(
                              (p, index) => (
                                <option value={p.idDependencia} key={'opt-sec-' + index}>{p.sigla + ' - ' + decode(p.dependencia)}</option>
                              ))

                          ) : (<option selected disabled>No hay dependencias para mostrar</option>)
                          }
                        </select>
                      </div>
                      <div className="card col-3">
                        {form.dependencias && form.dependencias.dependencias.map((elem) =>
                          <span className="badge badge-info">
                            {dependencias.find((dep) => dep.idDependencia === elem).sigla}&nbsp;
                            <FaTimes color='#C93B3B' type='button'
                              onClick={() => setForm({
                                ...form,
                                ['dependencias']: { dependencias: [...form.dependencias.dependencias.filter(n => n !== elem)] }
                              })} />
                          </span>
                        )}
                      </div>
                    </div>
                    <div class="form-group">
                      {/* <a href="" onClick={() => {setFiltros(!filtros);}}><label>Más filtros</label></a> */}
                      <button
                        type="button"
                        class="btn btn-outline-link"
                        onClick={() => {
                          setFiltros(!filtros)
                        }}
                      >
                        {!filtros ? 'Más filtros' : 'Menos filtros'}
                      </button>
                    </div>
                    {filtros ? (
                      <div>
                        <div className="row">
                          <div class="form-group col-3" style={{ alignSelf: "center" }}>
                            <input
                              type="checkbox"
                              id="textoConsolidado"
                              name="textoConsolidado"
                              defaultChecked={form.textoConsolidado} onChange={e => handleForm(e)}
                            >
                            </input>&nbsp;&nbsp;
                            <label for="textoConsolidado" class="form-label">Texto consolidado</label>
                          </div>
                          <div class="form-group col-3" style={{ alignSelf: "center" }}>
                            <input
                              type="checkbox"
                              id="textoActualizado"
                              name="textoActualizado"
                              defaultChecked={form.textoActualizado} onChange={e => handleForm(e)}
                            >
                            </input>&nbsp;&nbsp;
                            <label for="textoActualizado" class="form-label">Texto actualizado</label>
                          </div>
                          <div class="form-group col-2">
                            <label class="form-label" for="clase">Clase</label>
                            <select class="custom-select" id="idClase" name="idClase"
                              value={form.idClase ? form.idClase : null} onChange={(e) => handleForm(e)}>
                              <option selected value={null}></option>
                              {clases && (clases.length > 0) ? (
                                clases.map((p, index) => (
                                  <option value={p.idClase} key={'opt-sec-' + index}>{decode(p.clase)}</option>
                                ))

                              ) : (<option selected disabled>No hay clases</option>)
                              }
                            </select>
                          </div>
                          <div class="form-group col-2">
                            <label class="form-label" for="estado">Estado</label>
                            <select class="custom-select" id="estado" name="estado"
                              value={(form.estado === 4 || form.estado === 1) ? form.estado : null} onChange={(e) => handleForm(e)}>
                              <option selected value={null}>Todas</option>
                              <option value={1}>Vigentes</option>
                              <option value={4}>No vigentes</option>
                            </select>
                          </div>
                          <div class="form-group col-2">
                            {/* <label class="form-label" for="digesto">Digesto</label>
                            <select class="custom-select" id="digesto" name="digesto" disabled>
                              <option selected value=""></option>
                            </select> */}
                          </div>
                        </div>
                        <div className="row">
                          <div class="form-group col-12">
                            <label class="form-label" for="gestion">Gestión</label>
                            <select class="custom-select" id="gestion" name="gestion"
                              value={form.idGestion ? form.idGestion : null} onChange={(e) => handleForm(e)}>
                              <option selected value={null}></option>
                              {gestiones && (gestiones.length > 0) ? (
                                gestiones.map((p, index) => (
                                  <option value={p.idGestion} key={'opt-sec-' + index}>{decode(p.nombre)}</option>
                                ))

                              ) : (<option selected disabled>No hay gestiones</option>)
                              }
                            </select>
                          </div>
                        </div>
                      </div>
                    ) : (null)}
                    <div class="form-group">
                      <label>Fecha de sanción</label>
                    </div>
                    <div className="row">
                      <div class="form-group col-6">
                        <label class="form-label">Desde</label>
                        <input
                          type="date"
                          class="form-control input-date"
                          id="fechaSancionDesde"
                          name="fechaSancionDesde"
                          onChange={(e) => handleForm(e)} value={form.fechaSancionDesde}
                        />
                      </div>
                      <div className="form-group col-6">
                        <label class="form-label">Hasta</label>
                        <input
                          type="date"
                          class="form-control input-date"
                          min={form.fechaSancionDesde}
                          id="fechaSancionHasta"
                          name="fechaSancionHasta"
                          onChange={(e) => handleForm(e)} value={form.fechaSancionHasta}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Fecha de publicacion</label>
                    </div>
                    <div className="row">
                      <div class="form-group col">
                        <label class="form-label">Desde</label>
                        <input
                          type="date"
                          class="form-control input-date"
                          id="fechaPublicacionDesde"
                          name="fechaPublicacionDesde"
                          onChange={(e) => handleForm(e)} value={form.fechaPublicacionDesde}
                        />
                      </div>
                      <div className="form-group col">
                        <label class="form-label">Hasta</label>
                        <input
                          type="date"
                          class="form-control input-date"
                          min={form.fechaPublicacionDesde}
                          id="fechaPublicacionHasta"
                          name="fechaPublicacionHasta"
                          onChange={(e) => handleForm(e)} value={form.fechaPublicacionHasta}
                        />
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Alcance</label>
                      <select class="custom-select" id="alcance" name="alcance" onChange={(e) => handleForm(e)} value={form.alcance}>
                        <option selected value={null}></option>
                        {alcances && (alcances.length > 0) ? (
                          alcances.map((p, index) => (p.idAlcance === 1 || p.idAlcance === 2) ? (
                            <option value={p.sigla} key={'opt-sec-' + index}>{p.alcance}</option>
                          ) : null)

                        ) : (<option selected disabled>No hay alcances</option>)
                        }
                      </select>
                    </div>
                    {filtros ? (
                      <div>
                        <div class="form-group">
                          <label class="form-label" title="TEXTO DE LA NORMA DESDE BOLETÍN OFICIAL">Con las palabras</label>
                          <input
                            type="text"
                            class="form-control input-text"
                            id="textoBO"
                            name="textoBO"
                            placeholder="Palabras que vienen de la norma desde Boletín Oficial..."
                            onChange={(e) => handleForm(e)} value={form.textoBO}
                          />
                        </div>
                        <div class="form-group">
                          <label>Búsqueda Avanzada</label>
                        </div>
                        <div className="row">
                          <div class="form-group col-2" style={{ alignSelf: "center" }}>
                            <input
                              type="checkbox"
                              id="sumario"
                              onClick={() => {
                                setStateSumario(!stateSumario);
                                if (stateContenido) {
                                  setStateContenido(false);
                                }
                              }}
                              checked={stateSumario}>
                            </input>&nbsp;&nbsp;
                            <label for="sumario" class="form-label">Sumario</label>
                          </div>
                          <div class="form-group col-2" style={{ alignSelf: "center" }}>
                            <input
                              type="checkbox"
                              id="contenido"
                              onClick={() => {
                                setStateContenido(!stateContenido);
                                if (stateSumario) {
                                  setStateSumario(false);
                                }
                              }}
                              checked={stateContenido}>
                            </input>&nbsp;&nbsp;
                            <label for="contenido" class="form-label">Contenido</label>
                          </div>
                        </div>
                        {stateSumario && !stateContenido ? (
                          <div class="form-group">
                            <div class="form-group col-15">
                              <label class="form-label" for="textoSumario">Frase Exacta</label>
                              <div class="form-wrapper">
                                <div class="form-group">
                                  <div class="form-wrapper">
                                    <div class="form-group">
                                      <input
                                        type="text"
                                        class="form-control input-text"
                                        id="textoSumario"
                                        name="textoSumario"
                                        placeholder="Ingrese la frase exacta..."
                                        onChange={(e) => handleForm(e)}
                                        value={form.textoSumario} 
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="form-group col-15">
                              <label class="form-label" for="sinSumario">Sin Palabras</label>
                              <div class="form-wrapper">
                                <div class="form-group">
                                  <div class="form-wrapper">
                                    <div class="form-group">
                                      <input
                                        type="text"
                                        class="form-control input-text"
                                        id="sinSumario"
                                        name="sinSumario"
                                        placeholder="Ingrese las palabras que desea evitar..."
                                        onChange={(e) => handleForm(e)}
                                        value={form.sinSumario} 
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="form-group col-15">
                              <label class="form-label" for="textoSum">Con alguna de las palabras</label>
                              <div class="form-wrapper">
                                <div class="form-group">
                                  <input
                                    type="text"
                                    class="form-control input-text"
                                    id="textoSum"
                                    name="textoSum"
                                    placeholder="Ingrese las palabras..."
                                    onChange={(e) => handleForm(e)}
                                    onKeyDown={(e) => {     //esto es por si seria un filtrado por una unica
                                      if (e.key === ' ') {  //palabra, para que el usuario no pueda ingresar
                                        e.preventDefault(); //espacios
                                      }
                                    }}
                                    value={form.textoSum}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (null)}
                        {stateContenido && !stateSumario ? (
                          <div class="form-group">
                            <div class="form-group col-15">
                              <label class="form-label" for="textoContenido">Frase Exacta</label>
                              <div class="form-wrapper">
                                <div class="form-group">
                                  <div class="form-wrapper">
                                    <div class="form-group">
                                      <input
                                        type="text"
                                        class="form-control input-text"
                                        id="textoContenido"
                                        name="textoContenido"
                                        placeholder="Ingrese la frase exacta..."
                                        onChange={(e) => handleForm(e)}
                                        value={form.textoContenido}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="form-group col-15">
                              <label class="form-label" for="sinContenido">Sin Palabras</label>
                              <div class="form-wrapper">
                                <div class="form-group">
                                  <div class="form-wrapper">
                                    <div class="form-group">
                                      <input
                                        type="text"
                                        class="form-control input-text"
                                        id="sinContenido"
                                        name="sinContenido"
                                        placeholder="Ingrese las palabras que desea evitar..."
                                        onChange={(e) => handleForm(e)}
                                        value={form.sinContenido}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="form-group col-15">
                              <label class="form-label" for="textoCont">Con alguna de las palabras</label>
                              <div class="form-wrapper">
                                <div class="form-group">
                                  <input
                                    type="text"
                                    class="form-control input-text"
                                    id="textoCont"
                                    name="textoCont"
                                    placeholder="Ingrese las palabras..."
                                    onChange={(e) => handleForm(e)}
                                    onKeyDown={(e) => {     //esto es por si seria un filtrado por una unica
                                      if (e.key === ' ') {  //palabra, para que el usuario no pueda ingresar
                                        e.preventDefault(); //espacios
                                      }
                                    }}
                                    value={form.textoCont}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (null)}
                        <div className="row">
                          <div class="form-group col-3">
                            <label class="form-label" for="tematica">Búsqueda temática Digesto</label>
                            <input
                              type="text"
                              class="form-control input-text" 
                              id="tematica" 
                              name="tematica"
                              onChange={(e) => handleForm(e)}
                              value={form.tematicaNombre}
                              list="opcionesBusqueda"
                            />
                            <datalist id="opcionesBusqueda">
                              <option value={null}></option>
                              {tematicas && (tematicas.length > 0) ? (
                                tematicas.map((n, index) => (
                                  <option value={decode(n.tema)} data-idtema={n.idTema} key={'opt-sec-' + index}></option>
                                ))
                              ) : (<option selected disabled>No hay temas</option>)}
                            </datalist>
                          </div>
                          <div class="form-group col-1" style={{ alignSelf: "center" }}>
                            {/* <button style={{ height: "50px" }} class="btn btn-primary btn-lg btn-icon" disabled>
                              <i class="bx bxs-search"></i>
                            </button> */}
                          </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          <div class="form-group col-3">
                            <label class="form-label" for="rama">Rama Digesto</label>
                            <input 
                              type="text"
                              class="form-control input-text" 
                              id="rama" 
                              name="rama"
                              onChange={(e) => handleForm(e)}
                              value={form.rama}
                              list="opcionesRamas"
                            />
                            <datalist id="opcionesRamas">
                              <option value={null}></option>
                              {ramas && (ramas.length > 0) ? (
                                ramas.map((n, index) => (
                                  <option value={n.rama} key={'opt-sec-' + index}>{n.rama}</option>
                                ))
                              ) : (<option selected disabled>No hay ramas</option>)}
                            </datalist>
                          </div>
                          <div class="form-group col-1" style={{ alignSelf: "center" }}>
                            {/* <button style={{ height: "50px" }} class="btn btn-primary btn-lg btn-icon" disabled>
                              <i class="bx bxs-search"></i>
                            </button> */}
                          </div>
                        </div>
                        {/* <div class="form-group">
                          <label class="form-label">Relación</label>
                          <input
                            type="text"
                            class="form-control input-text"
                            id="name-input"
                            name="name" disabled
                          />
                        </div> */}
                        <br/>
                      </div>
                    ) : (null)}
                    <button type="submit" class="btn btn-primary">Buscar</button>
                    <button type="button" class="btn btn-secondary ml-2" onClick={() => setForm(initForm)}>Limpiar</button>
                  </form>
                </div>
                {loadingResultados ? <Spinner /> :
                  (resultados && resultados.normas && <>
                  <span>Total de resultados: {resultados?.totalNormas || 0}</span>
                    <table className="table table-hover mt-3" id="tabla-resultados">
                      <thead>
                        <tr>
                          <th>Norma</th>
                          <th>Año</th>
                          <th>Fecha de publicación</th>
                          <th>Fecha de Sanción</th>
                          <th>Dependencia</th>
                          <th>Organismo</th>
                          <th>Síntesis</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultados.normas.map(n =>
                          <tr>
                            <td><a href={"sdin-busqueda/norma/" + n.idNormaFront}>{decode(n.normaTipo)}&nbsp;N°{n.normaNumero}</a></td>
                            <td>{n.fechaSancion ? moment(n.fechaSancion).format('YY') : null}</td>
                            <td>{n.fechaPublicacion ? moment(n.fechaPublicacion).format('DD/MM/YYYY') : null}</td>
                            <td>{n.fechaSancion ? moment(n.fechaSancion).format('DD/MM/YYYY') : null}</td>
                            <td>{decode(n.dependencia)}</td>
                            <td>{decode(n.organismo)}</td>
                            <td>{decode(n.normaSumario)}</td>
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
                     
                    </div>
                  </>)
                }
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer></Footer>
    </>
  );
};

export default SDINBusqueda;
