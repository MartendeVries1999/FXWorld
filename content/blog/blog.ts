import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export type BlogPostMeta = {
  slug: string;
  title: string;
  date: string;
  description: string;
  readingTime: number;
};

export type BlogPost = BlogPostMeta & {
  contentHtml: string;
};

function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

function readPost(slug: string): { data: any; content: string } {
  const fullPath = path.join(BLOG_DIR, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return matter(fileContents);
}

function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function getAllPostsMeta(): BlogPostMeta[] {
  const slugs = getAllSlugs();
  const posts = slugs.map((slug) => {
    const { data, content } = readPost(slug);
    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? '1970-01-01',
      description: data.description ?? '',
      readingTime: estimateReadingTime(content),
    };
  });
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string): Promise<BlogPost> {
  const { data, content } = readPost(slug);
  const processed = await remark().use(html).process(content);
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? '1970-01-01',
    description: data.description ?? '',
    readingTime: estimateReadingTime(content),
    contentHtml: processed.toString(),
  };
}