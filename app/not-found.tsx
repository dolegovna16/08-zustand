import React from "react";
import { Metadata } from "next";
import css from "./Home.module.css";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "Page not found. Return to NoteHub and keep your notes organized.",
  openGraph: {
    title: "Page not found",
    description:
      "Page not found. Return to NoteHub and keep your notes organized.",
    url: "https://08-zustand-nine-eta.vercel.app/404",
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

export default function notFound() {
  return (
    <>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </>
  );
}