import axios from "axios";

axios.defaults.baseURL = "https://api-gamerankd.onrender.com";
// axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.headers.common["Authorization"] =
  localStorage.getItem("accessToken");
