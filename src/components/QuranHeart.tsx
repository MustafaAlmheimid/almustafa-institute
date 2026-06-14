import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Lock, Sparkles } from "lucide-react";
import { SURAHS } from "../lib/surahs";

interface Props {
  memorized: number[];
  canEdit: boolean;
  onToggle?: (surah: number) => void;
}

// Build a heart-shaped boolean mask on a grid of `cols` columns and `rows` rows.
// We place 114 tiles into the cells that fall inside the heart.
function heartMask(cols: number, rows: number): boolean[][] {
  const mask: boolean[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < cols; c++) {
      // normalize to [-1, 1] roughly
      const x = (c / (cols - 1)) * 2.4 - 1.2;
      const y = 1.3 - (r / (rows - 1)) * 2.4;
      // heart implicit equation: (x^2 + y^2 - 1)^3 - x^2 * y^3 <= 0
      const v = Math.pow(x * x + y * y - 1, 3) - x * x * Math.pow(y, 3);
      row.push(v <= 0);
    }
    mask.push(row);
  }
  return mask;
}

export default function QuranHeart({ memorized, canEdit, onToggle }: Props) {
  const [celebrate, setCelebrate] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const cols = 21;
  const rows = 19;

  // Map the 114 surahs onto the heart cells in reading order (top-to-bottom, left-to-right inside mask)
  const layout = useMemo(() => {
    const mask = heartMask(cols, rows);
    const cells: { r: number; c: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (mask[r][c]) cells.push({ r, c });
      }
    }
    // We have more cells than 114 usually; pick evenly spaced cells to total 114.
    const total = 114;
    const chosen: { r: number; c: number }[] = [];
    const step = cells.length / total;
    for (let i = 0; i < total; i++) {
      chosen.push(cells[Math.floor(i * step)]);
    }
    return chosen;
  }, []);

  const memSet = new Set(memorized);

  const handleClick = (surahNum: number) => {
    if (!canEdit || !onToggle) return;
    const wasMem = memSet.has(surahNum);
    onToggle(surahNum);
    if (!wasMem) {
      setCelebrate(surahNum);
      setTimeout(() => setCelebrate(null), 1300);
    }
  };

  return (
    <div className="relative w-full max-w-[560px] mx-auto select-none">
      <div className="animate-heartbeat">
        <div
          className="relative grid gap-[3px] mx-auto"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            aspectRatio: `${cols} / ${rows}`,
          }}
        >
          {layout.map((cell, idx) => {
            const surah = SURAHS[idx];
            const isMem = memSet.has(surah.number);
            const isHover = hovered === surah.number;
            return (
              <motion.button
                key={surah.number}
                type="button"
                onClick={() => handleClick(surah.number)}
                onMouseEnter={() => setHovered(surah.number)}
                onMouseLeave={() => setHovered(null)}
                disabled={!canEdit}
                style={{ gridRowStart: cell.r + 1, gridColumnStart: cell.c + 1 }}
                initial={false}
                animate={{
                  scale: celebrate === surah.number ? [1, 1.6, 1] : 1,
                }}
                transition={{ duration: 0.6 }}
                className={`group relative rounded-[5px] flex flex-col items-center justify-center px-px overflow-hidden transition-all duration-300 ${
                  canEdit ? "cursor-pointer hover:z-30 hover:scale-[2.2]" : "hover:z-30 hover:scale-[2.2]"
                } ${
                  isMem
                    ? "bg-gradient-to-br from-emerald-bright to-emerald-rich text-white shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    : "bg-gray-300/70 dark:bg-white/10 text-gray-500 dark:text-gray-400"
                }`}
                aria-label={surah.name}
              >
                {/* tiny surah name (always visible) */}
                <span
                  className="font-arabic leading-none truncate max-w-full text-center"
                  style={{ fontSize: "3.4px" }}
                >
                  {surah.name}
                </span>
                {/* status mark + number, shown larger on hover */}
                <span className="flex items-center gap-px leading-none" style={{ fontSize: "2.8px" }}>
                  {isMem ? <Check style={{ width: 3, height: 3 }} strokeWidth={5} /> : <Lock style={{ width: 2.6, height: 2.6 }} className="opacity-60" />}
                  <span className="font-bold opacity-80">{surah.number}</span>
                </span>
                {celebrate === surah.number && (
                  <span className="absolute inset-0 rounded-[5px] ring-2 ring-gold animate-pop-in" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* tooltip */}
      <AnimatePresence>
        {hovered !== null && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-30 bg-emerald-deep text-white px-4 py-2 rounded-xl shadow-xl text-center pointer-events-none"
          >
            <p className="font-arabic text-lg leading-none">{SURAHS.find((s) => s.number === hovered)?.name}</p>
            <p className="text-[10px] text-gold-soft mt-0.5">
              {SURAHS.find((s) => s.number === hovered)?.english} · {memSet.has(hovered) ? "محفوظة ✓" : "غير محفوظة"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* celebration sparkles */}
      <AnimatePresence>
        {celebrate !== null && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: 1,
                  x: Math.cos((i / 8) * Math.PI * 2) * 120,
                  y: Math.sin((i / 8) * Math.PI * 2) * 120,
                  opacity: 0,
                }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                className="absolute"
              >
                <Sparkles className="w-6 h-6 text-gold" />
              </motion.div>
            ))}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.4, 0] }}
              transition={{ duration: 1.1 }}
              className="font-arabic text-2xl text-gold font-bold drop-shadow-lg"
            >
              ما شاء الله
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
