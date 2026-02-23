import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Github, Star, GitFork, Users, FileText, MessageSquare,
    Shield, Zap, Edit3, Check, X, Award, BarChart2,
    ExternalLink, Camera, Globe, MapPin
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { GitHubRepoShowcase } from '@/components/Profile/GitHubRepoShowcase';

// ── Types ────────────────────────────────────────────────────────────────────

interface ActivityStats {
    posts: number;
    comments: number;
    tribes: number;
    joined_at: string | null;
    github_connected?: boolean;
    github_repos?: number;
    github_followers?: number;
    github_stars?: number;
}

interface FullUserProfile {
    id: string;
    username: string;
    display_name: string | null;
    full_name: string | null;
    name: string | null;
    email: string | null;
    bio: string | null;
    avatar_url: string | null;
    github_username: string | null;
    github_id: number | null;
    public_repo_count: number;
    followers_count: number;
    comments_count: number;
    tribes_created_count: number;
    points_earned: number;
    devcom_score: number;
    skills: string[];
    badges: string[];
    activity_stats: ActivityStats;
    created_at: string;
    updated_at: string;
}

// ── Small helpers ─────────────────────────────────────────────────────────────

const StatCard = ({
    icon: Icon,
    value,
    label,
    color = 'primary',
    delay = 0,
}: {
    icon: React.ElementType;
    value: number;
    label: string;
    color?: 'primary' | 'green' | 'yellow' | 'blue' | 'purple' | 'pink';
    delay?: number;
}) => {
    const colorMap: Record<string, string> = {
        primary: 'from-violet-600/20 to-violet-600/5 border-violet-600/30 text-violet-400',
        green: 'from-emerald-600/20 to-emerald-600/5 border-emerald-600/30 text-emerald-400',
        yellow: 'from-amber-600/20 to-amber-600/5 border-amber-600/30 text-amber-400',
        blue: 'from-sky-600/20 to-sky-600/5 border-sky-600/30 text-sky-400',
        purple: 'from-purple-600/20 to-purple-600/5 border-purple-600/30 text-purple-400',
        pink: 'from-pink-600/20 to-pink-600/5 border-pink-600/30 text-pink-400',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4, ease: 'easeOut' }}
            className={`relative overflow-hidden rounded-2xl border bg-gradient-to-b p-5 flex flex-col items-center gap-2 group hover:scale-[1.03] transition-transform duration-200 cursor-default ${colorMap[color]}`}
        >
            <Icon size={20} className="opacity-70" />
            <motion.p
                className="text-3xl font-black text-zinc-100"
                key={value}
                initial={{ scale: 1.25, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {value.toLocaleString()}
            </motion.p>
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500 text-center leading-tight">
                {label}
            </p>
        </motion.div>
    );
};

const SkillBadge = ({ label, index }: { label: string; index: number }) => (
    <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.06 }}
        className="px-3 py-1.5 bg-violet-600/15 text-violet-300 border border-violet-600/25 text-xs font-semibold rounded-full hover:bg-violet-600/25 transition-colors cursor-default"
    >
        {label}
    </motion.span>
);

const AchievementCard = ({ label, index }: { label: string; index: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.07 }}
        className="flex flex-col items-center gap-2 p-4 bg-zinc-800/40 border border-zinc-700/40 rounded-xl group hover:border-amber-600/40 transition-colors"
    >
        <span className="text-2xl">🏆</span>
        <p className="text-zinc-300 text-xs font-medium text-center leading-tight">{label}</p>
    </motion.div>
);

// ── Main Component ────────────────────────────────────────────────────────────

