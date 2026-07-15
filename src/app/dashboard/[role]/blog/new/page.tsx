"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { FileText, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

// CKEditor needs the browser — load it client-side only.
const BlogEditor = dynamic(() => import("@/components/dashboard/blog-editor"), {
  ssr: false,
  loading: () => <Skeleton className="h-[360px] w-full rounded-lg" />,
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminAddBlogPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("A title is required.");
      return;
    }
    if (!content.replace(/<[^>]*>/g, "").trim()) {
      toast.error("Blog content cannot be empty.");
      return;
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim() || slugify(title),
      excerpt: excerpt.trim(),
      coverImage: coverImage.trim(),
      content,
      publishedAt: new Date().toISOString(),
    };

    setSubmitting(true);
    // No blog backend yet — surface the payload and confirm to the admin.
    
    console.log("New blog post:", payload);
    toast.success("Blog post saved.");
    setSubmitting(false);
  }

  return (
    <div className="mx-auto w-full  space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl tracking-[-0.02em] text-foreground">
          Add blog post
        </h1>
        <p className="text-sm text-muted-foreground">
          Draft a new article with the rich-text editor, then publish to the store.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Details</CardTitle>
            <CardDescription>Basic metadata for the post.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="The quiet ritual of slow mornings"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value);
                }}
                placeholder="auto-generated-from-title"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Input
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A short summary shown in listings and previews."
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="cover">Cover image URL</Label>
              <Input
                id="cover"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://…"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Content</CardTitle>
            <CardDescription>
              Use the editor to write and format the post body.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BlogEditor value={content} onChange={setContent} />
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 data-icon="inline-start" className="animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <FileText data-icon="inline-start" />
                Publish post
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
