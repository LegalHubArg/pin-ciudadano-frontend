import React, { useEffect, useState } from "react";
import Header from './Layout/Header'
import Footer from './Layout/Footer'
import { useParams } from "react-router-dom";
import Spinner from '../Components/Spinner/Spinner'
import moment from "moment";
import { ApiComunicator } from "../Helpers/ApiComunicator";

const ArbolTematico = props => {
    const [arbolTematico, setArbolTematico] = useState()
    const [loading, setLoading] = useState(false)

    const getArbolTematico = async () => {
        setLoading(true)
        try {
            let request = { method: "GET" }
            const results = await ApiComunicator('/api/v1/dj/arbol-tematico', request)
                .then((res) => res.json())
            setArbolTematico(results.data[0])
            setLoading(false)
        }
        catch (e) {
            setLoading(false)
        }
    }
    useEffect(async () => { await getArbolTematico() }, [])

    if (loading) return <Spinner />
    else return (
        <>
            {arbolTematico && <div dangerouslySetInnerHTML={{ __html: arbolTematico.html }} />}

        </>
    );
};

export default ArbolTematico;