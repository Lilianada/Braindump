
import { useQuery } from '@tanstack/react-query';
import { fetchNotesFromFirebase, fetchNoteByPath } from '@/services/firebaseService';

export const useFirebaseNotes = () => {
  return useQuery({
    queryKey: ['firebase-notes'],
    queryFn: fetchNotesFromFirebase,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
  });
};

export const useFirebaseNoteByPath = (path: string) => {
  return useQuery({
    queryKey: ['firebase-note', path],
    queryFn: () => fetchNoteByPath(path),
    enabled: !!path,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
  });
};
