import { StatusCodes } from "http-status-codes"

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default
    statusCode: err.statusCode || err.response?.status || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  }

  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',')
    customError.statusCode = 400
  }

  // duplicate key postgres
  if (err.code && err.code === '23505') {
    customError.msg = err.detail
    customError.statusCode = 400
  }
  if (err.name === 'CastError') {
    customError.msg = `No item found with id : ${err.value}`
    customError.statusCode = 404
  }
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

export default errorHandlerMiddleware;
