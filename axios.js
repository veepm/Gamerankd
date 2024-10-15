import axios from "axios";
import fs from "fs";

let token = fs.readFileSync("secret.txt", { encoding: "utf-8" });

if (!token){
  token = await updateToken();
}

const updateToken = async () => {
  const { data } = await axios.post(
    `https://id.twitch.tv/oauth2/token?client_id=${process.env.IGDB_CLIENT_ID}&client_secret=${process.env.IGDB_CLIENT_SECRET}&grant_type=client_credentials`
  );
  fs.writeFileSync("secret.txt", data.access_token, "utf-8");
  return data.access_token;
};

const instance = axios.create({
  baseURL: "https://api.igdb.com/v4",
  headers: {
    Authorization: `Bearer ${token}`,
    "Client-ID": process.env.IGDB_CLIENT_ID,
    "Content-Type": "text/plain",
  },
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;
    if (error?.response?.status === 401 && !prevRequest?.sent) {
      prevRequest.sent = true;
      const token = await updateToken();
      instance.defaults.headers.Authorization = `Bearer ${token}`;
      return axios(prevRequest);
    }
    return Promise.reject(error);
  }
);
export default instance;
