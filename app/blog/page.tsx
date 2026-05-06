import Link from 'next/link';
import { getAllPostsMeta } from '@/lib/blog';

export const metadata = {
  title: 'Blog — FX World',
  description: 'Currency timing guides and travel money tips.',
};

export default function BlogIndex() {
  const posts = getAllPostsMeta();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/50">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
              FX World
            </span>
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Blog
          </div>
          <h1 className="text-4xl font-semibold tracking-tight mb-3">
            Notes on currencies and travel
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Practical guides on timing your currency conversions, understanding fees, and getting more from your travel budget.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-muted-foreground text-sm">No posts yet. Check back soon.</p>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block group border-b border-border/50 pb-8 last:border-0"
              >
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2 font-mono">
                  <time>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                  <span>·</span>
                  <span>{post.readingTime} min read</span>
                </div>
                <h2 className="text-2xl font-semibold tracking-tight mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {post.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}