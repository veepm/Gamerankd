import instance from "../axios.js";

export const getAllGenres = async (req, res) => {
  const { sort } = req.query;
  let query = "fields name; limit 500;";

  if (sort) {
    query += `sort name ${sort};`;
  }

  try {
    const genres = await instance.post("/genres", query);
    return res.status(genres.status).send({ genres: genres.data });
  } catch (error) {
    console.log(error.message);
  }
};
