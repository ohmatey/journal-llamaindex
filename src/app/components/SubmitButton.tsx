"use client";

import React from "react";
import { useFormStatus } from "react-dom";

import styles from '../page.module.css'

export interface SubmitButtonProps {
  children?: React.ReactNode;
} 

function SubmitButton({
  children = 'Submit',
}: SubmitButtonProps) {
  const {
    pending,
  } = useFormStatus();
  
  return (
    <button disabled={pending} type="submit" className={styles.submitButton}>
      {pending ? "Loading..." : children}
    </button>
  );
}

export default SubmitButton;