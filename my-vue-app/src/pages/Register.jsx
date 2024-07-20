import { useEffect, useRef, useState } from "react";
import classes from "./css/register.module.css"
import { useAppContext } from "../context/appContext";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";

const Register = () => {
  const {isLoading, user, setupUser} = useAppContext();

  const initialValues = {username:"",email:"",password:""};
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isLogin, setIsLogin] = useState(true);
  const isSubmitted = useRef(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormValues({...formValues,[e.target.name]:e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    validate();

    isSubmitted.current = true;
  };

  const validate = () => {
    const {username,email,password} = formValues;
    let errors = {};
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if (!username && !isLogin){
      errors.username = "Username is required";
    }
    if (!email){
      errors.email = "Email is required";
    }
    else if (!regex.test(email)){
      errors.email = "Invalid email";
    }
    if (!password){
      errors.password = "Password is required";
    }
    
    setFormErrors(errors);
  };

  useEffect(()=>{
    if (Object.keys(formErrors).length === 0 && isSubmitted.current){
      const url = isLogin ? "/auth/login" : "/auth/register";
      setupUser(url,formValues);
    }
  },[formErrors])

  useEffect(() => {
    if (user){
      navigate("/");
    }
  },[user])

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
        { isLogin || <FormInput input="username" type="text" value={formValues.username} handleChange={handleChange} error={formErrors.username}/>}
        <FormInput input="email" type="email" value={formValues.email} handleChange={handleChange} error={formErrors.email}/>
        <FormInput input="password" type="password" value={formValues.password} handleChange={handleChange} error={formErrors.password}/>
        <button type="submit">{isLoading ? "..." : "Submit"}</button>
        {isLogin ? (
          <p>Don't have an account? <a href="javascript:void(0)" onClick={toggleLogin}>Register</a></p>
        ) : (
          <p>Already have an account? <a href="javascript:void(0)" onClick={toggleLogin}>Login</a></p>
        )}
      </form>
    </div>
  )
}
export default Register