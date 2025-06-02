# Firestore Database Structure - Admin Guide

This document outlines the complete Firestore database structure for admin users, including data fetching methods and rendering recommendations. All fields listed below are confirmed to exist in the actual database.

## Collection Structure

### Admin Notes Collection
**Path**: `notes/{noteId}`

This is the admin-level collection where all notes are stored directly under the root `notes` collection, as opposed to the user-scoped path `users/{userId}/notes/{noteId}`.

## Document Schema

### Core Fields (Always Present)
```typescript
interface NoteDocument {
  // Identifiers
  id: string;              // Document ID
  uniqueId: string;        // Unique identifier for the note
  userId: string;          // ID of the user who owns the note
  
  // Content
  content: string;         // Markdown content of the note
  noteTitle: string;       // Title of the note
  
  // Timestamps
  createdAt: Timestamp;    // Firebase Timestamp of creation
  updatedAt: Timestamp;    // Firebase Timestamp of last update
  
  // File System
  slug: string;            // URL-friendly version of the title
  filePath: string;        // File path for the note
  
  // Metrics
  wordCount: number;       // Word count of the content
  fileSize: number;        // File size in bytes
}
```

### Optional Fields
```typescript
interface OptionalNoteFields {
  // Organization
  tags?: string[];         // Array of tag strings
  category?: {             // Category object
    id: string;
    name: string;
    color: string;
  };
  
  // Hierarchy
  parentId?: string;       // ID of parent note (for nested notes)
  linkedNoteIds?: string[]; // Array of linked note IDs
  
  // Status
  archived?: boolean;      // Whether the note is archived
  publish?: boolean;       // Whether the note is published
  
  // Metadata
  description?: string;    // Note description
  editHistory?: Array<{   // Edit history entries
    timestamp: Timestamp;
    action: string;
    // Additional history fields may exist
  }>;
}
```

## User Storage Tracking

### Storage Information
**Path**: `users/{userId}/storage/info`

```typescript
interface StorageInfo {
  totalSize: number;       // Total storage used in bytes
  noteCount: number;       // Total number of notes
  lastUpdated: Timestamp;  // Last update timestamp
  // Additional storage metrics may exist
}
```

## Data Fetching Methods

### 1. Fetch All Notes (Admin View)
```typescript
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase/config';

// Fetch all notes across all users
export async function fetchAllNotesAdmin() {
  try {
    const notesRef = collection(db, 'notes');
    const q = query(notesRef, orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching admin notes:', error);
    throw error;
  }
}
```

### 2. Fetch Notes by User ID
```typescript
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function fetchNotesByUser(userId: string) {
  try {
    const notesRef = collection(db, 'notes');
    const q = query(
      notesRef, 
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching notes by user:', error);
    throw error;
  }
}
```

### 3. Fetch Published Notes Only
```typescript
export async function fetchPublishedNotes() {
  try {
    const notesRef = collection(db, 'notes');
    const q = query(
      notesRef,
      where('publish', '==', true),
      orderBy('updatedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching published notes:', error);
    throw error;
  }
}
```

### 4. Fetch Notes with Tags
```typescript
export async function fetchNotesByTag(tag: string) {
  try {
    const notesRef = collection(db, 'notes');
    const q = query(
      notesRef,
      where('tags', 'array-contains', tag)
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching notes by tag:', error);
    throw error;
  }
}
```

### 5. Fetch Single Note
```typescript
import { doc, getDoc } from 'firebase/firestore';

export async function fetchNoteById(noteId: string) {
  try {
    const noteRef = doc(db, 'notes', noteId);
    const snapshot = await getDoc(noteRef);
    
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data()
      };
    } else {
      throw new Error('Note not found');
    }
  } catch (error) {
    console.error('Error fetching note:', error);
    throw error;
  }
}
```

### 6. Fetch User Storage Info
```typescript
export async function fetchUserStorageInfo(userId: string) {
  try {
    const storageRef = doc(db, 'users', userId, 'storage', 'info');
    const snapshot = await getDoc(storageRef);
    
    if (snapshot.exists()) {
      return snapshot.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching storage info:', error);
    throw error;
  }
}
```

## Rendering Recommendations

