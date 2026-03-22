import { notFound } from "next/navigation";
import { BlogPostService } from "@/server/services/blog-post.service";
import BlogPostForm from "@/components/shared/BlogPostForm/BlogPostForm";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  try {
    const post = await BlogPostService.findById(id);
    return { title: `Editar: ${post.title} | Admin` };
  } catch {
    return { title: "Editar Post | Admin" };
  }
}

export default async function EditNovedadesPage({ params }: Props) {
  const { id } = await params;
  let post;
  try {
    post = await BlogPostService.findById(id);
  } catch {
    notFound();
  }

  if (!post) notFound();

  return (
    <BlogPostForm
      mode="edit"
      postId={post._id}
      initialData={{
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
        featuredImage: post.featuredImage || "",
        author: post.author,
        status: post.status,
        seoTitle: post.seoTitle || "",
        seoDescription: post.seoDescription || "",
      }}
    />
  );
}
