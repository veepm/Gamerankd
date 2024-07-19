import { StatusCodes } from "http-status-codes"

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  let customError = {
    // err.response.status for IGDB error
    statusCode: err.statusCode || err.response?.status || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  }

  // duplicate key postgres error
  if (err.code && err.code === "23505") {
    switch (err.table) {
      case "users":
        customError.msg = `User exists with the same ${err.constraint.split("_")[1]}`;
        break;
    
      default:
        break;
    }
    customError.statusCode = 400;
  }

  // check constraint error
  if (err.code && err.code === "23514") {
    customError.msg = "Invalid email";
    customError.statusCode = 400;
  }

  if (err.code && err.code === "23502") {
    customError.msg = `${err.column} can't be empty`;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg })
}

export default errorHandlerMiddleware;
