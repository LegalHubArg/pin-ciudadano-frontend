import React, { useState, useEffect } from "react";
import HeaderInfoNormativa from '../Layout/HeaderInfoNormativa'
import Footer from '../Layout/Footer'
import { ApiComunicator } from "../../Helpers/ApiComunicator";
import Spinner from "../../Components/Spinner/Spinner";

const ComoUtilizarlo = () => {

  const [loading, setLoading] = useState()
  const [contenido, setContenido] = useState()
  const comoUtilizarlo = {
    seccion: 'sdin_como_utilizarlo'
  }

  async function getContenido() {
    let body = { ...comoUtilizarlo }
    const contenido = await ApiComunicator('/api/v1/contenido', { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then((res) => res.json())
    setContenido(contenido.data)

  }

  useEffect(async () => {
    setLoading(true)
    await getContenido()
    setLoading(false)
  }, [])

  return (
    <>
  <HeaderInfoNormativa></HeaderInfoNormativa>
  <main>
    <article class="pb-5">
      <div class="container pt-4 mb-5">

      {contenido && contenido.length > 0 ? (
          contenido.map((p, index) => (
            <div
              key={p.idContenido}
              dangerouslySetInnerHTML={{ __html: p.contenido }}
            />
          ))
        ) : (
          null
      )}

      </div>
    </article>
  </main>
<Footer></Footer>
    </>
  );
};

export default ComoUtilizarlo;
