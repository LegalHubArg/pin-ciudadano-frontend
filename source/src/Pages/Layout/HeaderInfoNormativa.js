import React, { useState, useEffect } from "react";
import { ApiComunicator } from "../../Helpers/ApiComunicator";
import logoBA from '../../assets/header/header-logo.svg'

import { Link, useLocation } from "react-router-dom";

const HeaderInfoNormativa = () => {

  const [loading, setLoading] = useState()
  const [contenido, setContenido] = useState()
  const headerSDIN = {
    seccion: 'sdin_header'
  }

  async function getContenido() {
    let body = { ...headerSDIN }
    const contenido = await ApiComunicator('/api/v1/contenido', { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then((res) => res.json())
    setContenido(contenido.data)

  }

  useEffect(async () => {
    setLoading(true)
    await getContenido()
    setLoading(false)
  }, [])


  let location = useLocation();

  const NavItem = (props) => {
    let active = props.route === location.pathname;
    return (
      <li class="nav-item">
        <a href={props.route ?? "#"} class={"nav-link" + (active ? " active" : "")}><span>{props.children}</span></a>
      </li>
    )
  }

  return (
    <>

      <header class="navbar navbar-light navbar-md">
        <div class="container">
          <a href="/" class="navbar-brand">
            <img
              class="header-logo"
              src={logoBA}
              alt="Ciudad de buenos aires"
            />
          </a>
          <button class="navbar-toggler ml-2 collapsed" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false">
            Menú
            <span class="navbar-toggler-icon" />
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="nav nav-pills">
              <NavItem route={"/"}>Boletín Oficial</NavItem>
              <NavItem route={"/sdin-busqueda"}>Normativa y Digesto</NavItem>
            </ul>
          </div>
        </div>
      </header>

      <main>
        <article class="pb-5">
          <header class="bg-light pt-4 pb-3">
            <div class="container">
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                  <li class="breadcrumb-item">Buenos Aires</li>
                  <li class="breadcrumb-item"><a href="/sdin-busqueda">Normativa y Digesto</a></li>
                </ol>
              </nav>

              <div class="row">
                <div class="col-12 col-lg-8">
                  <h1 class="mb-3">Servicio de Información Normativa y Digesto Jurídico</h1>
                  <div>

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
                  <div class="d-flex mt-4">
                    <nav class="ml-2">
                      <ul class="nav flex-row nav-pills">
                        <li class="nav-item">
                          <Link className="nav-link border-link nav-link-sm" to="/sdin-busqueda" preventScrollReset={true} ><span>Inicio</span></Link>
                        </li>
                        <li class="nav-item">
                          <Link className="nav-link border-link nav-link-sm" to="/que-hacemos" preventScrollReset={true} ><span>¿Qué hacemos?</span></Link>
                        </li>
                        <li class="nav-item">
                          <Link className="nav-link border-link nav-link-sm" to="/como-utilizarlo" preventScrollReset={true} ><span>¿Cómo utilizar este servicio?</span></Link>
                        </li>
                        <li class="nav-item">
                          <Link className="nav-link border-link nav-link-sm" to="/normativa-relevante" preventScrollReset={true} ><span>Normativa Relevante</span></Link>
                        </li>
                        <li class="nav-item">
                          <Link className="nav-link border-link nav-link-sm" to="/que-es" preventScrollReset={true} ><span>¿Qué es el Digesto Jurídico?</span></Link>
                        </li>
                        <li class="nav-item">
                          <Link className="nav-link border-link nav-link-sm" to="/indice-tematico" preventScrollReset={true} ><span>Árbol Tematico</span></Link>
                        </li>
                        <li class="nav-item">
                          <Link className="nav-link border-link nav-link-sm" to="/digesto" preventScrollReset={true} ><span>Digesto</span></Link>
                        </li>
                        <li class="nav-item">
                          <Link className="nav-link border-link nav-link-sm" to="/contacto-normativa" preventScrollReset={true} ><span>Contacto</span></Link>
                        </li>
                      </ul>

                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </header>

        </article>
      </main>

    </>
  );
};

export default HeaderInfoNormativa;
