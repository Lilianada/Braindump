
import React, { useState, useEffect } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { ContentItem } from '@/types/content';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getNormalizedTags } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { useFirebaseContentData } from '@/hooks/useFirebaseContentData';
import { AppContextType } from '@/components/Layout';

/**
 * Extracts the main body of a Markdown string by removing YAML frontmatter.
 * Frontmatter must be at the very top of the file, delimited by '---' lines.
 * @param markdownContent The raw Markdown content, possibly with frontmatter.
 * @returns The Markdown content without frontmatter, or an empty string if input is null/undefined.
 */
function extractMarkdownBody(markdownContent: string | undefined | null): string {
  if (!markdownContent) return '';

  // Remove leading whitespace/newlines for robustness
  const trimmed = markdownContent.replace(/^\s*/, '');

  // Match and remove YAML frontmatter at the top of the file
  // This matches '---' at start of file, then any content (including newlines), then another '---' at the start of a line
  const frontmatterRegex = /^---[\s\S]*?^---\s*\n?/m;

  if (frontmatterRegex.test(trimmed)) {
    return trimmed.replace(frontmatterRegex, '').trim();
  }
  return trimmed;
}

const TagDetailPage: React.FC = () => {
  const { tagName } = useParams<{ tagName: string }>();
  const [relatedItems, setRelatedItems] = useState<ContentItem[]>([]);
  const decodedTagName = tagName ? decodeURIComponent(tagName) : '';
  
  const { setTocItems, setActiveTocItemId } = useOutletContext<AppContextType>();
  const { allNotesAndTopics } = useFirebaseContentData();
  
  // Clear TOC when component mounts
  useEffect(() => {
    // Reset TOC and active TOC item when TagDetailPage mounts
    setTocItems([]);
    setActiveTocItemId(null);
  }, [setTocItems, setActiveTocItemId]);

  useEffect(() => {
    if (decodedTagName && allNotesAndTopics.length > 0) {
      const filteredItems = allNotesAndTopics.filter(item => {
        const normalizedItemTags = getNormalizedTags(item.tags);
        return normalizedItemTags.includes(decodedTagName);
      });
      setRelatedItems(filteredItems);
    }
  }, [decodedTagName, allNotesAndTopics]);

  const isLoading = allNotesAndTopics.length === 0;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <span className="text-lg font-medium text-muted-foreground animate-pulse">
          Loading content for tag from Firebase: {decodedTagName}...
        </span>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 text-left">
          <Link to="/tags" className="text-sm text-primary hover:underline flex items-center space-x-2">
            <ArrowLeft className='h-4 w-4' aria-label='Back button'/>
            View all tags
          </Link>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Content tagged with: <span className="text-primary capitalize">{decodedTagName}</span>
              </CardTitle>
            </div>
            <CardDescription>
              Found {relatedItems.length} item(s) matching this tag from Firebase.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {relatedItems.length > 0 ? (
              <ul className="space-y-4">
                {relatedItems.map(item => (
                  <li key={item.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <Link to={`/content/${item.path}`} className="group">
                      <h3 className="text-base font-medium text-primary group-hover:underline flex items-center">
                        {item.title}
                      </h3>
                      {item.path && <p className="text-sm text-muted-foreground">Path: {item.path}</p>}
                      {item.content && (
                        <div className="text-sm text-foreground/80 mt-1 line-clamp-2">
                          <ReactMarkdown>
                            {extractMarkdownBody(item.content).substring(0, 150) + "..."}
                          </ReactMarkdown>
                        </div>
                      )}
                      {item.tags && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {getNormalizedTags(item.tags).map(tag => (
                            tag && <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No content found for this tag in Firebase.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default TagDetailPage;
