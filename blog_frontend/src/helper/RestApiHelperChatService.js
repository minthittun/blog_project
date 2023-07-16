import axios from "axios";

//const CHAT_SERVICE_ENDPOINT_DEV = "http://localhost:3001"
//const CHAT_SERVICE_ENDPOINT_PROD = "http://localhost:3001"

const CHAT_SERVICE_ENDPOINT = "http://localhost:3001";

const apiChat = axios.create({
    baseURL: CHAT_SERVICE_ENDPOINT + '/api/'
})

export {CHAT_SERVICE_ENDPOINT}
export default apiChat;