### 1. Note List Rendering
```typescript
function NoteListAdmin({ notes }: { notes: NoteDocument[] }) {
  return (
    <div className="space-y-4">
      {notes.map(note => (
        <div key={note.id} className="border rounded-lg p-4">
          <h3 className="font-bold">{note.noteTitle}</h3>
          <p className="text-sm text-gray-600">
            By User: {note.userId} | 
            Updated: {note.updatedAt.toDate().toLocaleDateString()} |
            Words: {note.wordCount}
          </p>
          
          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="mt-2">
              {note.tags.map(tag => (
                <span key={tag} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Category */}
          {note.category && (
            <div className="mt-2">
              <span 
                className="inline-block text-xs px-2 py-1 rounded"
                style={{ backgroundColor: note.category.color }}
              >
                {note.category.name}
              </span>
            </div>
          )}
          
          {/* Status indicators */}
          <div className="mt-2 space-x-2">
            {note.archived && (
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">Archived</span>
            )}
            {note.publish && (
              <span className="text-xs bg-green-200 px-2 py-1 rounded">Published</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 2. Note Content Rendering
```typescript
function NoteContentAdmin({ note }: { note: NoteDocument }) {
  return (
    <article className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{note.noteTitle}</h1>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Author: {note.userId}</p>
          <p>Created: {note.createdAt.toDate().toLocaleDateString()}</p>
          <p>Updated: {note.updatedAt.toDate().toLocaleDateString()}</p>
          <p>Words: {note.wordCount} | Size: {(note.fileSize / 1024).toFixed(2)} KB</p>
        </div>
        
        {/* Description */}
        {note.description && (
          <p className="text-gray-700 mt-4 italic">{note.description}</p>
        )}
      </header>
      
      {/* Content */}
      <div className="prose max-w-none">
        {/* Render markdown content here using your markdown renderer */}
        <MarkdownRenderer content={note.content} />
      </div>
      
      {/* Footer */}
      <footer className="mt-8 pt-4 border-t">
        {/* Linked Notes */}
        {note.linkedNoteIds && note.linkedNoteIds.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Linked Notes:</h3>
            <div className="space-x-2">
              {note.linkedNoteIds.map(linkedId => (
                <a key={linkedId} href={`/admin/notes/${linkedId}`} className="text-blue-600 hover:underline">
                  {linkedId}
                </a>
              ))}
            </div>
          </div>
        )}
        
        {/* Edit History */}
        {note.editHistory && note.editHistory.length > 0 && (
          <details className="mt-4">
            <summary className="font-semibold cursor-pointer">Edit History</summary>
            <div className="mt-2 space-y-1">
              {note.editHistory.map((entry, index) => (
                <div key={index} className="text-sm text-gray-600">
                  {entry.timestamp.toDate().toLocaleString()} - {entry.action}
                </div>
              ))}
            </div>
          </details>
        )}
      </footer>
    </article>
  );
}
```

### 3. Dashboard Statistics
```typescript
function AdminDashboard({ notes }: { notes: NoteDocument[] }) {
  const stats = {
    totalNotes: notes.length,
    publishedNotes: notes.filter(n => n.publish).length,
    archivedNotes: notes.filter(n => n.archived).length,
    totalWords: notes.reduce((sum, n) => sum + n.wordCount, 0),
    totalSize: notes.reduce((sum, n) => sum + n.fileSize, 0),
    uniqueUsers: new Set(notes.map(n => n.userId)).size,
    allTags: [...new Set(notes.flatMap(n => n.tags || []))],
  };
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold">Total Notes</h3>
        <p className="text-2xl font-bold">{stats.totalNotes}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold">Published</h3>
        <p className="text-2xl font-bold text-green-600">{stats.publishedNotes}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold">Total Words</h3>
        <p className="text-2xl font-bold">{stats.totalWords.toLocaleString()}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold">Storage Used</h3>
        <p className="text-2xl font-bold">{(stats.totalSize / 1024 / 1024).toFixed(2)} MB</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold">Active Users</h3>
        <p className="text-2xl font-bold">{stats.uniqueUsers}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold">Unique Tags</h3>
        <p className="text-2xl font-bold">{stats.allTags.length}</p>
      </div>
    </div>
  );
}
```

## Important Notes

### Field Safety
- Always check for field existence before accessing optional fields
- Use optional chaining (`?.`) when accessing nested properties
- The `category` object may not exist on all notes
- The `tags` array may be empty or undefined

### Performance Considerations
- Use pagination for large datasets
- Consider implementing search indexes for better query performance
- Cache frequently accessed data
- Use `limit()` and `startAfter()` for pagination

### Security
- Ensure admin-only access to the `notes` collection
- Validate user permissions before allowing data access
- Consider rate limiting for API endpoints

### Digital Garden Integration
- Use the `publish` field to filter public notes
- The `slug` field can be used for SEO-friendly URLs
- `linkedNoteIds` can create navigation between related notes
- Consider the `parentId` field for hierarchical note structures

This documentation covers all confirmed existing fields in your Firestore database and provides practical examples for fetching and rendering the data in an admin context.
