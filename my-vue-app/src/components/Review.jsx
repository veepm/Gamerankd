import useFetch from "../useFetch"

const Review = ({gameId}) => {
  const {data, isLoading, error} = useFetch({url:`/games/${gameId}/reviews`});

  if (isLoading) return;

  if (error) console.log(error);

  return (
    <div>
      <h3>Reviews</h3>
      <div>
        {data.reviews.map((review)=>{
          return (
            <div key={review.review_id}>
              <h3>{review.username}</h3>
              <p>Rating: {review.rating}</p>
              <p>{review.review_text}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default Review