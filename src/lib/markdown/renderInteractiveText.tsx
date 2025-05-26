
import React from 'react';
import { Link } from 'react-router-dom';
import { ContentItem } from '@/content/mockData';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { extractMarkdownBody } from '@/lib/utils';

export const renderInteractiveText = (
  textNode: string,
  allNotes: ContentItem[],
  glossaryTerms: ContentItem[],
  baseKey: string
): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let remainingText = textNode;

  const escapedGlossaryTitles = glossaryTerms.map(term => 
    term.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );
  
  const combinedRegexParts = [];
  combinedRegexParts.push(`\\[\\[(.*?)\\]\\]`); 
  if (escapedGlossaryTitles.length > 0) {
    combinedRegexParts.push(`\\b(${escapedGlossaryTitles.join('|')})\\b`);
  }

  if (combinedRegexParts.length === 0) {
    return [remainingText];
  }

  const combinedRegex = new RegExp(combinedRegexParts.join('|'), 'gi');

  let lastIndex = 0;
  let match;
  let partIndex = 0;

  while ((match = combinedRegex.exec(remainingText)) !== null) {
    const matchIndex = match.index;
    
    if (matchIndex > lastIndex) {
      parts.push(remainingText.substring(lastIndex, matchIndex));
    }

    const noteTitle = match[1]; 
    const glossaryWord = escapedGlossaryTitles.length > 0 && match[2] ? match[2] : null;

    if (noteTitle && !glossaryWord) {
      const note = allNotes.find(n => n.title.toLowerCase() === noteTitle.toLowerCase());
      if (note) {
        parts.push(
          <Link key={`${baseKey}-note-${partIndex}`} to={`/content/${note.path}`} className="custom-link">
            {noteTitle}
          </Link>
        );
      } else {
        parts.push(`[[${noteTitle}]]`);
      }
    } else if (glossaryWord) {
      const term = glossaryTerms.find(t => t.title.toLowerCase() === glossaryWord.toLowerCase());
      const termContentForHover = term?.content ? extractMarkdownBody(term.content.replace(/\\n/g, '\n')).split('\n')[0] : '';

      if (term && termContentForHover) {
        parts.push(
          <HoverCard key={`${baseKey}-glossary-${partIndex}`}>
            <HoverCardTrigger asChild>
              <span className="text-primary underline decoration-dotted cursor-pointer">{glossaryWord}</span>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-popover text-popover-foreground p-4 shadow-md rounded-md border">
              <h4 className="font-semibold mb-1">{term.title}</h4>
              <p className="text-sm">{termContentForHover}</p>
            </HoverCardContent>
          </HoverCard>
        );
      } else {
        parts.push(glossaryWord);
      }
    } else if (noteTitle) {
         const note = allNotes.find(n => n.title.toLowerCase() === noteTitle.toLowerCase());
         if (note) {
           parts.push(
             <Link key={`${baseKey}-note-${partIndex}`} to={`/content/${note.path}`} className="custom-link">
               {noteTitle}
             </Link>
           );
         } else {
           parts.push(`[[${noteTitle}]]`); 
         }
    } else {
        parts.push(match[0]);
    }

    lastIndex = combinedRegex.lastIndex;
    partIndex++;
  }

  if (lastIndex < remainingText.length) {
    parts.push(remainingText.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : [textNode];
};
