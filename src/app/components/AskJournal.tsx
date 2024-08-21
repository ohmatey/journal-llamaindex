"use client";

import { useRef } from "react";
import { useFormState } from "react-dom";

import { chatWithAgent } from "../actions";
import styles from "../page.module.css";
import ResponseUI from "./ResponseUI";
import SubmitButton from "./SubmitButton";

const AskJournal = () => {
  const ref = useRef<HTMLFormElement>(null)

  const [ui, action] = useFormState((_: any, formData: FormData) => {
    const question = formData.get("question") as string;

    if (!question) {
      return null;
    }

    ref.current?.reset()

    // Pass the input to the chatWithAgent function
    return chatWithAgent(question, []);
  }, null);

  return (
    <form ref={ref} className={styles.form} action={action}>
      <ResponseUI ui={ui} />

      <textarea
        autoFocus
        defaultValue="What happened on August 22, 2024?"
        rows={3}
        name="question"
        className={styles.questionField}
      />

      <SubmitButton>
        Ask
      </SubmitButton>
    </form>
  );
}

export default AskJournal;