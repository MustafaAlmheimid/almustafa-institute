import { type ReactNode } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-[#0f211a] rounded-2xl border border-emerald-100/70 dark:border-white/5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({
  icon: Icon, label, value, accent = "emerald", delay = 0, sub,
}: {
  icon: LucideIcon; label: string; value: string | number; accent?: "emerald" | "gold" | "blue" | "rose"; delay?: number; sub?: string;
}) {
  const accents: Record<string, string> = {
    emerald: "from-emerald-bright to-emerald-rich",
    gold: "from-gold-soft to-gold",
    blue: "from-sky-400 to-blue-600",
    rose: "from-rose-400 to-rose-600",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card className="p-5 relative overflow-hidden group">
        <div className="pattern-gold absolute inset-0 opacity-30" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-emerald-100/50 font-medium">{label}</p>
            <p className="text-3xl font-extrabold text-emerald-deep dark:text-white mt-1">{value}</p>
            {sub && <p className="text-xs text-gray-400 dark:text-emerald-100/40 mt-1">{sub}</p>}
          </div>
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accents[accent]} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`h-3 rounded-full bg-emerald-100 dark:bg-white/10 overflow-hidden ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full rounded-full bg-gradient-to-l from-emerald-bright to-emerald-rich relative"
      >
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/30 to-transparent" />
      </motion.div>
    </div>
  );
}

export function Badge({ children, color = "emerald" }: { children: ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    gold: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    red: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
    gray: "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300",
  };
  return <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colors[color]}`}>{children}</span>;
}

export function SectionTitle({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-2xl font-extrabold text-emerald-deep dark:text-white flex items-center gap-2">
        <span className="w-1.5 h-7 rounded-full bg-gradient-to-b from-gold to-emerald-bright" />
        {children}
      </h2>
      {sub && <p className="text-sm text-gray-500 dark:text-emerald-100/40 mt-1 mr-4">{sub}</p>}
    </div>
  );
}
