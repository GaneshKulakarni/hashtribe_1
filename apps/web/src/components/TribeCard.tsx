import { Link } from "react-router-dom";
import clsx from "clsx";

export interface Tribe {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  visibility: "public" | "private";
  member_count?: number;
  is_member?: boolean;
  user_role?: "admin" | "member" | null;
  created_at: string;
}

interface TribeCardProps {
  tribe: Tribe;
  onJoinLeave: (id: string, isMember: boolean) => void;
  disabled?: boolean;
}

export function TribeCard({ tribe, onJoinLeave, disabled }: TribeCardProps) {
  const shortId = tribe.id.slice(0, 6).toUpperCase();

  return (
    <div className="group bg-white dark:bg-charcoal-900 border border-grey-200 dark:border-charcoal-800 rounded-3xl overflow-hidden hover:border-charcoal-400 dark:hover:border-grey-500 hover:shadow-xl dark:hover:shadow-glow transition-all duration-300 flex flex-col h-full">
      {/* Image / Header Section */}
      <div className="h-40 bg-gradient-to-br from-grey-100 dark:from-charcoal-800 to-grey-300 dark:to-black relative p-4 border-b border-grey-200 dark:border-charcoal-800">
        {/* ID Tag */}
        <div className="inline-flex items-center px-2 py-1 rounded border border-charcoal-900/10 dark:border-white/20 bg-white/50 dark:bg-black/50 backdrop-blur-md">
          <span className="text-[10px] font-mono text-charcoal-900 dark:text-grey-300 tracking-wider">
            ID: {shortId}
          </span>
        </div>

        {/* Overlay Texture */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 mix-blend-overlay"></div>

        {/* Optional Status Indicator */}
        <div className="absolute bottom-4 right-4">
          <div
            className={`w-2 h-2 rounded-full ${tribe.visibility === "public" ? "bg-charcoal-900 dark:bg-white shadow-[0_0_8px_rgba(0,0,0,0.3)] dark:shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "bg-grey-400 dark:bg-grey-600"}`}
          ></div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title */}
        <Link
          to={`/tribes/${tribe.slug}`}
          className="group-hover:text-charcoal-900 dark:group-hover:text-white transition-colors"
        >
          <h3 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-2 uppercase tracking-tight font-display">
            {tribe.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-grey-600 dark:text-grey-400 text-sm mb-6 line-clamp-2 flex-grow font-mono">
          {tribe.description ||
            "System description unavailable. Access strictly monitored."}
        </p>

        {/* Stats & Actions */}
        <div className="flex items-end justify-between mt-auto">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-charcoal-900 dark:text-white">
              <span className="text-sm font-bold tracking-wider">
                {tribe.member_count || 0} NODES
              </span>
            </div>
            <div className="text-[10px] text-grey-500 dark:text-grey-600 uppercase tracking-widest font-mono">
              {tribe.visibility} NETWORK
            </div>
          </div>

          {tribe.visibility === "public" && (
            <button
              onClick={(e) => {
                e.preventDefault();
                if (disabled) return; // extra safety
                onJoinLeave(tribe.id, !!tribe.is_member);
              }}
              disabled={disabled}
              className={clsx(
                "px-6 py-2 rounded-full text-xs font-bold tracking-wider font-mono border transition-all duration-300 uppercase",
                tribe.is_member
                  ? "border-red-500 text-red-500 hover:bg-red-500/10"
                  : "border-charcoal-900 dark:border-white text-charcoal-900 dark:text-white hover:bg-charcoal-900/10 dark:hover:bg-white/10 hover:shadow-glow-sm",
                disabled &&
                "opacity-50 cursor-not-allowed hover:bg-transparent hover:shadow-none",
              )}
            >
              {disabled
                ? "PROCESSING..."
                : tribe.is_member
                  ? "LEAVE_SYSTEM"
                  : "JOIN_SYSTEM"}
            </button>
          )}

          {tribe.visibility === "private" && (
            <span className="px-6 py-2 rounded-full text-xs font-bold tracking-wider font-mono border border-grey-700 text-grey-500 uppercase cursor-not-allowed">
              LOCKED
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
