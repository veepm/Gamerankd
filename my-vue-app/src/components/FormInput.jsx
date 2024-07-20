import classes from "./css/formInput.module.css"

const FormInput = ({input,type,value,handleChange,error}) => {
  return (
    <div className={classes.formInput}>
      <label htmlFor={input}>{input}</label>
      <input type={type} name={input} id={input} value={value} onChange={handleChange}/>
      <p>{error}</p>
    </div>
  )
}
export default FormInput