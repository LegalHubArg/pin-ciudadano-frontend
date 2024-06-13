import { FaEye } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import HeaderInfoNormativa from '../Pages/Layout/HeaderInfoNormativa'
import Footer from './Layout/Footer'
import { useParams, useNavigate } from "react-router-dom";
import Spinner from '../Components/Spinner/Spinner'
import moment from "moment";
import { FaRegWindowRestore } from "react-icons/fa";
import { ApiComunicator } from "../Helpers/ApiComunicator";
//HTML decode
import { decode } from 'html-entities';

var b64toBlob = require('b64-to-blob');

const SDINResultados = () => {

  const navigate = useNavigate();
  const { idNorma } = useParams();
  const [norma, setNorma] = useState()
  const [texto, setTexto] = useState()
  const [textoActualizado, setTextoActualizado] = useState()
  const [pdf, setPdf] = useState()
  const [loading, setLoading] = useState(false)
  const [relaciones, setRelaciones] = useState()
  const [imagenes, setImagenes] = useState([])
  const [temas, setTemas] = useState()
  const [iframe, setIframe] = useState('')
  const [loadingTexto, setLoadingTexto] = useState(false)



  const getNorma = async () => {
    setLoading(true)
    try {
      let request = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNorma: idNorma })
      }
      const results = await ApiComunicator('/api/v1/sdin/norma', request)
        .then((res) => res.json())
      
        if(results.data && results.data.length > 0) {
          setNorma(results.data[0])
          let requestS3 = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ archivoS3: results.data[0].archivoS3 })
          }
          await ApiComunicator('/api/v1/sdin/traer-archivo-sdin', requestS3)
            .then(res => res.json())
            .then(res => {
              let blob = b64toBlob(res.data, 'application/pdf')
              let blobUrl = URL.createObjectURL(blob)
              setIframe(blobUrl)
            })
        }
        
      setLoading(false)
    }
    catch (e) {
      setLoading(false)
    }
  }

  const getArchivoAntecedentes = async (s3) => {
    setLoading(true)

    try {
      let requestS3 = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archivoS3: s3 })
      }
      await ApiComunicator('/api/v1/dj/traer-archivo-digesto', requestS3)
        .then(res => res.json())
        .then(res => {
          let blob = b64toBlob(res.data, 'application/pdf')
          let blobUrl = URL.createObjectURL(blob);
          window.open(blobUrl)
        })
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  // const getArchivoAntecedentes = async () => {
  //   setLoading(true)
  //   try {
  //     if(norma && norma.antecedentes){ 
  //       let archivoAntecedentes = norma.antecedentes
  //       let archivoConsolidado = norma.archivoConsolidado

  //       let request = {
  //         method: "POST",
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ archivoAntecedentes: archivoAntecedentes, archivoConsolidado: archivoConsolidado })
  //       }

  //       await ApiComunicator('/api/v1/dj/traer-archivo', request)
  //         .then(res => res.json())
  //         .then(res => {
  //           let aux = []
  //           for (let i = 0; i < res.data.length; i++) {
  //             let antecedente = res.data[i]
  //             let blob = b64toBlob(antecedente, 'application/pdf')
  //             let blobUrl = URL.createObjectURL(blob);
  //             aux.push(blobUrl)
  //           }

  //           let ac = res.archivoConsolidado
  //           let blob = b64toBlob(ac, 'application/pdf')
  //           let blobUrlArchivoConsolidado = URL.createObjectURL(blob)


  //           setArchivoConsolidado(blobUrlArchivoConsolidado)
  //           setAntecedentes(aux)
  //           setLoading(false)
          
  //         })
  //     } else {
  //     setLoading(false)
  //   }
  //   } catch (error) {
  //     throw error
  //   }
  // }

  const traerRelaciones = async () => {
    setLoading(true)
    try {
      let request = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNorma: idNorma })
      }
      const results = await ApiComunicator('/api/v1/sdin/norma/relaciones', request)
        .then((res) => res.json())
      setRelaciones(results.data)
      setLoading(false)
    }
    catch (e) {
      setLoading(false)
    }
  }

  const traerImagenes = async () => {
    setLoadingTexto(true)
    try {
      let request = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNorma: idNorma })
      }
      const results = await ApiComunicator('/api/v1/sdin/norma/imagenes', request)
        .then((res) => res.json())
      setImagenes(results.data)
      setLoadingTexto(false)
    }
    catch (e) {
      setLoadingTexto(false)
    }
  }

  const traerTemas = async () => {
    setLoading(true)
    try {
      let request = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNorma: idNorma })
      }
      const results = await ApiComunicator('/api/v1/sdin/norma/temas', request)
        .then((res) => res.json())
      setTemas(results.data)
      setLoading(false)
    }
    catch (e) {
      setLoading(false)
    }
  }

  useEffect(async () => {
    await getNorma()
    await traerRelaciones()
    await traerTemas()
    await traerImagenes()
  }, [])

  if (loading) return <Spinner />
  else return (
    <>
      <HeaderInfoNormativa></HeaderInfoNormativa>
      <main>

        {norma && norma !== undefined && norma !== null && norma.length !== 0 ?
          <article class="pb-5">
            <div class="container mb-5">
              <div class="row">
                <div class="col-12">
                  <h2>{decode(norma?.normaTipo)}&nbsp;- N°&nbsp;{norma?.normaNumero}&nbsp;-&nbsp;{norma?.fechaSancion ? moment(norma.fechaSancion).format('YYYY') : null}</h2>
                  <hr></hr>
                  <div class="form-group">
                    <label>Síntesis:</label>
                  </div>
                  <p className="mb-3"
                    dangerouslySetInnerHTML={{ __html: decode(norma?.normaSumario?.toString()) }}>
                  </p>
                  <div class="form-group">
                    <label>Publicación:</label>
                  </div>
                  <p className="mb-3">
                    {norma?.fechaPublicacion ? moment(norma.fechaPublicacion).format('DD/MM/YYYY') : null}
                  </p>
                  <div class="form-group">
                    <label>Sanción:</label>
                  </div>
                  <p className="mb-3">
                    {norma?.fechaSancion ? moment(norma.fechaSancion).format('DD/MM/YYYY') : null}
                  </p>
                  <div class="form-group">
                    <label>Vigencia:</label>
                  </div>
                  <p className="mb-3">
                    {norma?.vigente? 'Vigente' : 'No Vigente'}
                  </p>
                  {norma?.vigente === 0 ?
                    <>
                      {norma?.esCausal === 1?
                      <>
                        <div class="form-group">
                          <label>Causal:</label>
                        </div>
                        <p className="mb-3">{norma?.causal}</p>
                      </>:
                      <>
                        <div class="form-group">
                          <label>Patología Normativa:</label>
                        </div>
                        <p className="mb-3">{norma?.patologia}</p>
                      </>}
                    </>:<></>}
                  {norma?.fechaPromulgacion ?
                    <>
                      <div class="form-group">
                        <label>Promulgación:</label>
                      </div>
                      <p className="mb-3">
                        {moment(norma.fechaPromulgacion).format('DD/MM/YYYY')}
                      </p>
                    </>
                    : <>
                    </>}
                  <div class="form-group">
                    <label>Organismo Emisor:</label>
                  </div>
                  <p className="mb-3">
                    {norma?.organismo ? decode(norma.organismo) : null}
                  </p>
                  {norma?.ramaCheck ?
                    <>
                      <div class="form-group">
                        <label>Rama:</label>
                      </div>
                      <p className="mb-3">
                        {decode(norma.rama)}
                      </p>
                    </>
                    : <>
                    </>}
                  <br />
                  <div id="accordion">
                    <div class="accordion-wrapper">
                      <div class="accordion" id="accordionExample">
                        {norma?.mig_filenet_publicado &&
                          <div className="card">
                            <button
                              className="card-header card-link mb-1 collapsed"
                              data-toggle="collapse"
                              data-target="#collapseOne"
                              type="button">
                              Publicación Boletín Oficial
                            </button>
                            <div className="collapse"
                              id="collapseOne"
                              data-parent="#accordion"
                              style={{
                                textAlignLast: "center",
                                marginTop: "30px",
                                marginBottom: "30px"
                              }}>
                              <a class="btn btn-link btn-lg"
                                onClick={() =>
                                  window.open(
                                    "/boletin-oficial/documentos/" +
                                    norma?.archivoPublicado,
                                    "_blank"
                                  )
                                }
                              >
                                Descargar
                              </a>
                            </div>
                          </div>
                        }
                        <div className="card">
                          <button
                            className="card-header card-link mb-1 collapsed"
                            data-toggle="collapse"
                            data-target="#collapseTwo"
                            type="button"
                            >
                            Texto Original</button>
                          <div className="collapse" id="collapseTwo" data-parent="#accordion" >
                            <div class="card-body">
                              {!loadingTexto ?
                              <div
                              dangerouslySetInnerHTML={{
                                __html: decode(norma?.textoOriginal?.toString()).replace(
                                  /<imagen([^>]*)>/g,
                                  (match) => {
                                    if (imagenes && imagenes.length > 0) {
                                      const index = parseInt(match.match(/\d+/)[0] - 1);
                                      if (!isNaN(index) && index < imagenes.length) {
                                        const orderedImages = imagenes.sort((a, b) => a.numero - b.numero);
                                        const image = orderedImages[index];
                                        return `<a href="/sdin-busqueda/norma/${norma.idNormaSDIN}/imagen/${image.numero}" target="_blank">Ver archivo ${image.numero}</a>`;
                                      }
                                    }
                                    return match;
                                  }
                                ).replace(
                                    /<a href="\/sdin\/[^"]+"/g,
                                    (match) => {
                                      const parts = match.split('"');
                                      const url = parts[1];
                                      return `<a href="${url.replace('/sdin/ficha-norma/', '/sdin-busqueda/norma/')}"`;
                                    }
                                  )
                                  .replace(/<documento>/g, '<documento style="line-height: 35px;">')
                                  .replace(/<consideraciones>|<considerando>/g, '<div>')
                                  .replace(/<\/consideraciones>|<\/considerando>/g, '</div>'),
                                }}
                            />
                            :
                            <Spinner />
                              }
                              
                            </div>
                          </div>
                        </div>
                        <div className="card">
                          <button
                            className="card-header card-link mb-1 collapsed"
                            data-toggle="collapse"
                            data-target="#collapseEight"
                            type="button">
                            Documento Original</button>

                          <div className="collapse" id="collapseEight" data-parent="#accordion" >
                            <div class="card-body">
                              <div style={{ height: "90%" }}>
                                {iframe !== '' ? <iframe className="doc-view" src={iframe} type="application/pdf" width="100%" height="800px">No document</iframe> : "No se encontró ningún documento para mostrar."}
                                {iframe !== '' ? <div className="btn btn-link btn-sm" maxWidth="200px" style={{ marginLeft: "1em" }} onClick={() => window.open(iframe)}>
                                  Abrir en pestaña nueva
                                  <FaRegWindowRestore style={{ marginLeft: "5px" }} />
                                </div> : null}
                              </div>
                            </div>
                          </div>
                        </div>
                        {(norma?.archivoConsolidado || norma?.antecedentes?.length > 0) ? (
                          <div className="card">
                            <button
                              className="card-header card-link mb-1 collapsed"
                              data-toggle="collapse"
                              data-target="#collapseSix"
                              type="button">
                              Texto Consolidado</button>
                            <div className="collapse" id="collapseSix" data-parent="#accordion" >
                              <div class="card-body">
                                <div class="body" style={{ height: '50px' }}>
                                  <p>
                                    <button className="btn btn-secondary" onClick={() => getArchivoAntecedentes(norma.ArchivoConsolidadoS3)}>Texto consolidado actual</button>
                                  </p>
                                </div>
                                {norma?.antecedentes && (norma?.antecedentes.length > 0) ? (
                                  <div class="body">
                                    <h4>
                                      <b>
                                        Antecedentes:
                                      </b>
                                    </h4>
                                    {norma.antecedentes.length > 0 && norma.antecedentes?.map(a => (
                                      <div class="body">
                                        <p>&nbsp;&nbsp;&nbsp;
                                          {/* <a target="_blank" href={a}>Texto Consolidado número {norma.antecedentes[0].anio}</a> */}
                                          <button className="btn btn-link" onClick={() => getArchivoAntecedentes(a.archivoS3)}>Ver documento {a.anio}</button>
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        ) : null}
                        {norma?.textoActualizado && <div className="card">
                          <button
                            className="card-header card-link mb-1 collapsed"
                            data-toggle="collapse"
                            data-target="#collapseFive"
                            type="button">
                            Texto Actualizado</button>
                          <div className="collapse" id="collapseFive" data-parent="#accordion" >
                            <div class="card-body">
                              <div
                                dangerouslySetInnerHTML={{ __html: decode(norma?.textoActualizado?.toString()) }}
                              />
                            </div>
                          </div>
                        </div>}

                        {norma?.archivoTextoActualizado && norma?.archivoTextoActualizadoS3 && <div className="card">
                          <button
                            className="card-header card-link mb-1 collapsed"
                            data-toggle="collapse"
                            data-target="#collapseSeven"
                            type="button">
                            Texto Actualizado Archivo</button>
                          <div id="collapseSeven" className="collapse" data-parent="#accordion" >
                            <div className="card-body">
                              <div style={{ height: "85%" }}>
                                <a href={norma.archivoTextoActualizadoURL} target="_blank" className="btn btn-secondary btn-sm download-link">{norma.archivoTextoActualizado}</a>
                              </div>
                            </div>
                          </div>
                        </div>}
                        {relaciones && relaciones.length > 0 ? <>
                          <div className="card">
                            <button
                              class="card-header collapsed card-link"
                              data-toggle="collapse"
                              data-target="#collapseThree">
                              Relaciones</button>
                            <div id="collapseThree" class="collapse" data-parent="#accordion">
                              <div class="card-body">
                                <div>
                                  {relaciones && relaciones.length > 0 ? <table class="table table-bordered table-hover" >
                                    <thead>
                                      <tr>
                                        <th scope="col">Tipo de Relación</th>
                                        <th scope="col">Norma Relacionada</th>
                                        <th scope="col">Detalle</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {relaciones.map((rel) => (
                                        <tr>
                                          <td>{rel.relacion}</td>
                                          <td><a href={rel.idNormaDestino}>{decode(rel.normaTipo)}&nbsp;N°{rel.normaNumero}</a></td>
                                          <td>{decode(rel.detalle)}</td>
                                        </tr>

                                      ))}
                                    </tbody>
                                  </table> : "No se encontraron relaciones para esta norma..."}
                                </div>
                              </div>
                            </div>
                          </div>
                        </> : <></>}
                        {temas && temas.length > 0 ? <>
                          <div className="card">
                            <button
                              class="card-header collapsed card-link"
                              data-toggle="collapse"
                              data-target="#collapseFour">
                              Temas</button>
                            <div id="collapseFour" class="collapse" data-parent="#accordion">
                              <div class="card-body">
                                <div>
                                  {temas && temas.length > 0 ? <table class="table table-bordered table-hover" >
                                    <thead>
                                      <tr>
                                        <th scope="col">Id</th>
                                        <th scope="col">Tema</th>
                                        <th scope="col">Descripción</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {temas.map((rel) => (
                                        <tr>
                                          <td>{rel.idTema}</td>
                                          <td dangerouslySetInnerHTML={{ __html: decode(rel.tema) }}></td>
                                          <td>{decode(rel.descripcion)}</td>
                                        </tr>

                                      ))}
                                    </tbody>
                                  </table> : "No se encontraron temas para esta norma..."}
                                </div>
                              </div>
                            </div>
                          </div>
                        </> : <></>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article >
          :
          <div class="container mb-5">
            <div className="alert alert-primary" role="alert">
              <p>No se encontraron resultados para esta norma.</p>
            </div>
          </div>
        }
      </main >
      <Footer></Footer>
    </>
  );
};

export default SDINResultados;