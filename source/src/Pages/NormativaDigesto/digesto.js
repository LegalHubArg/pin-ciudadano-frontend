import React, { useState, useEffect } from "react";
import HeaderInfoNormativa from '../Layout/HeaderInfoNormativa';
import Footer from '../Layout/Footer';
import { ApiComunicator } from "../../Helpers/ApiComunicator";
import Spinner from "../../Components/Spinner/Spinner";

const Digesto = () => {
  const [contenido, setContenido] = useState('')

  async function getContenido() {
    await ApiComunicator('/api/v1/contenido', { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ seccion: 'digesto' }) })
      .then((res) => res.json())
      .then((res) => setContenido(res.data[0].contenido))
  }

  useEffect(() => {
    getContenido()
  }, [])

  return (
    <>
      <HeaderInfoNormativa></HeaderInfoNormativa>
      <main>
        <article class="pb-5">
          <div class="container pt-4 mb-5">
            <h2>Digesto</h2>
            <hr></hr>
            <br></br>

            {contenido && <div dangerouslySetInnerHTML={{ __html: contenido }} />}

          </div>
        </article>
      </main>
      <Footer></Footer>
    </>
  );
};

export default Digesto;
