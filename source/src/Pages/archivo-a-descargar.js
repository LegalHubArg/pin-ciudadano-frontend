import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ApiComunicator } from "../Helpers/ApiComunicator";

const SDINArchivoADescargar = () => {
  const { idNorma, numero } = useParams();
  const [imagen, setImagen] = useState([]);

  console.log(idNorma, numero)

  const traerImagen = async () => {
    try {
      let request = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNorma: idNorma, numero: numero })
      }
      const results = await ApiComunicator('/api/v1/sdin/norma/imagen', request)
        .then((res) => res.json())
      setImagen(results.data[0])
    }
    catch (e) {
    }
  }

  // Llamar a traerImagen cuando idNormaSDIN cambia
  useEffect(() => {
    traerImagen();
  }, [idNorma]);

  // Descargar la imagen cuando imagen esté disponible
  useEffect(() => {
    if (imagen.imagen) {
      // Crear un enlace para descargar la imagen
      const link = document.createElement('a');
      link.href = `data:${imagen.tipo};base64,${imagen.imagen}`;
      link.download = `Archivo-${imagen.numero}.${imagen.tipo.split('/')[1].trim()}`;
      link.target = "_blank";
      // Simular un clic en el enlace para iniciar la descarga en una nueva pestaña
      link.click();
    }
  }, [imagen]);

  // No se muestra ningún contenido en la página
  return null;
};

export default SDINArchivoADescargar;