import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'

type Props = {
  markdown: string
}

const components: Components = {
  h2: ({ children }) => (
    <h2 className="mt-10 mb-4 font-display text-2xl font-semibold tracking-tight text-slate-900 first:mt-0 md:text-3xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 mb-3 font-display text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 text-base leading-7 text-slate-700 last:mb-0">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="my-5 list-disc space-y-2 pl-6 text-base leading-7 text-slate-700 marker:text-slate-400">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-5 list-decimal space-y-2 pl-6 text-base leading-7 text-slate-700 marker:text-slate-500">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-blue-600 underline decoration-blue-600/30 underline-offset-2 transition hover:decoration-blue-600"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-slate-900">{children}</strong>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-4 border-blue-200 bg-slate-50 py-3 pr-4 pl-5 text-slate-700 italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-10 border-slate-200" />,
}

export function BlogMarkdown({ markdown }: Props) {
  return (
    <div className="text-slate-800">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
