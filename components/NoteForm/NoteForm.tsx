"use client";

import css from "./NoteForm.module.css";
import type { NoteTag } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import { createNote, NewNote } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useNoteDraftStore } from "@/lib/store/noteStore";

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

const OrderFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title is too long")
    .required("Title is required"),
  content: Yup.string().max(500, "Content is too long"),
  tag: Yup.mixed<NoteTag>()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"] as NoteTag[])
    .required("Tag is required"),
});

export default function NoteForm() {
  const { draft, setDraft, clearDraft } = useNoteDraftStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const currentDraft = draft ?? {
    title: "",
    content: "",
    tag: "Todo",
  };

  const [errors, setErrors] = useState<
    Partial<Record<keyof NoteFormValues, string>>
  >({});

  const onCloseModal = () => {
    router.back();
  };

  const onCreate = useMutation({
    mutationKey: ["notes"],
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
      clearDraft();
      onCloseModal();
    },
  });

  const handleChange = async (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setDraft({ [name]: value } as Partial<NoteFormValues>);

    try {
      await OrderFormSchema.validateAt(name, { ...draft, [name]: value });

      setErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setErrors((prev) => ({ ...prev, [name]: err.message }));
      }
    }
  };

  const handleSubmit = async (formData: FormData) => {
    const values = Object.fromEntries(formData) as Partial<NewNote>;
    try {
      await OrderFormSchema.validate(values, { abortEarly: false });
      setErrors({});
      onCreate.mutate(draft);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const newErrors: Partial<Record<keyof NoteFormValues, string>> = {};
        err.inner.forEach((error) => {
          if (error.path)
            newErrors[error.path as keyof NoteFormValues] = error.message;
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          value={currentDraft.title}
          onChange={handleChange}
          className={css.input}
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          value={currentDraft.content}
          onChange={handleChange}
          className={css.textarea}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          value={currentDraft.tag}
          onChange={handleChange}
          className={css.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>

      <div className={css.actions}>
        <button
          onClick={onCloseModal}
          type="button"
          className={css.cancelButton}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={onCreate.isPending}
        >
          Create note
        </button>
      </div>
    </form>
  );
}