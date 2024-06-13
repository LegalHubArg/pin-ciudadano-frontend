import React from "react";
import Header from './Layout/Header'
import Footer from './Layout/Footer'
import Spinner from "../Components/Spinner/Spinner";

const Tarifa = () => {

  return (
    <>
  <Header></Header>
  <main>
    <article class="pb-5">
      <div class="container pt-4 mb-5">
      <div class="bg-light shadow-sm rounded-lg px-4 pt-4 pb-3">
      <h2>tarifa</h2>
      <p>La publicación en el Boletín Oficial de la Ciudad de Buenos Aires es gratuita. Solo requieren costo de publicación los Edictos Particulares y las publicaciones de Entes Descentralizados. El valor de la línea es de $35 por día de publicación mientras que la publicación de Anexos tiene un costo de $ 1500 por página tamaño A-4, por día de publicación.</p>
            
            </div>
        
              
      </div>
    </article>
  </main>
<Footer></Footer>
    </>
  );
};

export default Tarifa;
