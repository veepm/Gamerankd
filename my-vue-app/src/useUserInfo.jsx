import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "./context/appContext";
import axios from "axios";

const useUserInfo = (gameId) => {
  const {user} = useAppContext();

  const userInfoQuery = useQuery({
    queryKey: ["users", user?.username, "games", gameId],
    enabled: user != null,
    queryFn: async () => {
      const {data} = await axios.get(`/users/${user.username}/games/${gameId}`);
      return data;
    }
  });
  return userInfoQuery;
}

export default useUserInfo;

