import BlogPostForm from "@/components/shared/BlogPostForm/BlogPostForm";

export const metadata = {
  title: "Nuevo Post | Admin",
};

export default function NewNovedadesPage() {
  return <BlogPostForm mode="create" />;
}
