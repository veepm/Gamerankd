import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.igdb.com/v4",
  headers: {
    "Authorization": `Bearer ${process.env.IGDB_TOKEN}`,
    "Client-ID": process.env.IGDB_CLIENT_ID,
    "Content-Type": "text/plain"
  }
})

export default instance;
//axios.defaults.headers.common["Accept"] = "application/json";
