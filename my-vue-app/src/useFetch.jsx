import axios from "axios";
import { useEffect, useState, useRef } from "react"

const useFetch = (options,deps=[]) => {

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect( () => {
    const controller = new AbortController();
    options.signal = controller.signal;

    setIsLoading(true);

    axios(options)
    .then((res) => {
      setData(res.data);
      setIsLoading(false)
    })
    .catch((err) => {
      if (err.code !== "ERR_CANCELED"){
        setIsLoading(false);
      }
      else{
        setError(err);
      }
    })

    return () => controller.abort();
  }, deps)

  return {data,isLoading,error}
}
export default useFetch