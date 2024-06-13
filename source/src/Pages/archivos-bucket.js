import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ApiComunicator } from "../Helpers/ApiComunicator";
var b64toBlob = require('b64-to-blob')

const ArchivosBucket = () => {
  const { nombre } = useParams();

  useEffect(() => {
    const fetchArchivo = async () => {
      try {
        const archivoData = await ApiComunicator('/api/v1/traer-archivo', {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ archivo: nombre, tipo: "boletin" })
        })
          .then(res => res.text());
        
        let blob = b64toBlob(archivoData, 'application/pdf');
        const url = URL.createObjectURL(blob);

        // Crear un enlace oculto y disparar la descarga automáticamente
        const a = document.createElement('a');
        a.href = url;
        a.download = `${nombre}`;
        a.target = "_blank"
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        
        // Limpiar el objeto URL y eliminar el enlace
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };

    fetchArchivo();
  }, [nombre]);

  return null
};

export default ArchivosBucket;