import React, { useEffect, useRef } from 'react';
import { marked } from 'marked';

interface MarkdownViewerProps {
  markdownContent: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ markdownContent }) => {
  const viewerRef = useRef<HTMLDivElement>(null);

  // Sanitize HTML - basic example, consider a more robust sanitizer for production
  const sanitizeHtml = (htmlString: string): string => {
    const DANGEROUS_TAGS = ['script', 'iframe', 'object', 'embed', 'style', 'link'];
    const DANGEROUS_ATTRS = ['onclick', 'onerror', 'onload', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit', 'href']; // only check for javascript: links

    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;

    // Remove dangerous tags
    DANGEROUS_TAGS.forEach(tag => {
      const elements = tempDiv.getElementsByTagName(tag);
      while (elements[0]) {
        elements[0].parentNode?.removeChild(elements[0]);
      }
    });
    
    // Remove dangerous attributes
    const allElements = tempDiv.getElementsByTagName('*');
    for (let i = 0; i < allElements.length; i++) {
      const el = allElements[i];
      for (let j = 0; j < el.attributes.length; j++) {
        const attrName = el.attributes[j].name.toLowerCase();
        const attrValue = el.attributes[j].value.toLowerCase();
        if (DANGEROUS_ATTRS.includes(attrName) || (attrName === 'href' && attrValue.startsWith('javascript:'))) {
          el.removeAttribute(el.attributes[j].name);
        }
      }
    }
    return tempDiv.innerHTML;
  };
  
  const rawHtml = marked.parse(markdownContent || "*No content to preview.*") as string;
  const safeHtml = sanitizeHtml(rawHtml);

  useEffect(() => {
    // Ensure links in markdown preview open in a new tab
    if (viewerRef.current) {
      const links = viewerRef.current.getElementsByTagName('a');
      for (let i = 0; i < links.length; i++) {
        links[i].setAttribute('target', '_blank');
        links[i].setAttribute('rel', 'noopener noreferrer');
         // Add styling for links within prose
        links[i].classList.add('text-blue-400', 'hover:text-blue-300', 'underline');
      }
    }
  }, [safeHtml]);

  return (
    <div
      ref={viewerRef}
      className="w-full h-96 lg:h-[500px] p-4 border border-slate-600 rounded-lg shadow-inner overflow-y-auto bg-slate-700 text-gray-200 prose prose-sm sm:prose-base prose-invert prose-slate max-w-none 
                 prose-headings:text-slate-100 prose-p:text-slate-300 prose-strong:text-slate-200 prose-em:text-slate-200 
                 prose-blockquote:border-slate-500 prose-blockquote:text-slate-400
                 prose-code:bg-slate-800 prose-code:text-emerald-400 prose-code:p-1 prose-code:rounded-md prose-code:text-sm
                 prose-pre:bg-slate-800 prose-pre:p-4 prose-pre:rounded-md
                 prose-ul:text-slate-300 prose-ol:text-slate-300 
                 prose-li:marker:text-slate-400"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
      aria-live="polite"
      aria-label="Markdown Preview"
    />
  );
};

export default MarkdownViewer;