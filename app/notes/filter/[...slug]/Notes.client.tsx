"use client";

import NoteList from "@/components/NoteList/NoteList";
import css from "./NotesPage.module.css";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import type { FetchNotesResponse } from "@/lib/api";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import { useDebounce } from "use-debounce";
import { NoteTag } from "@/types/note";
import Link from "next/link";

interface Props {
  tag?: NoteTag;
}

export default function NotesClient({ tag }: Props) {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", debouncedQuery, currentPage, tag],
    queryFn: () =>
      fetchNotes({
        search: debouncedQuery,
        page: currentPage,
        perPage: 12,
        tag: tag,
      }),
    enabled: true,
    placeholderData: (prev) => prev,
  });

  const handleSearch = (value: string) => {
    setQuery(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox handleSearch={handleSearch} />
          {data && data.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={data.totalPages}
              onPageChange={handlePageChange}
            />
          )}
          <Link href="/notes/action/create" className={css.button}>
            Create note +
          </Link>
        </header>
        {isLoading && <p>Loading...</p>}
        {error && <p>Error loading notes</p>}
        {data && data.notes.length > 0 ? (
          <NoteList notes={data.notes} />
        ) : (
          <p>No notes found</p>
        )}
      </div>
    </>
  );
}