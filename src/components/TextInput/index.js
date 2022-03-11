import React, {useState} from "react";
import cn from "classnames";
import styles from "./TextInput.module.sass";

const TextInput = ({ className, label, setinputchange, min, max,  disabled, value,  ...props}) => {
  const {type}  = props
  return (
    <div className={cn(styles.field, className)}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.wrap}>
        {
          type === "number" ? <input className={styles.input} {...props}
          value={value}
          disabled={disabled}
          min={min}
          max={max}
          onKeyDown={e=>{
            const regrex = /^[0-9\b]+$/;
            if(regrex.test(e.key) === true || e.key.toLowerCase() === 'backspace' || e.key ==='.' ){
            }else{
              e.preventDefault()
            }
          }}
          onChange={(event)=> {
            setinputchange(event.target.value)
          }} /> : <input className={styles.input} {...props}
          value={value}
          disabled={disabled}
          min={min}
          max={max}
          onChange={(event)=> {
            setinputchange(event.target.value)
          }} />

        }
      </div>
    </div>
  );
};

export default TextInput;
