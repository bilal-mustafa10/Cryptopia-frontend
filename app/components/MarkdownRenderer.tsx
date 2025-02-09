// @/components/MarkdownRenderer.tsx

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export const MarkdownRenderer = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        img: ({ node, ...props }) => (
          <div className="relative inline-block">
            <img
              {...props}
              alt={props.alt}
              className="rounded-lg shadow-lg w-[400px] object-contain my-2"
            />
          </div>
        ),
      }}
      className="prose prose-zinc dark:prose-invert max-w-none"
    >
      {children}
    </ReactMarkdown>
  );
};
