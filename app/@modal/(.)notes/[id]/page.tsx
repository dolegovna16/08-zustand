import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NotePreview from "./NotePreview.client";
import { fetchNoteById } from "@/lib/api";

type ModalPreviewProps = {
  params: Promise<{ id: string }>;
};

const ModalPreview = async ({ params }: ModalPreviewProps) => {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview />
    </HydrationBoundary>
  );
};

export default ModalPreview;