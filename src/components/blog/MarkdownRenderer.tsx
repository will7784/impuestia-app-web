import ReactMarkdown from 'react-markdown'

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-extrabold text-[#1a1a2e] mt-12 mb-6 leading-tight tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-[#1a1a2e] mt-10 mb-4 leading-tight border-b border-gray-100 pb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-bold text-[#1a1a2e] mt-8 mb-3 leading-tight">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold text-[#1a1a2e] mt-6 mb-2">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-base text-[#4a4a5a] leading-relaxed mb-4">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-[#1a1a2e]">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-[#4a4a5a]">
              {children}
            </em>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#0073aa] bg-[#f0f2f5] pl-5 pr-4 py-3 rounded-r-lg my-6 text-[#4a4a5a]">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside my-4 space-y-2 text-[#4a4a5a] pl-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside my-4 space-y-2 text-[#4a4a5a] pl-2">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">
              {children}
            </li>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0073aa] font-medium hover:underline transition-colors"
            >
              {children}
            </a>
          ),
          hr: () => (
            <hr className="my-8 border-gray-200" />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="w-full text-sm text-left border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#f0f2f5] text-[#1a1a2e] font-semibold">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="text-[#4a4a5a]">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-gray-100">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3">
              {children}
            </td>
          ),
          code: ({ children }) => (
            <code className="bg-[#f0f2f5] text-[#6b2d5c] px-1.5 py-0.5 rounded text-sm font-mono">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-[#1a1a2e] text-white p-4 rounded-xl overflow-x-auto my-6 text-sm">
              {children}
            </pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
