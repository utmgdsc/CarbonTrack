import axios from "axios";
const FLASK_LOCAL_ADDRESS: string = "http://10.0.0.72:6050";

const instance = axios.create({
  baseURL: FLASK_LOCAL_ADDRESS,
  headers: {
    'Content-Type': 'application/json',
  }
});

 export default instance;
