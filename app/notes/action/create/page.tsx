import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./create.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Note",
  description: "Create a new note in your NoteHub.",
  openGraph: {
    title: "Create Note",
    description: "Create a new note in your NoteHub.",
    url: `https://08-zustand-nine-eta.vercel.app/notes/action/create`,
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub image",
      },
    ],
  },
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}