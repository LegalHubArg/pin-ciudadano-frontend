import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ApiComunicator } from "../Helpers/ApiComunicator";
var b64toBlob = require('b64-to-blob')

const AdjuntoNormaSDIN = () => {
  const { nombre } = useParams();
  const [archivo, setArchivo] = useState(null)

  const partes = nombre.split('.');
  const extension = partes[partes.length - 1];

  useEffect(() => {
    const fetchArchivo = async () => {
      let blobUrl;
      try {
        await ApiComunicator('/api/v1/sdin/traer-archivo-sdin', {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ archivoS3: nombre })
        })
        .then(res => res.json())
        .then(res => {
          let blob = b64toBlob(res.data, `application/${extension}`)
          blobUrl = URL.createObjectURL(blob)
          setArchivo(blobUrl)
        })
        .catch(err => {
          console.log(err)
        })
        
        // Crear un enlace oculto y disparar la descarga automáticamente
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `${nombre}`;
        a.target = "_blank"
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        
        // Limpiar el objeto URL y eliminar el enlace
        URL.revokeObjectURL(archivo);
        document.body.removeChild(a);
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };

    fetchArchivo();
  }, [nombre]);

  return null;
};

export default AdjuntoNormaSDIN;