export const ProfilePage = () => {
    const { username } = useParams<{ username: string }>();
    const { user: authUser, profileRefreshKey } = useAuthStore();

    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<FullUserProfile | null>(null);

    const [formData, setFormData] = useState({
        full_name: '',
        bio: '',
        skills: [] as string[],
        badges: [] as string[],
    });

    // ── Silent re-fetch (no full-page spinner) used for background refreshes ──
    const silentRefetch = useCallback(async () => {
        if (!username) return;
        try {
            const { data, error } = await (supabase.from('users') as any)
                .select('*')
                .eq('username', username)
                .single();
            if (error || !data) return;

            const p = data as FullUserProfile;
            if (!p.activity_stats) {
                p.activity_stats = { posts: 0, comments: 0, tribes: 0, joined_at: null };
            }

            // Also run live COUNTs to ensure we show fresh numbers
            const [tribesRes, repliesRes, postsRes] = await Promise.all([
                (supabase.from('tribes') as any)
                    .select('*', { count: 'exact', head: true })
                    .eq('created_by', p.id),
                (supabase.from('topic_replies') as any)
                    .select('*', { count: 'exact', head: true })
                    .eq('created_by', p.id),
                (supabase.from('posts') as any)
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', p.id),
            ]);

            p.tribes_created_count = tribesRes.count ?? 0;
            p.comments_count = repliesRes.count ?? 0;
            p.activity_stats = {
                ...p.activity_stats,
                tribes: tribesRes.count ?? 0,
                comments: repliesRes.count ?? 0,
                posts: postsRes.count ?? 0,
            };

            setProfile(p);
        } catch (_) { /* silently ignore */ }
    }, [username]);


    // ── Re-fetch when profileRefreshKey increments (tribe/comment created) ────
    const isFirstMount = useRef(true);
    useEffect(() => {
        // Skip the very first render — we already loaded via getProfile()
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }
        silentRefetch();
    }, [profileRefreshKey, silentRefetch]);

    // ── Fetch profile + live activity counts from source tables ───────────────
    const getProfile = useCallback(async () => {
        if (!username) return;
        try {
            setLoading(true);

            // 1. Fetch user row
            const { data, error } = await (supabase.from('users') as any)
                .select('*')
                .eq('username', username)
                .single();

            if (error) throw error;

            const p = data as FullUserProfile;

            // Ensure activity_stats is always an object
            if (!p.activity_stats) {
                p.activity_stats = { posts: 0, comments: 0, tribes: 0, joined_at: null };
            }

            // 2. Run parallel live COUNT queries against source tables
            //    This is ground-truth — works even if denormalized counters are stale/zero
            const [tribesRes, repliesRes, postsRes] = await Promise.all([
                (supabase.from('tribes') as any)
                    .select('*', { count: 'exact', head: true })
                    .eq('created_by', p.id),
                (supabase.from('topic_replies') as any)
                    .select('*', { count: 'exact', head: true })
                    .eq('created_by', p.id),
                (supabase.from('posts') as any)
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', p.id),
            ]);

            const liveTribes = tribesRes.count ?? 0;
            const liveComments = repliesRes.count ?? 0;
            const livePosts = postsRes.count ?? 0;

            // 3. Merge live counts into the profile object so UI is always accurate
            p.tribes_created_count = liveTribes;
            p.comments_count = liveComments;
            p.activity_stats = {
                ...p.activity_stats,
                tribes: liveTribes,
                comments: liveComments,
                posts: livePosts,
            };

            // 4. Write live counts back to DB so counters stay in sync
            //    (fire-and-forget — don't await, so it doesn't slow the page)
            (supabase.from('users') as any)
                .update({
                    tribes_created_count: liveTribes,
                    comments_count: liveComments,
                    activity_stats: {
                        ...p.activity_stats,
                        tribes: liveTribes,
                        comments: liveComments,
                        posts: livePosts,
                    },
                })
                .eq('id', p.id)
                .then(({ error: syncErr }: { error: any }) => {
                    if (syncErr) {
                        // Silently skip if columns don't exist yet (migration not applied)
                        if (syncErr.code !== 'PGRST204') {
                            console.warn('Counter sync warning:', syncErr.message);
                        }
                    }
                });

            setProfile(p);
            setFormData({
                full_name: p.full_name || p.display_name || '',
                bio: p.bio || '',
                skills: p.skills || [],
                badges: p.badges || [],
            });
        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    }, [username]);



    useEffect(() => {
        if (username) getProfile();
    }, [username, getProfile]);

    // ── Real-time subscription — refresh when user data changes ───────────────

    useEffect(() => {
        if (!profile?.id) return;

        const channel = (supabase as any)
            .channel(`profile-${profile.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'users',
                    filter: `id=eq.${profile.id}`,
                },
                (payload: { new: FullUserProfile }) => {
                    const updated = payload.new;
                    if (!updated.activity_stats) {
                        updated.activity_stats = {
                            posts: 0, comments: 0, tribes: 0, joined_at: null,
                        };
                    }
                    setProfile(updated);
                }
            )
            .subscribe();

        return () => {
            (supabase as any).removeChannel(channel);
        };
    }, [profile?.id]);

    // ── Save edits ────────────────────────────────────────────────────────────
    async function handleSave() {
        if (!profile?.id) return;

        try {
            setSaving(true);

            // ── Pass 1: Guaranteed-safe columns (original schema, always exist) ─
            // display_name and bio exist in the very first migration. This will
            // ALWAYS succeed regardless of whether the migration SQL has been applied.
            const { error: coreErr } = await (supabase.from('users') as any)
                .update({
                    display_name: formData.full_name,
                    bio: formData.bio,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', profile.id);

            if (coreErr) {
                throw new Error(coreErr.message);
            }

            // ── Pass 2: Extended columns from later migrations ──────────────────
            // full_name, skills, badges were added via ALTER TABLE migrations.
            // If the columns don't exist yet (PGRST204), skip silently — no alert.
            const extUpdates: Record<string, unknown> = {
                full_name: formData.full_name,
            };
            if (formData.skills.length > 0) extUpdates.skills = formData.skills;
            if (formData.badges.length > 0) extUpdates.badges = formData.badges;

            const { error: extErr } = await (supabase.from('users') as any)
                .update(extUpdates)
                .eq('id', profile.id);

            if (extErr && extErr.code !== 'PGRST204') {
                console.warn('Extended fields save skipped:', extErr.message);
            }

            // ── Success ───────────────────────────────────────────────────────
            setIsEditing(false);
            await getProfile();
            const { triggerProfileRefresh } = useAuthStore.getState();
            triggerProfileRefresh();

        } catch (err: any) {
            console.error('Profile update failed:', err);
            alert(`Failed to save profile: ${err.message || 'Unknown error'}`);
        } finally {
            setSaving(false);
        }
    }



    // ── Avatar upload ─────────────────────────────────────────────────────────

    async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
        try {
            if (!event.target.files?.length) return;
            if (!authUser?.id) return;

            // Consider a local uploading state instead of full-page loading
            setLoading(true);

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${authUser.id}/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars').upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars').getPublicUrl(filePath);

            const { error: updateError } = await (supabase.from('users') as any)
                .update({ avatar_url: publicUrl })
                .eq('id', authUser?.id);
            if (updateError) throw updateError;

            getProfile();
        } catch (error: any) {
            console.error('Avatar upload failed:', error.message);
        } finally {
            setLoading(false);
        }
    }
    // ── Render helpers ────────────────────────────────────────────────────────

    const displayName = profile?.full_name || profile?.name || profile?.display_name || profile?.username || '';
    const isOwner = authUser?.id === profile?.id;

    // activity_stats is always populated with live counts from getProfile/silentRefetch
    const stats = profile?.activity_stats ?? { posts: 0, comments: 0, tribes: 0, joined_at: null };

    // Use activity_stats (live-queried) as primary source; fall back to explicit columns
    // NOTE: activity_stats.tribes/comments/posts are set from real COUNT queries in getProfile
    //       so they are always accurate even for historical data
    const tribesCount = stats.tribes ?? profile?.tribes_created_count ?? 0;
    const commentsCount = stats.comments ?? profile?.comments_count ?? 0;
    const postsCount = stats.posts ?? 0;

    // Compute live points in case DB column is stale (10 per tribe, 5 per comment, 2 per post)
    const dbPoints = profile?.points_earned ?? profile?.devcom_score ?? 0;
    const computedPoints = tribesCount * 10 + commentsCount * 5 + postsCount * 2;
    const pointsEarned = Math.max(dbPoints, computedPoints);
    const followersCount = profile?.followers_count ?? stats.github_followers ?? 0;
    const repoCount = profile?.public_repo_count ?? stats.github_repos ?? 0;
    const githubStars = stats.github_stars ?? 0;


    // ─────────────────────────────────────────────────────────────────────────

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="flex flex-col items-center gap-4">
                    <motion.div
                        className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                    />
                    <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">
                        Decrypting Member Data…
                    </p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                    <p className="text-6xl font-black text-zinc-800 mb-4">404</p>
                    <p className="text-zinc-500 font-mono">Signal lost — member not found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pb-20">
            {/* ── Hero banner ── */}
            <div className="relative h-48 md:h-64 bg-gradient-to-br from-violet-900/40 via-black to-zinc-900 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `radial-gradient(circle at 20% 50%, #7c3aed 0%, transparent 60%),
                                          radial-gradient(circle at 80% 30%, #2563eb 0%, transparent 50%)`,
                    }}
                />
                <div className="absolute inset-0"
                    style={{
                        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(124,58,237,0.07) 60px),
                                          repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(124,58,237,0.07) 60px)`,
                    }}
                />
            </div>

            <div className="max-w-5xl mx-auto px-4">
                {/* ── Avatar + Name section ── */}
                <div className="relative -mt-20 mb-8">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        {/* Avatar */}
                        <div className="relative group">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.4, ease: 'backOut' }}
                                className="relative"
                            >
                                <img
                                    src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
                                    alt={displayName}
                                    className="w-32 h-32 rounded-2xl border-4 border-zinc-900 object-cover shadow-2xl"
                                />
                                {isEditing && isOwner && (
                                    <label
                                        htmlFor="avatar-upload"
                                        className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-2xl cursor-pointer gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Camera size={20} className="text-white" />
                                        <span className="text-white text-xs font-mono">Change</span>
                                    </label>
                                )}
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={uploadAvatar}
                                />
                            </motion.div>

                            {/* Online indicator */}
                            {isOwner && (
                                <span className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-zinc-900 shadow" />
                            )}
                        </div>

                        {/* Name + actions */}
                        <div className="flex-1 pt-2 md:pt-16">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                <div>
                                    {isEditing ? (
                                        <input
                                            className="bg-zinc-900 border border-zinc-700 text-zinc-100 text-2xl font-bold rounded-xl px-4 py-2 w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            placeholder="Display name"
                                        />
                                    ) : (
                                        <motion.h1
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-3xl md:text-4xl font-black text-zinc-100 tracking-tight"
                                        >
                                            {displayName}
                                        </motion.h1>
                                    )}
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="text-violet-400 font-mono text-sm mt-1 tracking-widest"
                                    >
                                        @{profile.username}
                                    </motion.p>
                                </div>

                                {/* Edit / Save / Cancel */}
                                {isOwner && (
                                    <div className="flex gap-2">
                                        <AnimatePresence mode="wait">
                                            {isEditing ? (
                                                <motion.div
                                                    key="editing-btns"
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    className="flex gap-2"
                                                >
                                                    <button
                                                        onClick={handleSave}
                                                        disabled={saving}
                                                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white rounded-xl font-semibold text-sm transition-colors"
                                                    >
                                                        <Check size={15} />
                                                        {saving ? 'Saving…' : 'Save Changes'}
                                                    </button>
                                                    <button
                                                        onClick={() => { setIsEditing(false); getProfile(); }}
                                                        className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-semibold text-sm transition-colors"
                                                    >
                                                        <X size={15} />
                                                        Cancel
                                                    </button>
                                                </motion.div>
                                            ) : (
                                                <motion.button
                                                    key="edit-btn"
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    onClick={() => setIsEditing(true)}
                                                    className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl font-semibold text-sm border border-zinc-700 transition-colors"
                                                >
                                                    <Edit3 size={14} />
                                                    Edit Profile
                                                </motion.button>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Body layout ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ─── LEFT column ───────────────────────────────────────── */}
                    <div className="lg:col-span-1 flex flex-col gap-5">

                        {/* Bio */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-5 backdrop-blur-sm"
                        >
                            <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] mb-3">
                                Bio
                            </h3>
                            {isEditing ? (
                                <textarea
                                    className="w-full bg-zinc-950 border border-zinc-700 text-zinc-300 rounded-xl p-3 h-28 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="Tell the tribe about yourself…"
                                />
                            ) : (
                                <p className="text-zinc-400 text-sm leading-relaxed border-l-2 border-violet-600/30 pl-4 italic">
                                    "{profile.bio || 'No transmission received from this member.'}"
                                </p>
                            )}

                            {/* Meta info */}
                            <div className="mt-4 flex flex-col gap-1.5 text-xs text-zinc-500">
                                {profile.github_username && (
                                    <a
                                        href={`https://github.com/${profile.github_username}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 hover:text-zinc-300 transition-colors"
                                    >
                                        <Github size={13} />
                                        {profile.github_username}
                                        <ExternalLink size={10} className="opacity-50" />
                                    </a>
                                )}
                                {profile.email && (
                                    <span className="flex items-center gap-2">
                                        <Globe size={13} />
                                        {profile.email}
                                    </span>
                                )}
                                {stats.joined_at && (
                                    <span className="flex items-center gap-2">
                                        <MapPin size={13} />
                                        Joined {new Date(stats.joined_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                                    </span>
                                )}
                            </div>
                        </motion.div>

                        {/* Skills */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-5 backdrop-blur-sm"
                        >
                            <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] mb-3">
                                Skills &amp; Expertise
                            </h3>
                            {isEditing ? (
                                <input
                                    className="w-full bg-zinc-950 border border-zinc-700 text-zinc-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                                    placeholder="React, TypeScript, Node.js…"
                                    value={formData.skills.join(', ')}
                                    onChange={(e) =>
                                        setFormData({ ...formData, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })
                                    }
                                />
                            ) : profile.skills?.length ? (
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills.map((s, i) => <SkillBadge key={s} label={s} index={i} />)}
                                </div>
                            ) : (
                                <p className="text-zinc-600 text-sm italic">No skills listed yet.</p>
                            )}
                        </motion.div>

                        {/* Achievements */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 }}
                            className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-5 backdrop-blur-sm"
                        >
                            <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] mb-3">
                                Achievements
                            </h3>
                            {isEditing ? (
                                <input
                                    className="w-full bg-zinc-950 border border-zinc-700 text-zinc-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                                    placeholder="First Post, Top Contributor…"
                                    value={formData.badges.join(', ')}
                                    onChange={(e) =>
                                        setFormData({ ...formData, badges: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })
                                    }
                                />
                            ) : profile.badges?.length ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {profile.badges.map((b, i) => <AchievementCard key={b} label={b} index={i} />)}
                                </div>
                            ) : (
                                <p className="text-zinc-600 text-sm italic">No achievements yet — be active!</p>
                            )}
                        </motion.div>
                    </div>

                    {/* ─── RIGHT column ──────────────────────────────────────── */}
                    <div className="lg:col-span-2 flex flex-col gap-5">

                        {/* ── Primary Stats ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] mb-3">
                                Platform Metrics
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <StatCard icon={Zap} value={pointsEarned} label="Points Earned" color="yellow" delay={0.05} />
                                <StatCard icon={Users} value={followersCount} label="Followers" color="blue" delay={0.10} />
                                <StatCard icon={FileText} value={postsCount} label="Posts" color="primary" delay={0.15} />
                                <StatCard icon={MessageSquare} value={commentsCount} label="Comments" color="green" delay={0.20} />
                                <StatCard icon={Shield} value={tribesCount} label="Tribes Created" color="purple" delay={0.25} />
                                <StatCard icon={Award} value={profile.devcom_score ?? 0} label="DevCom Score" color="pink" delay={0.30} />
                            </div>
                        </motion.div>

                        {/* ── GitHub Profile Section ── */}
                        {profile.github_username && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                                className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-6 backdrop-blur-sm"
                            >
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">
                                        GitHub Profile
                                    </h3>
                                    <a
                                        href={`https://github.com/${profile.github_username}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors font-mono"
                                    >
                                        View Profile <ExternalLink size={11} />
                                    </a>
                                </div>

                                {/* GitHub avatar + handle */}
                                <div className="flex items-center gap-4 mb-5">
                                    <img
                                        src={`https://github.com/${profile.github_username}.png`}
                                        alt="GitHub avatar"
                                        className="w-12 h-12 rounded-xl border border-zinc-700"
                                    />
                                    <div>
                                        <p className="text-zinc-100 font-bold text-sm">@{profile.github_username}</p>
                                        {profile.name && (
                                            <p className="text-zinc-500 text-xs">{profile.name}</p>
                                        )}
                                    </div>
                                </div>

                                {/* GitHub stats */}
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { icon: GitFork, value: repoCount, label: 'Public Repos' },
                                        { icon: Star, value: githubStars, label: 'Total Stars' },
                                        { icon: Users, value: followersCount, label: 'Followers' },
                                    ].map(({ icon: Icon, value, label }) => (
                                        <div
                                            key={label}
                                            className="text-center p-4 bg-zinc-800/40 rounded-xl border border-zinc-700/30 hover:border-zinc-600/50 transition-colors"
                                        >
                                            <Icon size={16} className="text-zinc-500 mx-auto mb-2" />
                                            <p className="text-2xl font-black text-zinc-100">
                                                {value.toLocaleString()}
                                            </p>
                                            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.2em] mt-0.5">
                                                {label}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* GitHub Repos Showcase */}
                                <div className="mt-4">
                                    <GitHubRepoShowcase username={profile.github_username} />
                                </div>
                            </motion.div>
                        )}

                        {/* ── Community Activity bar chart (activity_stats) ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-6 backdrop-blur-sm"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <BarChart2 size={14} className="text-zinc-500" />
                                <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">
                                    Community Activity
                                </h3>
                            </div>

                            {[
                                { label: 'Posts', value: postsCount, max: Math.max(postsCount, 1), color: '#7c3aed' },
                                { label: 'Comments', value: commentsCount, max: Math.max(commentsCount, 1), color: '#10b981' },
                                { label: 'Tribes Created', value: tribesCount, max: Math.max(tribesCount, 1), color: '#8b5cf6' },
                            ].map(({ label, value, color }) => (
                                <div key={label} className="mb-4">
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="text-zinc-400 font-medium">{label}</span>
                                        <span className="text-zinc-500 font-mono">{value}</span>
                                    </div>
                                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: color }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min((value / Math.max(postsCount, commentsCount, tribesCount, 1)) * 100, 100)}%` }}
                                            transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};