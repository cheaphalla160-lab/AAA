import React from 'react';

interface VocabIllustrationProps {
  id: string;
  className?: string;
  interactive?: boolean;
}

export const VocabIllustration: React.FC<VocabIllustrationProps> = ({
  id,
  className = 'w-48 h-48',
  interactive = false,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className} ${
        interactive ? 'transition-transform duration-200 hover:scale-105 active:scale-95' : ''
      }`}
    >
      <svg
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <rect width="240" height="240" rx="32" fill="#F8FAFC" />

        {/* 1. short (pencil) */}
        {id === 'short_pencil' && (
          <g>
            {/* Background scale bar */}
            <rect x="24" y="24" width="20" height="192" rx="4" fill="#E2E8F0" />
            <line x1="24" y1="60" x2="44" y2="60" stroke="#94A3B8" strokeWidth="2" />
            <line x1="24" y1="120" x2="44" y2="120" stroke="#94A3B8" strokeWidth="2" />
            <line x1="24" y1="180" x2="44" y2="180" stroke="#94A3B8" strokeWidth="2" />
            <text x="34" y="55" fontSize="10" fill="#64748B" textAnchor="middle" fontWeight="bold">20</text>
            <text x="34" y="115" fontSize="10" fill="#64748B" textAnchor="middle" fontWeight="bold">10</text>
            <text x="34" y="175" fontSize="10" fill="#64748B" textAnchor="middle" fontWeight="bold">5</text>

            {/* Stubby short pencil */}
            <g transform="translate(90, 95)">
              {/* Eraser */}
              <rect x="0" y="70" width="60" height="24" rx="6" fill="#F472B6" />
              <rect x="0" y="66" width="60" height="8" fill="#CBD5E1" />
              {/* Pencil Body */}
              <rect x="0" y="15" width="60" height="52" fill="#FBBF24" />
              <line x1="20" y1="15" x2="20" y2="67" stroke="#F59E0B" strokeWidth="3" />
              <line x1="40" y1="15" x2="40" y2="67" stroke="#F59E0B" strokeWidth="3" />
              {/* Wood Tip */}
              <polygon points="0,15 60,15 30,-20" fill="#FED7AA" />
              {/* Graphite Tip */}
              <polygon points="20,-6 40,-6 30,-20" fill="#334155" />
              {/* Cute smiling face */}
              <circle cx="20" cy="40" r="3" fill="#1E293B" />
              <circle cx="40" cy="40" r="3" fill="#1E293B" />
              <path d="M 24 50 Q 30 55 36 50" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <circle cx="16" cy="44" r="3" fill="#FB7185" opacity="0.6" />
              <circle cx="44" cy="44" r="3" fill="#FB7185" opacity="0.6" />
            </g>
            <text x="120" y="222" fontSize="14" fill="#0284C7" fontWeight="bold" textAnchor="middle">
              SHORT ✦ 矮短
            </text>
          </g>
        )}

        {/* 2. long (pencil) */}
        {id === 'long_pencil' && (
          <g>
            {/* Background scale bar */}
            <rect x="24" y="24" width="20" height="192" rx="4" fill="#E2E8F0" />
            <line x1="24" y1="50" x2="44" y2="50" stroke="#94A3B8" strokeWidth="2" />
            <line x1="24" y1="110" x2="44" y2="110" stroke="#94A3B8" strokeWidth="2" />
            <line x1="24" y1="170" x2="44" y2="170" stroke="#94A3B8" strokeWidth="2" />

            {/* Very Long pencil */}
            <g transform="translate(100, 30)">
              {/* Eraser */}
              <rect x="0" y="150" width="40" height="25" rx="6" fill="#F472B6" />
              <rect x="0" y="145" width="40" height="8" fill="#CBD5E1" />
              {/* Long body */}
              <rect x="0" y="20" width="40" height="126" fill="#10B981" />
              <line x1="13" y1="20" x2="13" y2="146" stroke="#059669" strokeWidth="2.5" />
              <line x1="27" y1="20" x2="27" y2="146" stroke="#059669" strokeWidth="2.5" />
              {/* Wood Tip */}
              <polygon points="0,20 40,20 20,-10" fill="#FED7AA" />
              {/* Graphite Tip */}
              <polygon points="12,2 28,2 20,-10" fill="#334155" />
              {/* Cute smiling face */}
              <circle cx="14" cy="45" r="2.5" fill="#FFFFFF" />
              <circle cx="26" cy="45" r="2.5" fill="#FFFFFF" />
              <path d="M 16 53 Q 20 57 24 53" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>

            {/* Height arrow */}
            <line x1="165" y1="185" x2="165" y2="28" stroke="#F59E0B" strokeWidth="3" strokeDasharray="4 4" />
            <polygon points="165,22 160,34 170,34" fill="#F59E0B" />
            <text x="185" y="110" fontSize="13" fill="#D97706" fontWeight="bold">LONG</text>

            <text x="120" y="222" fontSize="14" fill="#D97706" fontWeight="bold" textAnchor="middle">
              LONG ✦ 细长
            </text>
          </g>
        )}

        {/* 3. long (tree) / tall (tree) */}
        {id === 'long_tree' && (
          <g>
            <rect x="0" y="0" width="240" height="240" rx="32" fill="#F0FDF4" />
            {/* Clouds */}
            <ellipse cx="60" cy="50" rx="28" ry="14" fill="#E2E8F0" opacity="0.7" />
            <ellipse cx="180" cy="70" rx="32" ry="16" fill="#E2E8F0" opacity="0.7" />

            {/* Tall Trunk */}
            <path d="M 108 200 L 112 55 L 128 55 L 132 200 Z" fill="#78350F" />
            {/* Trunk rings */}
            <line x1="112" y1="90" x2="128" y2="90" stroke="#54240B" strokeWidth="2" />
            <line x1="110" y1="130" x2="130" y2="130" stroke="#54240B" strokeWidth="2" />
            <line x1="109" y1="170" x2="131" y2="170" stroke="#54240B" strokeWidth="2" />

            {/* Layered Foliage soaring high */}
            <circle cx="120" cy="45" r="32" fill="#15803D" />
            <circle cx="95" cy="70" r="30" fill="#16A34A" />
            <circle cx="145" cy="70" r="30" fill="#16A34A" />
            <circle cx="120" cy="85" r="36" fill="#22C55E" />

            {/* Ground Grass */}
            <ellipse cx="120" cy="204" rx="80" ry="16" fill="#86EFAC" />

            {/* Cute bird on top */}
            <circle cx="120" cy="22" r="7" fill="#F59E0B" />
            <polygon points="127,22 133,24 127,26" fill="#EA580C" />

            {/* Height indicator */}
            <path d="M 195 190 L 195 40" stroke="#16A34A" strokeWidth="2.5" strokeDasharray="3 3" />
            <polygon points="195,35 190,45 200,45" fill="#16A34A" />
            <text x="120" y="226" fontSize="14" fill="#15803D" fontWeight="bold" textAnchor="middle">
              LONG / TALL ✦ 高大
            </text>
          </g>
        )}

        {/* 4. short (tree) */}
        {id === 'short_tree' && (
          <g>
            <rect x="0" y="0" width="240" height="240" rx="32" fill="#F0FDF4" />
            {/* Ground Mound */}
            <ellipse cx="120" cy="190" rx="75" ry="24" fill="#86EFAC" />

            {/* Short Chubby Trunk */}
            <rect x="108" y="145" width="24" height="40" rx="6" fill="#78350F" />
            {/* Short Foliage */}
            <circle cx="120" cy="120" r="42" fill="#22C55E" />
            <circle cx="95" cy="130" r="30" fill="#16A34A" />
            <circle cx="145" cy="130" r="30" fill="#16A34A" />

            {/* Little Red Apples */}
            <circle cx="105" cy="115" r="7" fill="#EF4444" />
            <circle cx="135" cy="110" r="7" fill="#EF4444" />
            <circle cx="120" cy="140" r="7" fill="#EF4444" />

            {/* Cute mini flower */}
            <circle cx="75" cy="180" r="6" fill="#F43F5E" />
            <circle cx="75" cy="180" r="2" fill="#FEF08A" />

            {/* Compare line */}
            <line x1="40" y1="75" x2="200" y2="75" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="120" y="70" fontSize="11" fill="#64748B" textAnchor="middle">Short Tree Level</text>

            <text x="120" y="224" fontSize="14" fill="#16A34A" fontWeight="bold" textAnchor="middle">
              SHORT ✦ 矮小
            </text>
          </g>
        )}

        {/* 5. thick (book) */}
        {id === 'thick_book' && (
          <g>
            <rect x="0" y="0" width="240" height="240" rx="32" fill="#FAF5FF" />
            {/* Massive Thick Book Isometric View */}
            <g transform="translate(45, 45)">
              {/* Back cover */}
              <rect x="10" y="8" width="130" height="110" rx="6" fill="#4C1D95" />
              {/* Giant Stack of thick pages */}
              <rect x="10" y="24" width="125" height="74" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
              {/* Horizontal page lines showing thickness */}
              {[32, 40, 48, 56, 64, 72, 80, 88].map((y) => (
                <line key={y} x1="12" y1={y} x2="133" y2={y} stroke="#94A3B8" strokeWidth="1" />
              ))}
              {/* Front Cover */}
              <rect x="5" y="8" width="130" height="20" rx="4" fill="#7C3AED" />
              {/* Golden Title emblem */}
              <rect x="35" y="13" width="70" height="10" rx="2" fill="#FCD34D" />
              {/* Bookmark ribbon */}
              <path d="M 65 24 L 65 110 L 72 102 L 79 110 L 79 24 Z" fill="#EF4444" />
            </g>

            {/* Dimension label showing THICK */}
            <line x1="192" y1="70" x2="192" y2="142" stroke="#7C3AED" strokeWidth="3" />
            <polygon points="192,65 187,74 197,74" fill="#7C3AED" />
            <polygon points="192,147 187,138 197,138" fill="#7C3AED" />
            <text x="210" y="110" fontSize="12" fill="#7C3AED" fontWeight="bold">THICK</text>

            <text x="120" y="222" fontSize="14" fill="#6D28D9" fontWeight="bold" textAnchor="middle">
              THICK ✦ 厚厚的大书
            </text>
          </g>
        )}

        {/* 6. thin (book) */}
        {id === 'thin_book' && (
          <g>
            <rect x="0" y="0" width="240" height="240" rx="32" fill="#ECFEFF" />
            {/* Very Thin Book / Magazine */}
            <g transform="translate(50, 75)">
              {/* Back cover */}
              <rect x="10" y="4" width="120" height="85" rx="5" fill="#0891B2" />
              {/* Ultra slim pages */}
              <rect x="10" y="10" width="118" height="10" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
              <line x1="10" y1="15" x2="128" y2="15" stroke="#94A3B8" strokeWidth="1" />
              {/* Front cover */}
              <rect x="5" y="4" width="120" height="10" rx="3" fill="#06B6D4" />
              {/* Comic sticker */}
              <circle cx="65" cy="50" r="18" fill="#FEF08A" />
              <text x="65" y="55" fontSize="11" fill="#0F172A" fontWeight="bold" textAnchor="middle">COMIC</text>
            </g>

            {/* Dimension arrow */}
            <line x1="185" y1="80" x2="185" y2="98" stroke="#0891B2" strokeWidth="2.5" />
            <text x="202" y="93" fontSize="12" fill="#0891B2" fontWeight="bold">THIN</text>

            <text x="120" y="222" fontSize="14" fill="#0891B2" fontWeight="bold" textAnchor="middle">
              THIN ✦ 轻薄的书
            </text>
          </g>
        )}

        {/* 7. fat (people) */}
        {id === 'fat_people' && (
          <g>
            <rect x="0" y="0" width="240" height="240" rx="32" fill="#FFF7ED" />
            {/* Round, plump friendly smiling figure */}
            {/* Head */}
            <circle cx="120" cy="65" r="28" fill="#FED7AA" />
            {/* Cute Hair */}
            <path d="M 94 60 C 94 40 146 40 146 60 Z" fill="#92400E" />
            {/* Eyes & Smile */}
            <circle cx="110" cy="65" r="3" fill="#1E293B" />
            <circle cx="130" cy="65" r="3" fill="#1E293B" />
            <path d="M 112 75 Q 120 83 128 75" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <circle cx="104" cy="71" r="3.5" fill="#FB7185" opacity="0.6" />
            <circle cx="136" cy="71" r="3.5" fill="#FB7185" opacity="0.6" />

            {/* Round Chubby Body with colorful stripes */}
            <ellipse cx="120" cy="135" rx="55" ry="46" fill="#F97316" />
            <path d="M 68 125 Q 120 140 172 125" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 72 145 Q 120 160 168 145" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" />

            {/* Arms welcoming */}
            <ellipse cx="62" cy="120" rx="12" ry="22" transform="rotate(30 62 120)" fill="#FED7AA" />
            <ellipse cx="178" cy="120" rx="12" ry="22" transform="rotate(-30 178 120)" fill="#FED7AA" />

            {/* Short sturdy legs */}
            <rect x="95" y="172" width="20" height="22" rx="6" fill="#1E3A8A" />
            <rect x="125" y="172" width="20" height="22" rx="6" fill="#1E3A8A" />

            <text x="120" y="222" fontSize="14" fill="#C2410C" fontWeight="bold" textAnchor="middle">
              FAT ✦ 圆润饱满
            </text>
          </g>
        )}

        {/* 8. thin (people) */}
        {id === 'thin_people' && (
          <g>
            <rect x="0" y="0" width="240" height="240" rx="32" fill="#F0FDFA" />
            {/* Slender athletic smiling figure */}
            {/* Head */}
            <circle cx="120" cy="50" r="22" fill="#FED7AA" />
            <path d="M 100 48 C 100 32 140 32 140 48 Z" fill="#1E293B" />
            <circle cx="113" cy="50" r="2.5" fill="#1E293B" />
            <circle cx="127" cy="50" r="2.5" fill="#1E293B" />
            <path d="M 115 58 Q 120 63 125 58" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Slender Torso */}
            <rect x="108" y="74" width="24" height="60" rx="8" fill="#0D9488" />
            {/* Thin arms */}
            <rect x="94" y="78" width="10" height="52" rx="5" fill="#FED7AA" />
            <rect x="136" y="78" width="10" height="52" rx="5" fill="#FED7AA" />

            {/* Long thin legs */}
            <rect x="109" y="136" width="9" height="58" rx="4" fill="#1E293B" />
            <rect x="122" y="136" width="9" height="58" rx="4" fill="#1E293B" />

            {/* Running shoes */}
            <rect x="101" y="188" width="18" height="8" rx="3" fill="#F43F5E" />
            <rect x="121" y="188" width="18" height="8" rx="3" fill="#F43F5E" />

            <text x="120" y="222" fontSize="14" fill="#0F766E" fontWeight="bold" textAnchor="middle">
              THIN ✦ 苗条纤瘦
            </text>
          </g>
        )}

        {/* 9. blonde (hair) */}
        {id === 'blonde_hair' && (
          <g>
            <rect x="0" y="0" width="240" height="240" rx="32" fill="#FEFCE8" />
            {/* Kid face */}
            <circle cx="120" cy="115" r="45" fill="#FFEDD5" />
            {/* Eyes & smile */}
            <circle cx="105" cy="115" r="4" fill="#0369A1" />
            <circle cx="135" cy="115" r="4" fill="#0369A1" />
            <path d="M 112 130 Q 120 138 128 130" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <circle cx="98" cy="122" r="4" fill="#F472B6" opacity="0.6" />
            <circle cx="142" cy="122" r="4" fill="#F472B6" opacity="0.6" />

            {/* Bright Golden Blonde Hair */}
            <path
              d="M 68 115 C 68 60 172 60 172 115 C 182 145 160 155 155 125 C 145 80 95 80 85 125 C 80 155 58 145 68 115 Z"
              fill="#FACC15"
            />
            {/* Shining hair highlights */}
            <path d="M 90 75 Q 120 65 145 75" stroke="#FEF08A" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Sparkles */}
            <polygon points="175,65 180,68 185,65 182,72 186,76 179,76 175,82 173,76 166,76 170,72" fill="#F59E0B" />

            <text x="120" y="222" fontSize="14" fill="#A16207" fontWeight="bold" textAnchor="middle">
              BLONDE ✦ 亮金发
            </text>
          </g>
        )}

        {/* 10. dark (hair) */}
        {id === 'dark_hair' && (
          <g>
            <rect x="0" y="0" width="240" height="240" rx="32" fill="#F8FAFC" />
            {/* Kid face */}
            <circle cx="120" cy="115" r="45" fill="#FED7AA" />
            <circle cx="105" cy="115" r="4" fill="#1E293B" />
            <circle cx="135" cy="115" r="4" fill="#1E293B" />
            <path d="M 112 130 Q 120 138 128 130" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <circle cx="98" cy="122" r="4" fill="#FB7185" opacity="0.6" />
            <circle cx="142" cy="122" r="4" fill="#FB7185" opacity="0.6" />

            {/* Glossy Dark / Black Hair */}
            <path
              d="M 68 115 C 68 55 172 55 172 115 C 180 142 165 148 155 120 C 145 75 95 75 85 120 C 75 148 60 142 68 115 Z"
              fill="#0F172A"
            />
            {/* Cool hair sheen */}
            <path d="M 95 75 Q 120 68 145 75" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" fill="none" />

            <text x="120" y="222" fontSize="14" fill="#1E293B" fontWeight="bold" textAnchor="middle">
              DARK ✦ 乌黑发
            </text>
          </g>
        )}

        {/* 11. straight (hair) */}
        {id === 'straight_hair' && (
          <g>
            <rect x="0" y="0" width="240" height="240" rx="32" fill="#EEF2FF" />
            {/* Face */}
            <circle cx="120" cy="110" r="40" fill="#FED7AA" />
            <circle cx="108" cy="110" r="3.5" fill="#1E293B" />
            <circle cx="132" cy="110" r="3.5" fill="#1E293B" />
            <path d="M 114 125 Q 120 130 126 125" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Straight Hair flowing down smooth */}
            <path d="M 75 105 L 75 185 L 90 185 L 90 125 Z" fill="#4338CA" />
            <path d="M 165 105 L 165 185 L 150 185 L 150 125 Z" fill="#4338CA" />
            {/* Bangs */}
            <rect x="75" y="70" width="90" height="35" rx="10" fill="#4338CA" />
            {/* Parallel sleek lines */}
            <line x1="82" y1="110" x2="82" y2="180" stroke="#6366F1" strokeWidth="2" />
            <line x1="158" y1="110" x2="158" y2="180" stroke="#6366F1" strokeWidth="2" />

            <text x="120" y="222" fontSize="14" fill="#4338CA" fontWeight="bold" textAnchor="middle">
              STRAIGHT ✦ 笔直顺滑
            </text>
          </g>
        )}

        {/* 12. curly (hair) */}
        {id === 'curly_hair' && (
          <g>
            <rect x="0" y="0" width="240" height="240" rx="32" fill="#FDF2F8" />
            {/* Face */}
            <circle cx="120" cy="115" r="40" fill="#FED7AA" />
            <circle cx="108" cy="115" r="3.5" fill="#1E293B" />
            <circle cx="132" cy="115" r="3.5" fill="#1E293B" />
            <path d="M 114 130 Q 120 136 126 130" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Bouncy Curly Spirals all around */}
            <circle cx="75" cy="80" r="18" fill="#DB2777" />
            <circle cx="100" cy="65" r="18" fill="#EC4899" />
            <circle cx="125" cy="62" r="18" fill="#DB2777" />
            <circle cx="150" cy="68" r="18" fill="#EC4899" />
            <circle cx="170" cy="85" r="18" fill="#DB2777" />

            {/* Side curls */}
            <circle cx="68" cy="110" r="17" fill="#F472B6" />
            <circle cx="70" cy="138" r="16" fill="#DB2777" />
            <circle cx="172" cy="110" r="17" fill="#F472B6" />
            <circle cx="170" cy="138" r="16" fill="#DB2777" />

            {/* Swirl accents */}
            <path d="M 96 66 Q 102 60 106 66" stroke="#FFFFFF" strokeWidth="2" fill="none" />
            <path d="M 144 66 Q 150 60 154 66" stroke="#FFFFFF" strokeWidth="2" fill="none" />

            <text x="120" y="222" fontSize="14" fill="#BE185D" fontWeight="bold" textAnchor="middle">
              CURLY ✦ 蓬松卷曲
            </text>
          </g>
        )}

        {/* 13. ugly (friendly quirky funny monster) */}
        {id === 'ugly' && (
          <g>
            <rect x="0" y="0" width="240" height="240" rx="32" fill="#FAF5FF" />
            {/* Goofy Wobbly Body */}
            <path
              d="M 70 160 C 50 90 90 60 120 60 C 160 60 190 90 170 160 C 150 190 85 190 70 160 Z"
              fill="#A855F7"
            />
            {/* Silly single horn on side */}
            <polygon points="145,55 160,25 135,45" fill="#F59E0B" />
            {/* Goofy Mismatched Eyes */}
            <circle cx="100" cy="95" r="18" fill="#FFFFFF" />
            <circle cx="102" cy="96" r="8" fill="#1E293B" />
            <circle cx="104" cy="94" r="3" fill="#FFFFFF" />

            <circle cx="138" cy="90" r="11" fill="#FFFFFF" />
            <circle cx="136" cy="90" r="5" fill="#1E293B" />

            {/* Funny Jagged Tooth Smile */}
            <path d="M 85 135 Q 120 165 155 135" stroke="#1E293B" strokeWidth="3" fill="#581C87" />
            <polygon points="105,138 113,138 109,150" fill="#FFFFFF" />
            <polygon points="128,142 136,142 132,152" fill="#FFFFFF" />

            {/* Playful green warts / spots */}
            <circle cx="82" cy="115" r="6" fill="#84CC16" />
            <circle cx="156" cy="120" r="5" fill="#84CC16" />

            <text x="120" y="222" fontSize="14" fill="#7E22CE" fontWeight="bold" textAnchor="middle">
              UGLY ✦ 搞怪丑萌
            </text>
          </g>
        )}

        {/* 14. moustache (upper lip) */}
        {id === 'moustache' && (
          <g>
            <rect x="0" y="0" width="240" height="240" rx="32" fill="#FFF7ED" />
            {/* Nose & Mouth area focus */}
            <circle cx="120" cy="110" r="52" fill="#FED7AA" />
            {/* Nose */}
            <path d="M 120 75 Q 126 95 116 102 Q 120 106 128 103" stroke="#EA580C" strokeWidth="3" fill="none" strokeLinecap="round" />

            {/* Iconic Curled Handlebar Moustache right on the upper lip */}
            <g transform="translate(120, 118)">
              <path
                d="M 0 0 C -25 -15 -55 5 -45 22 C -38 28 -28 15 -18 8 C -8 3 0 10 0 10 C 0 10 8 3 18 8 C 28 15 38 28 45 22 C 55 5 25 -15 0 0 Z"
                fill="#78350F"
                stroke="#451A03"
                strokeWidth="2"
              />
            </g>

            {/* Lower Lip and Smile underneath */}
            <path d="M 110 142 Q 120 148 130 142" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* Arrow highlighting Moustache */}
            <line x1="45" y1="125" x2="68" y2="125" stroke="#EA580C" strokeWidth="2.5" />
            <polygon points="72,125 64,121 64,129" fill="#EA580C" />
            <text x="40" y="112" fontSize="11" fill="#EA580C" fontWeight="bold">Upper Lip</text>

            <text x="120" y="222" fontSize="14" fill="#C2410C" fontWeight="bold" textAnchor="middle">
              MOUSTACHE ✦ 嘴唇上八字胡
            </text>
          </g>
        )}

        {/* 15. beard (chin and cheeks) */}
        {id === 'beard' && (
          <g>
            <rect x="0" y="0" width="240" height="240" rx="32" fill="#F0F9FF" />
            {/* Friendly Captain / Adventurer */}
            <circle cx="120" cy="85" r="38" fill="#FED7AA" />
            <circle cx="108" cy="82" r="3" fill="#1E293B" />
            <circle cx="132" cy="82" r="3" fill="#1E293B" />
            <path d="M 115 94 Q 120 98 125 94" stroke="#78350F" strokeWidth="2" fill="none" />

            {/* Grand Fluffy Bushy Beard all around Chin & Cheeks */}
            <path
              d="M 82 85 C 80 125 90 175 120 178 C 150 175 160 125 158 85 C 150 95 142 110 120 110 C 98 110 90 95 82 85 Z"
              fill="#0369A1"
            />
            {/* Fluffy curl textures */}
            <circle cx="95" cy="130" r="14" fill="#0284C7" />
            <circle cx="120" cy="150" r="16" fill="#0284C7" />
            <circle cx="145" cy="130" r="14" fill="#0284C7" />

            {/* Arrow highlighting Chin Beard */}
            <line x1="45" y1="165" x2="85" y2="155" stroke="#0284C7" strokeWidth="2.5" />
            <polygon points="90,154 80,150 83,158" fill="#0284C7" />
            <text x="40" y="152" fontSize="11" fill="#0284C7" fontWeight="bold">Chin & Cheeks</text>

            <text x="120" y="222" fontSize="14" fill="#0369A1" fontWeight="bold" textAnchor="middle">
              BEARD ✦ 下巴大胡须
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
