import axios from "axios";

const API_URL = `/stubs/handler_api.php?api_key=${
  import.meta.env.VITE_API_KEY
}`;

const OPERATOR = "any";

export async function getNumber(country, service) {
  const URL = `${API_URL}&action=getNumber&service=${service}&operator=${OPERATOR}&service=${service}&country=${country}`;

  const response = await axios.get(URL);
  console.log(response);
  return response.data;
}

export async function getBalance() {
  const URL = `${API_URL}&action=getBalance`;
  const response = await axios.get(URL);
  console.log(response)
  return response.data;
}

export async function getServices(country) {
  if (!country) {
    return null;
  }
  const URL = `${API_URL}&action=getPrices&country=${country}`;

  const response = await axios.get(URL);

  return response.data;
}

export async function sendStatus(status, id) {
  const URL = `${API_URL}&action=setStatus&status=${status}&id=${id}`;

  const response = await axios.get(URL);
  console.log(response)

  return response.data;
}

export async function getStatus(id) {
  const URL = `${API_URL}&action=getStatus&id=${id}`;

  const response = await axios.get(URL);
  console.log(response)

  return response.data;
}

