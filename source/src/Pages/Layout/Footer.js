import React from "react";

import logoCiudadBA from '../../assets/footer/ciudad-ba.svg';
import logoVamosBA from '../../assets/footer/vamos-ba.svg';


const Footer = () => {

  return (
    <>
  <footer class="main-footer">
    <div class="container">
      <section>
        <h4>Teléfonos útiles</h4>
        <ul class="list-inline">
          <li class="list-inline-item phone-items">
            <a href="tel:102">102 - Niñez y Adolescencia</a>
          </li>
          <li class="list-inline-item phone-items">
            <a href="tel:103">103 - Emergencias</a>
          </li>
          <li class="list-inline-item phone-items">
            <a href="tel:107">107 - SAME</a>
          </li>
          <li class="list-inline-item phone-items">
            <a href="tel:911">911 - Policía</a>
          </li>
          <li class="list-inline-item phone-items">
            <a href="tel:144">144 - Violencia de género</a>
          </li>
          <li class="list-inline-item phone-items">
            <a href="tel:147">147 - Atención ciudadana</a>
          </li>
        </ul>
        <a href="https://www.buenosaires.gob.ar/laciudad/telefonosutiles">
          Ver todos los teléfonos
        </a>
      </section>
      <section>
        <h4>Redes de la ciudad</h4>
        <ul class="list-inline">
          <li class="list-inline-item redes-items">
            <a href="https://www.facebook.com/GCBA">
              <i class="bx bxl-facebook"></i>
              Facebook
            </a>
          </li>
          <li class="list-inline-item redes-items">
            <a href="https://www.instagram.com/buenosaires">
              <i class="bx bxl-instagram"></i>
              Instagram
            </a>
          </li>
          <li class="list-inline-item redes-items">
            <a href="https://twitter.com/gcba">
              <i class="bx bxl-twitter"></i>
              Twitter
            </a>
          </li>
          <li class="list-inline-item redes-items">
            <a href="https://www.youtube.com/user/GCBA">
              <i class="bx bxl-youtube"></i>
              YouTube
            </a>
          </li>
          <li class="list-inline-item redes-items">
            <a
              href="https://ar.linkedin.com/company/gobierno-de-la-ciudad-de-buenos-aires"
            >
              <i class="bx bxl-linkedin"></i>
              LinkedIn
            </a>
          </li>
        </ul>
      </section>
    </div>
    <hr class="divider" />
    <div class="container">
      <section class="footer-legal-section">
        <div class="row align-items-center">
          <div class="col-12 col-md-5 col-xl-4 mb-4 mb-md-0 footer-content-img">
            <img
              class="d-lg-none"
              src={logoCiudadBA}
              alt="Ciudad de Buenos Aires"
              height="48"
            />
            <img
              class="d-none d-lg-inline"
              src={logoVamosBA}
              alt="Ciudad de Buenos Aires"
              height="40"
            />
            <img
              class="img-vamos-ba"
              src="../../assets/footer/vamos-ba.svg"
              alt="Vamos Buenos Aires"
            />
          </div>
          <div class="col-12 col-md-7 col-xl-8">
            <ul class="list-inline">
              <li class="list-inline-item">
                <a href="https://boletinoficial.buenosaires.gob.ar">
                  Boletín oficial
                </a>
              </li>
              <li class="list-inline-item">
                <a
                  href="https://www.buenosaires.gob.ar/innovacion/ciudadinteligente/terminos-y-condiciones"
                >
                  Términos y condiciones
                </a>
              </li>
              <li class="list-inline-item">
                <a href="https://www.buenosaires.gob.ar/privacidad">
                  Política de privacidad
                </a>
              </li>
              <li class="list-inline-item">
                <a href="https://www.buenosaires.gob.ar/oficiosjudiciales">
                  Oficios judiciales
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section>
        <div class="footer-license-text">
          Los contenidos de buenosaires.gob.ar están licenciados bajo
          <br class="d-none d-sm-inline" />
          Creative Commons Reconocimiento 2.5 Argentina License.
        </div>
      </section>
    </div>
  </footer>



    </>
  );
};

export default Footer;