
import { useQuery } from '@tanstack/react-query';
import { fetchNotesFromFirebase, fetchNoteByPath } from '@/services/firebaseService';

export const useFirebaseNotes = () => {
  return useQuery({
    queryKey: ['firebase-notes'],
    queryFn: fetchNotesFromFirebase,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useFirebaseNoteByPath = (path: string) => {
  return useQuery({
    queryKey: ['firebase-note', path],
    queryFn: () => fetchNoteByPath(path),
    enabled: !!path,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};
