import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import { NoteTag } from "@/types/note";
import { Metadata } from "next";

type NotesPageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0] === "All" ? "All" : (slug[0] as NoteTag);

  return {
    title: `Notes: ${tag}`,
    description:
      "Browse your notes, stay organized, and manage your ideas with NoteHub.",
    openGraph: {
      title: `Notes: ${tag}`,
      description:
        "Browse your notes, stay organized, and manage your ideas with NoteHub.",
      url: `http://localhost:3000/notes/filter/${tag}`,
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
}

const NotesPage = async ({ params }: NotesPageProps) => {
  const queryClient = new QueryClient();

  const search = "";
  const page = 1;

  const tag = (await params).slug?.[0];
  const allowedTag = Object.values(NoteTag).includes(tag as NoteTag)
    ? (tag as NoteTag)
    : undefined;

  await queryClient.prefetchQuery({
    queryKey: ["notes", search, page, allowedTag],
    queryFn: () => fetchNotes({ search: search, page: page, tag: allowedTag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={allowedTag} />
    </HydrationBoundary>
  );
};

export default NotesPage;