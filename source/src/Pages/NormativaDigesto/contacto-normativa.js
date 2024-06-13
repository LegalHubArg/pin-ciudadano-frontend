import React, { useState, useEffect } from "react";
import HeaderInfoNormativa from '../Layout/HeaderInfoNormativa'
import Footer from '../Layout/Footer'
import { ApiComunicator } from "../../Helpers/ApiComunicator";
import Spinner from "../../Components/Spinner/Spinner";

const ContactoNormativa = () => {

  const [loading, setLoading] = useState()
  const [contenido, setContenido] = useState()
  const contacto = {
    seccion: 'sdin_contacto'
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
  <HeaderInfoNormativa></HeaderInfoNormativa>
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
      <div class="container pt-4 mb-5">
        <div class="bg-light shadow-sm rounded-lg px-4 pt-4 pb-3">
          <h2>Formulario De Contacto</h2>
                
                <div class="form-group list-link">
                  <label for="nombre">Nombre</label>
                  <input 
                    type="text" 
                    class="form-control form-control-sm"
                    id="nombre" 
                    placeholder="Ingrese su nombre">
                  </input>
                </div>
                <div class="form-group list-link">
                  <label for="telefono">Número de teléfono</label>
                  <input 
                    type="number" 
                    class="form-control form-control-sm"
                    id="telefono" 
                    placeholder="Ingrese un número de teléfono">
                  </input>
                </div>
                <div class="form-group list-link">
                  <label for="asunto">Asunto</label>
                  <input 
                    type="text" 
                    class="form-control form-control-sm"
                    id="asunto" 
                    placeholder="Ingrese un asunto">
                  </input>
                </div>
                <div class="form-group list-link">
                  <label for="correo">Correo electrónico</label>
                  <input 
                    type="text" 
                    class="form-control form-control-sm"
                    id="correo" 
                    placeholder="Ingrese un correo electrónico donde responder a su consulta">
                  </input>
                </div>
                <div class="form-group list-link">
                  <label for="mensaje">Mensaje</label>
                  <textarea 
                    type="text" 
                    class="form-control form-control-sm"
                    id="mensaje" 
                    placeholder="Ingrese su mensaje">
                  </textarea>
                </div>
                <div class="form-group list-link">
                  <button
                    type="submit"
                    style={{ width: '9%', textAlignLast: 'right', marginInlineStart: 'auto' }}
                    className="btn btn-primary btn-block">
                    Enviar
                  </button>
                </div>

        </div>
      </div>
    </article>
  </main>
<Footer></Footer>
    </>
  );
};

export default ContactoNormativa;
