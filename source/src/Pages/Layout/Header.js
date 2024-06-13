import React, { useState, useEffect } from "react";
import { ApiComunicator } from "../../Helpers/ApiComunicator";
import logoBA from '../../assets/header/header-logo.svg'

import { Link, useLocation } from "react-router-dom";

const Header = () => {

  const [loading, setLoading] = useState()
  const [contenido, setContenido] = useState()
  const header = {
    seccion: 'bo_header'
  }

  async function getContenido() {
    let body = { ...header }
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
                  <li class="breadcrumb-item"><a href="/">Boletín Oficial</a></li>
                </ol>
              </nav>

              <div class="row">
                <div class="col-12 col-lg-8">
                  <h1 class="mb-3">Boletín Oficial de la Ciudad de Buenos Aires</h1>
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
                          <Link className="nav-link border-link nav-link-sm" to="/" preventScrollReset={true} ><span>Inicio</span></Link>
                        </li>
                        <li class="nav-item">
                          <Link className="nav-link border-link nav-link-sm" to="/institucional" preventScrollReset={true} ><span>Institucional</span></Link>
                        </li>
                        <li class="nav-item">
                          <Link className="nav-link border-link nav-link-sm" to="/informacion-general" preventScrollReset={true} ><span>Información General</span></Link>
                        </li>
                        <li class="nav-item">
                          <Link className="nav-link border-link nav-link-sm" to="/requisitos-generales" preventScrollReset={true} ><span>Requisitos Generales de Publicación</span></Link>
                        </li>
                        <li class="nav-item">
                          <a class="nav-link border-link nav-link-sm" href="https://reddeboletines.gob.ar/"><span>Red de Boletines</span></a>
                        </li>
                        <li class="nav-item">
                          <Link className="nav-link border-link nav-link-sm" to="/contacto" preventScrollReset={true} ><span>Contacto</span></Link>
                        </li>
                        {/* <li class="nav-item">
                          <Link className="nav-link border-link nav-link-sm" to="/tarifa" preventScrollReset={true} ><span>Tarifa</span></Link>
                        </li>
                        <li class="nav-item">
                          <Link className="nav-link border-link nav-link-sm" to="/normas-destacadas" preventScrollReset={true} ><span>Normas Destacadas</span></Link>
                        </li>
                        <div class="dropdown mb-3 mr-1">
                          <button
                            type="button" class="btn btn-dropdown btn-dropdown-border btn-dropdown-sm dropdown-toggle"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Digesto
                          </button>
                          <ul class="dropdown-menu">
                            <li><Link className="nav-link border-link nav-link-sm" to="/digestos" preventScrollReset={true} ><span>Actualización 2020</span></Link></li>
                            <li><a class="dropdown-item" href="#">Actualización 2018</a></li>
                            <li><a class="dropdown-item" href="#">Actualización 2016</a></li>
                            <li><a class="dropdown-item" href="#">Actualización 2014</a></li>
                            <li><a class="dropdown-item" href="#">Provisorio</a></li>
                            <li><a class="dropdown-item" href="digesto-busqueda">Buscador Digesto</a></li>
                            <li><a class="dropdown-item" href="digesto/arbol-tematico" target="_blank">Árbol Temático</a></li>
                          </ul>
                        </div> */}
                        {/* <li class="nav-item">
                          <Link className="nav-link border-link nav-link-sm" to="/contacto" preventScrollReset={true}><span>Contacto</span></Link>
                        </li> */}
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

export default Header;
