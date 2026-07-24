"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { COSMIC_UNITS } from "../../../lib/cosmic";
import StarParticles from "../../../components/cosmic/StarParticles";
import { useCosmicUser } from "../../../components/cosmic/useCosmicUser";
import FriendsList from "./components/FriendsList";
import AddFriend from "./components/AddFriend";
import SocialFeed from "./components/SocialFeed";
import PostComposer from "./components/PostComposer";
import SocialLeaderboard from "./components/SocialLeaderboard";
import SocialProfilePreview from "./components/SocialProfilePreview";

const FRIENDS_KEY = "sheikhduo-cosmic-friends";
const POSTS_KEY = "sheikhduo-cosmic-social-posts";
const REACTIONS_KEY = "sheikhduo-cosmic-social-reactions";
const DEFAULT_FRIENDS = [
  { id: "amina", name: "Amina", avatar: "🌙", color: "#685bc3", xp: 860, streak: 12, mastery: 48, badge: "Steady flame badge" },
  { id: "yusuf", name: "Yusuf", avatar: "🪐", color: "#176d87", xp: 1240, streak: 21, mastery: 64, badge: "Mastery orbit badge" },
  { id: "maryam", name: "Maryam", avatar: "✨", color: "#a45d91", xp: 715, streak: 8, mastery: 42, badge: "Gentle review badge" },
];
const SEED_POSTS = [
  { id: "seed-1", author: "Amina", avatar: "🌙", avatarColor: "#685bc3", label: "Achievement unlocked", content: "Seven days of steady learning. Small steps really do become constellations.", createdAt: 1773606000000, reactions: { like: 8, star: 4, heart: 3 } },
  { id: "seed-2", author: "Yusuf", avatar: "🪐", avatarColor: "#176d87", label: "Daily challenge", content: "Finished today’s cosmic trial. The review questions felt much clearer today.", createdAt: 1773506000000, reactions: { like: 10, star: 7, heart: 2 } },
];
function readJson(key, fallback) { try { return JSON.parse(window.localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } }
function masteryFor(user) { const all = COSMIC_UNITS.flatMap((unit) => unit.ayahs); const mastered = new Set(user.ayahsMastered || []); const completed = all.filter((ayah) => mastered.has(ayah.id)).length; const weak = all.filter((ayah) => (user.weakAyahs || []).includes(ayah.id)).length; return all.length ? Math.max(0, Math.round(((completed / all.length) * 100) - ((weak / all.length) * 100))) : 0; }
function challengeCount() { return Object.keys(window.localStorage).filter((key) => { if (!key.startsWith("sheikhduo-cosmic-challenge-")) return false; return readJson(key, null)?.completed; }).length; }

export default function CosmicSocialPage() {
  const user = useCosmicUser();
  const [friends, setFriends] = useState([]);
  const [posts, setPosts] = useState([]);
  const [reactions, setReactions] = useState({});
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const mastery = masteryFor(user);
  useEffect(() => { setFriends(readJson(FRIENDS_KEY, DEFAULT_FRIENDS)); setPosts(readJson(POSTS_KEY, [])); setReactions(readJson(REACTIONS_KEY, {})); setLoaded(true); }, []);
  const systemPosts = useMemo(() => {
    const result = [];
    if ((user.surahsCompleted || []).length) result.push({ id: "system-surah", author: user.username || "You", avatar: "✦", avatarColor: "#b17b2d", label: "Surah progress", content: `Completed ${(user.surahsCompleted || []).length} surah${user.surahsCompleted.length === 1 ? "" : "s"} on the learning path.`, createdAt: Date.now() - 60000, reactions: { like: 0, star: 0, heart: 0 } });
    if ((user.ayahsMastered || []).length) result.push({ id: "system-mastery", author: user.username || "You", avatar: "◈", avatarColor: "#23726c", label: "Mastery update", content: `Mastered ${(user.ayahsMastered || []).length} ayah${user.ayahsMastered.length === 1 ? "" : "s"}; current cosmic mastery is ${mastery}%.`, createdAt: Date.now() - 120000, reactions: { like: 0, star: 0, heart: 0 } });
    if (loaded && challengeCount()) result.push({ id: "system-challenge", author: user.username || "You", avatar: "⚡", avatarColor: "#5b65bc", label: "Daily challenge", content: "Completed a daily cosmic trial and added another light to the orbit.", createdAt: Date.now() - 180000, reactions: { like: 0, star: 0, heart: 0 } });
    if ((user.streak || 0) >= 7) result.push({ id: "system-streak", author: user.username || "You", avatar: "🔥", avatarColor: "#b55252", label: "Streak milestone", content: `A ${user.streak}-day learning streak is glowing brightly.`, createdAt: Date.now() - 240000, reactions: { like: 0, star: 0, heart: 0 } });
    return result;
  }, [loaded, mastery, user]);
  const feed = useMemo(() => [...posts, ...systemPosts, ...SEED_POSTS].sort((left, right) => right.createdAt - left.createdAt), [posts, systemPosts]);
  const reactionData = useMemo(() => Object.fromEntries(feed.map((post) => [post.id, reactions[post.id] || { values: post.reactions || { like: 0, star: 0, heart: 0 }, selected: [] }])), [feed, reactions]);
  const leaderboard = useMemo(() => [{ id: "you", name: user.username || "You", avatar: "✦", xp: user.xp || 0, streak: user.streak || 0, mastery, isYou: true }, ...friends], [friends, mastery, user]);
  function persistFriends(next) { setFriends(next); window.localStorage.setItem(FRIENDS_KEY, JSON.stringify(next)); }
  function addFriend(name) { const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-"); if (friends.some((friend) => friend.id === id || friend.name.toLowerCase() === name.toLowerCase())) return false; const known = DEFAULT_FRIENDS.find((friend) => friend.name.toLowerCase() === name.toLowerCase()); const created = known || { id, name, avatar: "🛰", color: ["#5b65bc", "#8a5aa0", "#1a7786"][name.length % 3], xp: 120, streak: 1, mastery: 8, badge: "New cosmic companion" }; persistFriends([...friends, created]); return true; }
  function removeFriend(id) { persistFriends(friends.filter((friend) => friend.id !== id)); if (selectedFriend?.id === id) setSelectedFriend(null); }
  function addPost(content) { const post = { id: `post-${Date.now()}`, author: user.username || "You", avatar: "✦", avatarColor: "#b17b2d", label: "Learning update", content, createdAt: Date.now(), reactions: { like: 0, star: 0, heart: 0 } }; const next = [post, ...posts]; setPosts(next); window.localStorage.setItem(POSTS_KEY, JSON.stringify(next)); }
  function react(postId, type) { const base = reactionData[postId] || { values: { like: 0, star: 0, heart: 0 }, selected: [] }; const hadReaction = base.selected.includes(type); const next = { ...reactions, [postId]: { values: { ...base.values, [type]: Math.max(0, (base.values[type] || 0) + (hadReaction ? -1 : 1)) }, selected: hadReaction ? base.selected.filter((item) => item !== type) : [...base.selected, type] } }; setReactions(next); window.localStorage.setItem(REACTIONS_KEY, JSON.stringify(next)); }
  return <main className="cosmic-dark cd-ecosystem-shell" style={{ position: "relative", minHeight: "calc(100vh - 64px)", padding: "42px 16px 90px" }}><StarParticles count={56} color="#c9b7ff" /><section style={{ position: "relative", width: "min(1180px,100%)", margin: "0 auto", display: "grid", gap: 18 }}><header style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 18, flexWrap: "wrap" }}><div><p style={{ margin: 0, color: "#ffdc8a", fontSize: 12, fontWeight: 900, letterSpacing: ".15em" }}>COSMIC COMMUNITY</p><h1 style={{ margin: "8px 0", fontSize: "clamp(2.8rem,8vw,5.5rem)", lineHeight: .92, letterSpacing: "-.07em" }}>Learn together.</h1><p style={{ maxWidth: 580, margin: 0, color: "#c3d3e9", lineHeight: 1.6 }}>Share your learning light, cheer your friends on, and keep your orbit close.</p></div><Link href="/cosmic/path" className="cosmic-button">Learning path</Link></header><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", gap: 17, alignItems: "start" }}><div style={{ display: "grid", gap: 14 }}><PostComposer name={user.username} onPost={addPost} /><SocialFeed posts={feed} reactions={reactionData} onReact={react} /></div><aside style={{ display: "grid", gap: 14 }}><AddFriend existing={friends} onAdd={addFriend} />{selectedFriend ? <SocialProfilePreview friend={selectedFriend} onClose={() => setSelectedFriend(null)} /> : null}<FriendsList friends={friends} onView={setSelectedFriend} onRemove={removeFriend} /><SocialLeaderboard people={leaderboard} /></aside></div></section></main>;
}
