"use client";

import PostCard from "./PostCard";

export default function SocialFeed({ posts, reactions, onReact }) {
  return <section style={{ display: "grid", gap: 11 }}>{posts.map((post) => <PostCard key={post.id} post={post} reaction={reactions[post.id]} onReact={(type) => onReact(post.id, type)} />)}</section>;
}
