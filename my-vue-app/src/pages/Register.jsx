import { useEffect, useRef, useState } from "react";
import classes from "./css/register.module.css";
import { useAppContext } from "../context/appContext";
import { useLocation, useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";

const Register = ({ login }) => {
  const { isUserLoading, user, setupUser } = useAppContext();

  const initialValues = { username: "", email: "", password: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isLogin, setIsLogin] = useState(login);
  const isSubmitted = useRef(false);

  const navigate = useNavigate();
  const {
    state: { from },
  } = useLocation();

  useEffect(() => {
    document.title = `${isLogin ? "Login" : "Register"} - Gamerankd`;
  }, [isLogin]);

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

    if (!username && !isLogin) {
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
        const url = isLogin ? "/auth/login" : "/auth/register";
        const setupError = await setupUser(url, formValues);
        if (setupError) {
          setFormErrors((prev) => {
            prev.password = setupError.response.data.msg;
            return prev;
          });
        } else {
          navigate(`${from.pathname}${from.search}`);
        }
      }
    })();
  }, [formErrors]);

  const toggleLogin = () => {
    setIsLogin(!isLogin);
    setFormValues(initialValues);
    setFormErrors({});
    isSubmitted.current = false;
  };

  return (
    <div className={classes.container}>
      <form onSubmit={handleSubmit}>
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        {isLogin || (
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
        {isLogin ? (
          <p>
            Don't have an account?{" "}
            <a href="javascript:void(0)" onClick={toggleLogin}>
              Register
            </a>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <a href="javascript:void(0)" onClick={toggleLogin}>
              Login
            </a>
          </p>
        )}
      </form>
    </div>
  );
};
export default Register;
