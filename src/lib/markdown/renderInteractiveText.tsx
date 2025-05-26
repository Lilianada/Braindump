
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
  // Regex for [[wiki links]] - Group 1
  combinedRegexParts.push(`\\[\\[(.*?)\\]\\]`); 
  // Regex for glossary terms - Group 2
  if (escapedGlossaryTitles.length > 0) {
    combinedRegexParts.push(`\\b(${escapedGlossaryTitles.join('|')})\\b`);
  }

  if (combinedRegexParts.length === 0) {
    return [remainingText]; // Return original text if no patterns to match
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

    const wikiLinkTitle = match[1]; // Content of [[...]]
    const glossaryWord = match[2] && escapedGlossaryTitles.length > 0 ? match[2] : null; // Matched glossary word

    if (wikiLinkTitle) { // Matched a [[wiki link]]
      const note = allNotes.find(n => n.title.toLowerCase() === wikiLinkTitle.toLowerCase());
      if (note) {
        const previewContent = note.content 
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
              <p>{previewContent || "No content preview."}</p>
            </HoverCardContent>
          </HoverCard>
        );
      } else { // Wiki link target not found
        parts.push(
          <HoverCard key={`${baseKey}-wikilink-missing-${partIndex}`}>
            <HoverCardTrigger asChild>
              {/* Using custom-link for background, but overriding text color to indicate missing link */}
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
    } else if (glossaryWord) { // Matched a glossary term
      const term = glossaryTerms.find(t => t.title.toLowerCase() === glossaryWord.toLowerCase());
      // Ensure term and content for hover exists
      const termContentForHover = term?.content ? extractMarkdownBody(term.content.replace(/\\n/g, '\n')).split('\n')[0] : '';

      if (term && termContentForHover) {
        parts.push(
          <HoverCard key={`${baseKey}-glossary-${partIndex}`}>
            <HoverCardTrigger asChild>
              <span className="text-primary underline decoration-dotted cursor-pointer">{glossaryWord}</span>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-popover text-popover-foreground p-4 shadow-md rounded-md border text-sm">
              <h4 className="font-semibold mb-1 text-base">{term.title}</h4>
              <p>{termContentForHover}</p>
            </HoverCardContent>
          </HoverCard>
        );
      } else { // Glossary term found but no content for hover, or term itself not found (shouldn't happen if regex matched)
        parts.push(glossaryWord); // Fallback to just displaying the word
      }
    }
    // This 'else' should ideally not be reached if the regex correctly captures one or the other.
    // else { 
    //   parts.push(match[0]); // Fallback for unforeseen cases
    // }

    lastIndex = combinedRegex.lastIndex;
    partIndex++;
  }

  if (lastIndex < remainingText.length) {
    parts.push(remainingText.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : [textNode]; // Ensure always returning an array, even if just original text
};
