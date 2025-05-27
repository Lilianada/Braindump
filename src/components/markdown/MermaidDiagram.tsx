
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
  const { effectiveTheme } = useTheme(); // effectiveTheme gives 'dark' or 'light'

  useEffect(() => {
    const currentChart = chart; // Capture chart for the effect closure

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      fontFamily: 'inherit',
      themeCSS: 'margin: 1.5rem auto 0;', // As per example
      theme: effectiveTheme === 'dark' ? 'dark' : 'default',
    });

    async function renderChart() {
      try {
        // console.log(`[MermaidDiagram] Rendering chart with id: ${id} and theme: ${effectiveTheme}`);
        // console.log(`[MermaidDiagram] Chart content:\n${currentChart}`);
        
        // Ensure the container exists for mermaid to find, though it renders to string here.
        // If mermaid needs a live DOM element for `render`, this approach needs adjustment.
        // However, `mermaid.render` typically generates SVG string.
        const { svg: renderedSvg, bindFunctions } = await mermaid.render(id, currentChart);
        setSvg(renderedSvg);

        if (bindFunctions && containerRef.current) {
          bindFunctions(containerRef.current);
        }
      } catch (error) {
        console.error('Error rendering Mermaid chart:', error);
        // Display error in the chart's place
        setSvg(`<pre style="color: red;">Error rendering Mermaid chart:\n${(error as Error).message}\n\nChart content:\n${currentChart}</pre>`);
      }
    }

    void renderChart();
  }, [chart, id, effectiveTheme]);

  // Using a key on the div to force re-render if svg content changes significantly (e.g. error -> chart)
  return <div key={id + effectiveTheme} ref={containerRef} dangerouslySetInnerHTML={{ __html: svg }} />;
};

export default MermaidDiagram;
