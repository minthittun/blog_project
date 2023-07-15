const axios = require('axios');

const CHAT_SERVICE_ENDPOINT = process.env.NODE_ENV === 'production' ? "http://chat_service_api:3001" : "http://localhost:3001"

async function postRequest(url, data) {
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function userDataSync(postData) {

  try {
    const responseData = await postRequest(CHAT_SERVICE_ENDPOINT + "/api/sync/syncUserData", postData);
    return responseData;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  postRequest,
  userDataSync
};
