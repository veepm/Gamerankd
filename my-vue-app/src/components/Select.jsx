import { useState } from "react";
import { IoChevronDownSharp } from "react-icons/io5";
import classes from "./css/select.module.css";

const Select = ({
  options,
  value,
  onChange,
  multiselect,
  openOnHover,
  displayIcon = true,
  children,
  className,
  enabled = true,
}) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = (option) => {
    if (!multiselect) {
      onChange(option);
      return;
    }
    // better to use find than include in case value object ref changes
    if (
      value.find((v) => v.label === option.label && v.value === option.value)
    ) {
      const newSelected = value.filter(
        (s) => s.label !== option.label && s.value !== option.value
      );
      onChange(newSelected);
    } else {
      onChange([...value, option]);
    }
  };

  const isSelected = (o) => {
    if (multiselect) {
      return value.find((v) => v.label === o.label && v.value === o.value);
    }
    return value === o;
  };

  return (
    <div
      className={`${classes.container} ${className}`}
      onMouseEnter={() => {
        if (enabled && openOnHover) setIsActive(true);
      }}
      onMouseLeave={() => {
        if (enabled && openOnHover) setIsActive(false);
      }}
      onClick={() => {
        if (enabled) setIsActive(!isActive);
      }}
      onBlur={() => {
        if (enabled) setIsActive(false);
      }}
      tabIndex={0}
    >
      <div className={classes.label}>{children || value.label}</div>
      {displayIcon && <IoChevronDownSharp />}
      {isActive && (
        <div className={classes.dropdownContainer}>
          <div className={classes.dropdownContent}>
            {options.map((option, i) => (
              <div key={i}>
                <div className={classes.group}>{option.group}</div>
                {option.options.map((o) => (
                  <div
                    key={o.value}
                    className={`${classes.option} ${
                      isSelected(o) ? classes.selected : ""
                    }`}
                    onClick={() => handleClick(o)}
                  >
                    {o.label}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Select;
