// // app/blog/[id]/page.tsx
// import { notFound } from "next/navigation";
// import { getBlogPost, getAllBlogPosts } from "@/data/blogs";
// import Navbar from "@/components/navbar";
// import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
// import Link from "next/link";
// import type { Metadata } from "next";

// // Define proper types
// interface BlogPost {
//   id: string;
//   title: string;
//   excerpt: string;
//   content: string;
//   date: string;
//   readTime: string;
//   author: string;
//   tags: string[];
//   image: string;
// }

// // Modified interface to satisfy PageProps requirement
// interface BlogPostPageProps {
//   params: { id: string };
//   then?: never;
//   catch?: never;
//   finally?: never;
//   [Symbol.toStringTag]?: never;
// }

// export async function generateMetadata({
//   params,
// }: {
//   params: { id: string };
// }): Promise<Metadata> {
//   const post = await getBlogPost(params.id);

//   if (!post) {
//     return {
//       title: "Post Not Found",
//     };
//   }

//   return {
//     title: `${post.title} - GitHub README Generator Blog`,
//     description: post.excerpt,
//     openGraph: {
//       title: post.title,
//       description: post.excerpt,
//       images: [post.image],
//     },
//   };
// }

// export async function generateStaticParams() {
//   const posts = await getAllBlogPosts();
//   return posts.map((post) => ({
//     id: post.id,
//   }));
// }

// export default async function BlogPostPage({ params }: BlogPostPageProps) {
//   const post = await getBlogPost(params.id);

//   if (!post) {
//     notFound();
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />

//       <div className="pt-16 pb-16">
//         <div className="container mx-auto px-4 max-w-4xl">
//           <Link
//             href="/blog"
//             className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-8 transition-colors"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Back to Blog
//           </Link>

//           <article className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="p-8">
//               <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
//                 <div className="flex items-center gap-2">
//                   <Calendar className="w-4 h-4" />
//                   <span>{new Date(post.date).toLocaleDateString()}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Clock className="w-4 h-4" />
//                   <span>{post.readTime}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <User className="w-4 h-4" />
//                   <span>{post.author}</span>
//                 </div>
//               </div>

//               <h1 className="text-4xl font-bold text-gray-900 mb-6">
//                 {post.title}
//               </h1>

//               <div className="flex flex-wrap gap-2 mb-8">
//                 {post.tags.map((tag) => (
//                   <span
//                     key={tag}
//                     className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full"
//                   >
//                     {tag}
//                   </span>
//                 ))}
//               </div>

//               <div
//                 className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-500 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700"
//                 dangerouslySetInnerHTML={{ __html: post.content }}
//               />
//             </div>
//           </article>

//           <div className="mt-16">
//             <h2 className="text-2xl font-bold text-gray-900 mb-8">
//               Related Posts
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {(await getAllBlogPosts())
//                 .filter((p) => p.id !== post.id)
//                 .slice(0, 2)
//                 .map((relatedPost) => (
//                   <Link
//                     key={relatedPost.id}
//                     href={`/blog/${relatedPost.id}`}
//                     className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-6"
//                   >
//                     <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
//                       {relatedPost.title}
//                     </h3>
//                     <p className="text-gray-600 text-sm line-clamp-2">
//                       {relatedPost.excerpt}
//                     </p>
//                   </Link>
//                 ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
export default function BlogPostPage() {
  return "blog post page";
}
