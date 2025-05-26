
import React from 'react';
import { Link } from 'react-router-dom';
import { ContentItem } from '@/content/mockData';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { extractMarkdownBody } from '@/lib/utils';
import SimpleRenderer from '@/components/SimpleRenderer'; // Added import
import { TocItem } from '@/types'; // Added import for dummy function type

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
  let partIndex = 0;
  let match;

  while ((match = combinedRegex.exec(remainingText)) !== null) {
    const matchIndex = match.index;
    
    if (matchIndex > lastIndex) {
      parts.push(remainingText.substring(lastIndex, matchIndex));
    }

    const wikiLinkTitle = match[1]; 
    const glossaryWord = match[2] && escapedGlossaryTitles.length > 0 ? match[2] : null;

    if (wikiLinkTitle) {
      const note = allNotes.find(n => n.title.toLowerCase() === wikiLinkTitle.toLowerCase());
      if (note) {
        const fullMarkdownForPopover = note.content ? extractMarkdownBody(note.content.replace(/\\n/g, '\n')) : '';
        const plainTextPreview = note.content 
                               ? extractMarkdownBody(note.content.replace(/\\n/g, '\n')).split('\n')[0] 
                               : 'No preview available.';
        parts.push(
          <HoverCard key={`${baseKey}-wikilink-${partIndex}`}>
            <HoverCardTrigger asChild>
              <Link to={`/content/${note.path}`} className="custom-link">
                {wikiLinkTitle}
              </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-popover text-popover-foreground p-4 shadow-md rounded-md border text-sm">
              <h4 className="font-semibold mb-1 text-base">{note.title}</h4>
              {note.content && fullMarkdownForPopover ? (
                <SimpleRenderer
                  content={fullMarkdownForPopover}
                  allNotes={[]} 
                  glossaryTerms={[]} 
                  setTocItems={(() => {}) as React.Dispatch<React.SetStateAction<TocItem[]>>} 
                />
              ) : (
                <p>{plainTextPreview}</p>
              )}
            </HoverCardContent>
          </HoverCard>
        );
      } else { 
        parts.push(
          <HoverCard key={`${baseKey}-wikilink-missing-${partIndex}`}>
            <HoverCardTrigger asChild>
              <span className="custom-link !text-destructive cursor-help">
                {`[[${wikiLinkTitle}]]`}
              </span>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-popover text-popover-foreground p-4 shadow-md rounded-md border text-sm">
              <p>Content not available. Inform the author.</p>
            </HoverCardContent>
          </HoverCard>
        );
      }
    } else if (glossaryWord) {
      const term = glossaryTerms.find(t => t.title.toLowerCase() === glossaryWord.toLowerCase());
      const termFullMarkdown = term?.content ? extractMarkdownBody(term.content.replace(/\\n/g, '\n')) : '';
      const termPlainTextPreview = term?.content ? extractMarkdownBody(term.content.replace(/\\n/g, '\n')).split('\n')[0] : '';

      if (term && term.title) {
        parts.push(
          <HoverCard key={`${baseKey}-glossary-${partIndex}`}>
            <HoverCardTrigger asChild>
              <span className="text-primary underline decoration-dotted cursor-pointer">{glossaryWord}</span>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-popover text-popover-foreground p-4 shadow-md rounded-md border text-sm">
              <h4 className="font-semibold mb-1 text-base">{term.title}</h4>
              {term.content && termFullMarkdown ? (
                <SimpleRenderer
                  content={termFullMarkdown}
                  allNotes={[]}
                  glossaryTerms={[]}
                  setTocItems={(() => {}) as React.Dispatch<React.SetStateAction<TocItem[]>>}
                />
              ) : (
                <p>{termPlainTextPreview || "No definition preview available."}</p>
              )}
            </HoverCardContent>
          </HoverCard>
        );
      } else { 
        parts.push(glossaryWord); 
      }
    }
    
    lastIndex = combinedRegex.lastIndex;
    partIndex++;
  }

  if (lastIndex < remainingText.length) {
    parts.push(remainingText.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : [textNode];
};
