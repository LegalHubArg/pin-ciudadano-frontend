import React, { useEffect, useState } from "react";
import Header from './Layout/Header'
import Footer from './Layout/Footer'
import { useParams } from "react-router-dom";
import Spinner from '../Components/Spinner/Spinner'
import moment from "moment";
import { ApiComunicator } from "../Helpers/ApiComunicator";

const DigestoDetalle = props => {
  const { idNorma } = useParams();
  const [norma, setNorma] = useState()
  const [loading, setLoading] = useState(false)

  const getNorma = async () => {
    setLoading(true)
    try {
      let request = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNorma: idNorma })
      }
      const results = await ApiComunicator('/api/v1/dj/norma', request)
        .then((res) => res.json())
      setNorma(results.data[0])
      setLoading(false)
    }
    catch (e) {
      setLoading(false)
    }
  }
  useEffect(async () => { await getNorma() }, [])

  if (loading) return <Spinner />
  else return (
    <>
      <Header></Header>
      <main>
        <article class="pb-5">
          <div class="container mb-5">
            <div class="row">
              <div class="col-12">
                <h2 class="card-title">Digesto G.C.B.A. - Detalle de la Norma</h2>
                <p>Digesto Jurídico de la Ciudad Autónoma de Buenos Aires consolidado por Ley Nº 6.017 al 28 de febrero de 2018.</p>
                <div class="card">
                  <div class="card-body">
                    <div class="card-title">
                      <b>Datos de la norma</b>
                    </div>
                    <br />
                    <p>
                      <b>{norma?.normaTipo}&nbsp;{norma?.normaNumero}&nbsp;Año&nbsp;{norma?.normaAnio}</b>
                    </p>
                    <p>
                      Sancionada el {norma?.fechaSancion ? moment(norma.fechaSancion).format('DD/MM/YYYY') : null}
                    </p>
                    {/* <p>
                      Publicada en el Boletín Oficial del 13/01/2015 <b>Número: 4557</b> Página: 14
                    </p> */}
                    {norma?.temasGenerales && <>
                      <p>
                        <b>Temas generales: </b>
                      </p>
                      <p>
                        {norma.temasGenerales}
                      </p>
                    </>}
                    <p>
                      Estado: {!!(norma?.vigente) ? <b style={{ color: "green" }}>Vigente</b> : <b style={{ color: "darkred" }}>No Vigente</b>}
                    </p>
                    {/* <p>
                      Ir al Texto consolidado 2018
                    </p>
                    <p>
                      <b>Ver modificaciones posteriores al 28 de febrero de 2018 en el Servicio de Información Normativa</b>
                    </p>
                    <p>
                      Ir al Texto consolidado 2016
                    </p> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>
    </>
  );
};

export default DigestoDetalle;