
const envConfig = window;
// API Link
export default { 
    
    endpoint: envConfig.REACT_APP_ENDPOINT, 
    usuarioFirma: envConfig.REACT_APP_FIRMA_USUARIO_CUIT, 
    captchaLogin: envConfig.REACT_APP_CLAVE_CAPTCHA 
}
