import useFetch from "../useFetch"

const Review = ({gameId}) => {
  const {data, isLoading, error} = useFetch({url:`/games/${gameId}/reviews`});

  if (isLoading) return;

  if (error) console.log(error);

  return (
    <div>
      {data.reviews.map((review)=>{
        return (
          <div key={review.id}>
            <h3>{review.username}</h3>
            <p>Rating: {review.rating}</p>
            <p>{review.review_text}</p>
          </div>
        )
      })}
    </div>
  )
}
export default Review