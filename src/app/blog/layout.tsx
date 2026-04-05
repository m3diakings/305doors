import { BlogShell } from '@/components/site/BlogShell'

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <BlogShell>{children}</BlogShell>
}
