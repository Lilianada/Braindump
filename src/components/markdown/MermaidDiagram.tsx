
import React, { useEffect, useId, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '@/contexts/ThemeContext';

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const reactId = useId();
  // Generate a CSS-safe ID for Mermaid by removing colons and replacing with a random number
  const mermaidRenderId = `mermaid-${reactId.replace(/[:.]/g, '')}-${Math.floor(Math.random() * 10000)}`;
  const componentInstanceId = `mermaid-container-${reactId.replace(/[:.]/g, '')}`;

  const [svg, setSvg] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const currentChart = chart; // Capture chart for the effect closure

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      fontFamily: 'inherit',
      themeCSS: 'margin: 0; padding: 0; width: 100%; max-width: 100%;', // Ensure SVG is responsive within its container
      theme: theme === 'dark' ? 'dark' : 'default',
    });

    async function renderChart() {
      try {
        // Use the CSS-safe ID for mermaid.render
        const { svg: renderedSvg, bindFunctions } = await mermaid.render(mermaidRenderId, currentChart);
        setSvg(renderedSvg);

        if (bindFunctions && containerRef.current) {
          // Call bindFunctions on the container that holds the SVG
          bindFunctions(containerRef.current);
        }
      } catch (error) {
        console.error('Error rendering Mermaid chart:', error);
        setSvg(`<pre style="color: red; background-color: hsl(var(--muted)); padding: 1rem; border-radius: 0.375rem;">Error rendering Mermaid chart:\n${(error as Error).message}\n\nChart content:\n${currentChart}</pre>`);
      }
    }

    void renderChart();
  }, [chart, mermaidRenderId, theme]);

  // Use a unique key for the component instance for proper re-rendering
  return (
    <div 
      key={componentInstanceId + '-' + theme} 
      ref={containerRef} 
      className="bg-muted p-4 rounded-md overflow-x-auto my-4" 
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
};

export default MermaidDiagram;
