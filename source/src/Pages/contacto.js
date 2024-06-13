import React, { useState, useEffect } from "react";
import Header from './Layout/Header'
import Footer from './Layout/Footer'
import { ApiComunicator } from "../Helpers/ApiComunicator";
import Spinner from "../Components/Spinner/Spinner";

const Contacto = () => {

  const [loading, setLoading] = useState()
  const [contenido, setContenido] = useState()
  const contacto = {
    seccion: 'bo_contacto'
  }

  async function getContenido() {
    let body = { ...contacto }
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
  <Header></Header>
  <main>
    <article class="pb-5">
      <div class="container pt-4 mb-5">
        <div class="bg-light shadow-sm rounded-lg px-4 pt-4 pb-3">

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
      </div>
    </article>
  </main>
<Footer></Footer>
    </>
  );
};

export default Contacto;
