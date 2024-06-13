import './Spinner.css'


const Spinner =  ({texto}) => {
  return (
    <div className="container fill">
    <div className="row mb-5 justify-content-center mb-2 align-middle">
        <div className="col-12 col-lg-12">
          {texto && <h3>Estamos creando tu trámite</h3>}
          {texto && <p class="lead">Por favor esperá unos segundos...</p>}
          
          <div className="spinner-border text-info" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
    </div>
    </div>
  );
}

export default Spinner;
