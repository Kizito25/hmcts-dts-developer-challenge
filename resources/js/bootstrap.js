import axios from "axios";
window.axios = axios;

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = false;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
