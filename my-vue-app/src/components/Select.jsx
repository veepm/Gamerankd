import { useState } from "react";
import {IoChevronDownSharp} from "react-icons/io5";
import classes from "./css/select.module.css";

const Select = ({options, value, onChange, multiselect, children, background, color, width}) => {
  const [isActive,setIsActive] = useState(false);

  const handleClick = (option) => {
    if (!multiselect) {
      onChange(option);
      return;
    }
    // better to use find than include in case value object ref changes
    if (value.find(v => v.label === option.label && v.value === option.value)){
      const newSelected = value.filter((s) => s.label !== option.label && s.value !== option.value);
      onChange(newSelected);
    }
    else{
      onChange([...value, option]);
    }
  };

  const isSelected = (o) => {
    if (multiselect){
      return value.find(v => v.label === o.label && v.value === o.value);
    }
    return value === o;
  }

  return (
    <div className={classes.container} onClick={()=>setIsActive(!isActive)} onBlur={()=>setIsActive(false)} tabIndex={0} style={{background, color, width}}>
      <div className={classes.label}>{children || value.label}</div>
      <IoChevronDownSharp/>
      { isActive && (
        <div className={classes.dropdownContent}>
          {options.map((option,i) =>
            <div key={i}>
              <div className={classes.group}>{option.group}</div>
              {option.options.map((o) =>
                <div
                  key={o.value} 
                  className={`${classes.option} ${isSelected(o) ? classes.selected : ""}`} 
                  onClick={()=>handleClick(o)}
                >
                  {o.label}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Select;