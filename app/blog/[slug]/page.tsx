import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPostsMeta, getPost } from '@/lib/blog';

export async function generateStaticParams() {
  return getAllPostsMeta().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const post = await getPost(slug);
    return {
      title: `${post.title} — FX World`,
      description: post.description,
    };
  } catch {
    return { title: 'Not found' };
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post;
  try {
    post = await getPost(slug);
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/50">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
              FX World
            </span>
          </Link>
          <Link href="/blog" className="text-xs text-muted-foreground hover:text-foreground">
            ← All posts
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 font-mono">
            <time>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            <span>·</span>
            <span>{post.readingTime} min read</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4 leading-tight">
            {post.title}
          </h1>
          {post.description && (
            <p className="text-lg text-muted-foreground leading-relaxed">
              {post.description}
            </p>
          )}
        </div>

        <div
          className="prose prose-invert prose-lg max-w-none
            prose-headings:font-semibold prose-headings:tracking-tight
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:leading-relaxed prose-p:text-foreground/85
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground
            prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
            prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        <div className="mt-16 pt-8 border-t border-border/50">
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to all posts
          </Link>
        </div>
      </article>
    </main>
  );
}