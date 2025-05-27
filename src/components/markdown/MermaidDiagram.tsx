
```typescript
import React, { useEffect, useId, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '@/contexts/ThemeContext'; // Using our existing ThemeContext

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const id = `mermaid-diagram-${useId()}`;
  const [svg, setSvg] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } // Changed from effectiveTheme to theme
 = useTheme(); 

  useEffect(() => {
    const currentChart = chart; // Capture chart for the effect closure

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      fontFamily: 'inherit',
      themeCSS: 'margin: 1.5rem auto 0;', // As per example
      theme: theme === 'dark' ? 'dark' : 'default', // Changed from effectiveTheme
    });

    async function renderChart() {
      try {
        // console.log(`[MermaidDiagram] Rendering chart with id: ${id} and theme: ${theme}`);
        // console.log(`[MermaidDiagram] Chart content:\n${currentChart}`);
        
        const { svg: renderedSvg, bindFunctions } = await mermaid.render(id, currentChart);
        setSvg(renderedSvg);

        if (bindFunctions && containerRef.current) {
          bindFunctions(containerRef.current);
        }
      } catch (error) {
        console.error('Error rendering Mermaid chart:', error);
        setSvg(`<pre style="color: red;">Error rendering Mermaid chart:\n${(error as Error).message}\n\nChart content:\n${currentChart}</pre>`);
      }
    }

    void renderChart();
  }, [chart, id, theme]); // Changed from effectiveTheme

  // Using a key on the div to force re-render if svg content changes significantly (e.g. error -> chart)
  // Also, include 'theme' in the key to ensure re-render on theme change if Mermaid SVG itself doesn't change styling dynamically based on CSS vars for theme.
  return <div key={`${id}-${theme}`} ref={containerRef} dangerouslySetInnerHTML={{ __html: svg }} />;
};

export default MermaidDiagram;

```
