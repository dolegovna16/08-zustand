import axios from "axios";
import type { AxiosResponse } from "axios";
import { Note, NoteTag } from "../types/note";

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    "Content-Type": "application/json",
  },
});

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface NewNote {
  title: string;
  content?: string;
  tag: NoteTag;
}

export async function fetchNotes(params: {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}): Promise<FetchNotesResponse> {
  const { page = 1, perPage = 12, search = "", tag } = params;

  const response: AxiosResponse<FetchNotesResponse> = await api.get("/notes", {
    params: {
      page,
      perPage,
      search: typeof search === "string" ? search : "",
      tag,
    },
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
}

export async function createNote(payload: {
  title: string;
  content?: string;
  tag: string;
}): Promise<Note> {
  const response: AxiosResponse<Note> = await api.post("/notes", payload);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response: AxiosResponse<Note> = await api.delete(`/notes/${id}`);
  return response.data;
}