import axios from "axios";
import { useEffect, useState } from "react"

const useFetch = (options,deps=[]) => {

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect( () => {

    axios(options)
    .then((res) => {
      setData(res.data.data);
    })
    .catch((err) => {
      setError(err);
    })
    .finally(() => setIsLoading(false))

  }, deps)

  return {data,isLoading,error}
}
export default useFetch