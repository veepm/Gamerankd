import { memo } from "react";
import { Rating } from "./index";
import classes from "./css/userGameInfo.module.css";
import axios from "axios";
import { IoGameController, IoGameControllerOutline } from "react-icons/io5";
import { PiListBulletsLight, PiListChecksLight } from "react-icons/pi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "../context/appContext";
import useUserInfo from "../useUserInfo";
import PuffLoader from "react-spinners/PuffLoader";
import { toast } from "react-toastify";

const UserGameInfo = ({ gameId }) => {
  const { user } = useAppContext();
  const queryClient = useQueryClient();

  const userInfoQuery = useUserInfo(gameId);

  const addGameMutation = useMutation({
    mutationFn: (listName) =>
      axios.post(
        `/lists/${listName}/games`,
        { game_id: gameId },
        { withCredentials: true }
      ),
    onMutate: async (listName) => {
      await queryClient.cancelQueries({
        queryKey: ["users", user?.username, "games", gameId],
      });

      const prevUserInfo = queryClient.getQueryData([
        "users",
        user?.username,
        "games",
        gameId,
      ]);

      queryClient.setQueryData(
        ["users", user?.username, "games", gameId],
        (old) => ({ ...old, [listName]: true })
      );
      return { prevUserInfo };
    },
    onError: (err, listName, context) => {
      queryClient.setQueryData(
        ["users", user?.username, "games", gameId],
        context.prevUserInfo
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["users", user?.username, "games", gameId],
      });
    },
    onSuccess: (data, listName) => {
      toast.success(`Game added to ${listName}`);
      queryClient.setQueryData(
        ["users", user.username, "lists", listName],
        (oldData) => ({
          ...oldData,
          games: [...oldData.games, gameId],
        })
      );
      // queryClient.invalidateQueries({
      //   queryKey: ["users", user.username, "lists", listName],
      //   refetchType: "all",
      // });
    },
  });

  const deleteGameMutation = useMutation({
    mutationFn: (listName) =>
      axios.delete(`/lists/${listName}/games/${gameId}`, {
        withCredentials: true,
      }),
    onMutate: async (listName) => {
      await queryClient.cancelQueries({
        queryKey: ["users", user?.username, "games", gameId],
      });

      const prevUserInfo = queryClient.getQueryData([
        "users",
        user?.username,
        "games",
        gameId,
      ]);

      queryClient.setQueryData(
        ["users", user?.username, "games", gameId],
        (old) => ({ ...old, [listName]: false })
      );

      return { prevUserInfo };
    },
    onError: (err, listName, context) => {
      queryClient.setQueryData(
        ["users", user?.username, "games", gameId],
        context.prevUserInfo
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["users", user?.username, "games", gameId],
      });
    },
    onSuccess: (data, listName) => {
      toast.success(`Game deleted from ${listName}`);
      queryClient.setQueryData(
        ["users", user.username, "lists", listName],
        (oldData) => ({
          ...oldData,
          games: oldData.games.filter((game) => game.id !== gameId),
        })
      );
      // queryClient.invalidateQueries({
      //   queryKey: ["users", user.username, "lists", listName],
      //   refetchType: "all",
      // });
    },
  });

  if (userInfoQuery.isLoading)
    return <PuffLoader color="white" size="1.75rem" />;

  if (!user) return <div>Login to rate and add to lists</div>;

  return (
    <div className={classes.container}>
      <button
        className={classes.action}
        onClick={
          userInfoQuery.data.played
            ? () => deleteGameMutation.mutate("played")
            : () => addGameMutation.mutate("played")
        }
      >
        {userInfoQuery.data.played ? (
          <IoGameController title="Remove from played" />
        ) : (
          <IoGameControllerOutline title="Add to played" />
        )}
      </button>
      <Rating
        isInteractable
        gameId={gameId}
        userRating={userInfoQuery.data.rating}
        size="1.75rem"
      />
      <button
        className={classes.action}
        onClick={
          userInfoQuery.data.wishlist
            ? () => deleteGameMutation.mutate("wishlist")
            : () => addGameMutation.mutate("wishlist")
        }
      >
        {userInfoQuery.data.wishlist ? (
          <PiListChecksLight title="Remove from wishlist" />
        ) : (
          <PiListBulletsLight title="Add to wishlist" />
        )}
      </button>
    </div>
  );
};

export default memo(UserGameInfo);
