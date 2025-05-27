
import React, { useEffect, useId, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '@/contexts/ThemeContext';

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const reactId = useId();
  // Generate a CSS-safe ID for Mermaid by removing colons from reactId
  const mermaidRenderId = `mermaid-svg-${reactId.replace(/:/g, '')}`;
  const componentInstanceId = `mermaid-container-${reactId.replace(/:/g, '')}`;

  const [svg, setSvg] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const currentChart = chart; // Capture chart for the effect closure

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      fontFamily: 'inherit',
      themeCSS: 'margin: 0; display: block; max-width: 100%;', // Ensure SVG is responsive within its container
      theme: theme === 'dark' ? 'dark' : 'default',
    });

    async function renderChart() {
      try {
        // Use the CSS-safe ID for mermaid.render
        const { svg: renderedSvg, bindFunctions } = await mermaid.render(mermaidRenderId, currentChart);
        // The rendered SVG will have id={mermaidRenderId}
        setSvg(renderedSvg);

        if (bindFunctions && containerRef.current) {
          // Call bindFunctions on the container that holds the SVG
          bindFunctions(containerRef.current);
        }
      } catch (error) {
        console.error('Error rendering Mermaid chart:', error);
        // Ensure error message is also wrapped consistently if needed, but for now, basic error.
        setSvg(`<pre style="color: red; background-color: hsl(var(--muted)); padding: 1rem; border-radius: 0.375rem;">Error rendering Mermaid chart:\n${(error as Error).message}\n\nChart content:\n${currentChart}</pre>`);
      }
    }

    void renderChart();
  }, [chart, mermaidRenderId, theme]); // mermaidRenderId is stable as it's derived from useId

  // Use a unique key for the component instance for proper re-rendering on critical changes.
  // Added bg-muted, padding, rounded corners, and overflow handling.
  return (
    <div 
      key={componentInstanceId + '-' + theme} 
      ref={containerRef} 
      className="bg-muted p-4 rounded-md overflow-x-auto my-4" // Added my-4 for vertical spacing similar to other blocks
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
};

export default MermaidDiagram;
