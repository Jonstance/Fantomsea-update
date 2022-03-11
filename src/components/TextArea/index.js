import React, { useState } from "react";
import cn from "classnames";
import styles from "./TextArea.module.sass";

const TextArea = ({ className, label,value, setinputchange, ...props }) => {
  return (
    <div className={cn(styles.field, className)}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.wrap}>
        <textarea className={styles.textarea} {...props} onChange={(event)=>setinputchange(event.target.value)}
        value={value}
        />
      </div>
    </div>
  );
};

export default TextArea;
