import React from "react";
import { Link } from "react-router-dom";

const SDINResultados = () => {

  return (
    <>
  <main>
    <article class="pb-5">
      <div class="container pt-4 mb-5">
        <div class="row">
          <div class="col-12 col-lg-8">
            <h1 class="card-title">Resultados</h1>
            <div class="form-wrapper">
            <form class="form">
                <div class="form-group">
                    <h3><Link to={'/sdin-detalle'}>DECRETO 433 2021 </Link></h3>
                    <div>
                        <p><b>Síntesis </b>SE ACEPTA LA RENUNCIA?-?GABRIELA SCHIJVARG -?DIRECTORA GENERAL - DIRECCIÓN GENERAL DESARROLLO DEL SERVICIO CIVIL -?SUBSECRETARÍA DE GESTIÓN DE RECURSOS HUMANOS -?MINISTERIO DE HACIENDA Y FINANZAS - SE DESIGNA EN SU REEMPLAZO A MARIA BELEN FLORES</p>
                        <p><b>Publicación </b>Boletín oficial (BOCBA) Fecha: 4/1/2022</p>
                        <p><b>Organismo emisor </b>GOBIERNO DE LA CIUDAD AUTÓNOMA DE BUENOS AIRES</p>
                    </div>
                </div>
                <div class="form-group">
                    <h3>DECRETO 431 2021 </h3>
                    <div>
                        <p><b>Síntesis </b> SE DESIGNA - NVARD NAZARYAN - DIRECTORA GENERAL - DIRECCIÓN GENERAL INCLUSIÓN SOCIAL - SUBSECRETARÍA DESARROLLO INCLUSIVO - MINISTERIO DE DESARROLLO ECONÓMICO Y PRODUCCIÓN</p>
                        <p><b>Publicación </b>Boletín oficial (BOCBA) Fecha: 4/1/2022</p>
                        <p><b>Organismo emisor </b>GOBIERNO DE LA CIUDAD AUTÓNOMA DE BUENOS AIRES</p>
                    </div>
                </div>
            </form>
            </div>

          </div>

          
          
        </div>
      </div>
    </article>
  </main>
    </>
  );
};

export default SDINResultados;