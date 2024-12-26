import { useEffect, useRef, useState } from "react";
import classes from "./css/register.module.css";
import { useAppContext } from "../context/appContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import { toast } from "react-toastify";

const Register = ({ login }) => {
  const { isUserLoading, setupUser } = useAppContext();

  const initialValues = { username: "", email: "", password: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const isSubmitted = useRef(false);

  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    document.title = `${login ? "Login" : "Register"} - Gamerankd`;
  }, []);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    validate();

    isSubmitted.current = true;
  };

  const validate = () => {
    const { username, email, password } = formValues;
    let errors = {};
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!username && !login) {
      errors.username = "Username is required";
    }
    if (!email) {
      errors.email = "Email is required";
    } else if (!regex.test(email)) {
      errors.email = "Invalid email";
    }
    if (!password) {
      errors.password = "Password is required";
    }

    setFormErrors(errors);
  };

  useEffect(() => {
    (async function () {
      if (Object.keys(formErrors).length === 0 && isSubmitted.current) {
        const setupError = await setupUser(login, formValues);
        if (setupError) {
          setFormErrors((prev) => {
            prev.password = setupError.response.data.msg;
            return prev;
          });
        } else if (!login) {
          toast.info("Verify email by clicking on link sent at email");
          navigate("/login");
        } else {
          navigate(
            `${state?.from ? state.from.pathname + state.from.search : "/"}`
          );
        }
      }
    })();
  }, [formErrors]);

  return (
    <div className={classes.container}>
      <form onSubmit={handleSubmit}>
        <h2>{login ? "Login" : "Sign Up"}</h2>
        {login || (
          <FormInput
            input="username"
            type="text"
            value={formValues.username}
            handleChange={handleChange}
            error={formErrors.username}
          />
        )}
        <FormInput
          input="email"
          type="email"
          value={formValues.email}
          handleChange={handleChange}
          error={formErrors.email}
        />
        <FormInput
          input="password"
          type="password"
          value={formValues.password}
          handleChange={handleChange}
          error={formErrors.password}
        />
        <button type="submit">{isUserLoading ? "..." : "Submit"}</button>
        {login ? (
          <p>
            Don't have an account?{" "}
            <Link to="/register" replace={true}>
              Register
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <Link to="/login" replace={true}>
              Login
            </Link>
          </p>
        )}
      </form>
    </div>
  );
};
export default Register;
