"use client";

import { useState, useRef } from "react";
import {
  Bold,
  Italic,
  List,
  Heading2,
  Heading3,
  Quote,
  Eye,
  Edit3,
  Sparkles,
  FileText,
  RotateCcw,
  Check,
  HelpCircle,
  Flower2,
  Clock,
  Wind
} from "lucide-react";

interface RichDescriptionEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  minRows?: number;
}

export default function RichDescriptionEditor({
  value,
  onChange,
  label = "Perfume Description & Olfactory Narrative",
  placeholder = "Describe the inspiration, opening notes, sillage, and luxurious flacon craftsmanship...",
  minRows = 8
}: RichDescriptionEditorProps) {
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [showTemplates, setShowTemplates] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  // Helper to insert markdown formatting at cursor or around selection
  const insertFormatting = (prefix: string, suffix: string = "", placeholderText: string = "text") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || placeholderText;
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 0);
  };

  const insertLinePrefix = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const before = value.substring(0, start);
    const after = value.substring(start);
    
    // Check if on a new line
    const lastNewline = before.lastIndexOf("\n");
    const isAtStartOfLine = lastNewline === start - 1 || start === 0;
    const insertStr = isAtStartOfLine ? prefix : `\n${prefix}`;

    const newValue = before + insertStr + after;
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + insertStr.length, start + insertStr.length);
    }, 0);
  };

  const applyTemplate = (templateText: string) => {
    if (value && value.trim().length > 0) {
      if (!window.confirm("Replace current description with this luxury olfactory template?")) {
        return;
      }
    }
    onChange(templateText);
    setShowTemplates(false);
    showToast("Luxury template applied!");
  };

  const templates = [
    {
      name: "Haute Parfumerie (Full Narrative)",
      description: "Atmospheric narrative with top, heart, and base notes breakdown.",
      content: `### The Inspiration\nCrafted under the warm Mediterranean twilight, this extrait de parfum captures timeless elegance and unspoken magnetic attraction.\n\n### Olfactory Pyramid\n- **Top Accords:** Sun-drenched Bergamot, Wild Pink Peppercorn, Cardamom\n- **Heart Notes:** Midnight Turkish Rose, French Orris Concrete, White Jasmine\n- **Base Foundation:** Aged Cambodian Oud, Rich Madagascar Vanilla, Smoked Amber\n\n> "An unforgettable aura that lingers like a velvet shadow on sunlit marble."\n\n### Longevity & Sillage\nExpect exceptional 14+ hours of opulent sillage with a soft, magnetic dry-down.`
    },
    {
      name: "Artisanal & Minimalist",
      description: "Sleek, focused description highlighting purity and flacon design.",
      content: `A masterclass in modern artisanal perfumery. Crisp, architectural, and undeniably refined.\n\n### Character & Mood\nClean, magnetic, and effortlessly aristocratic. Designed for discerning individuals who appreciate quiet luxury.\n\n### Primary Notes\nPure Calabrian Bergamot, Cashmere Woods, and Crystal White Musk.\n\nHand-poured into heavy custom crystal flacons with a genuine gold-plated magnetic cap.`
    },
    {
      name: "Royal Oud & Oriental Majesty",
      description: "Deep, mysterious, and warm formulation story.",
      content: `### Royal Heritage\nAn opulent celebration of Arabian royal perfumery, distilled from rare botanical resins and sustainably harvested heartwood.\n\n- **Opening:** Saffron Threads, Bulgarian Rose, Frankincense\n- **Heart:** Aged Assam Agarwood, Leather, Ambergris\n- **Dry-down:** Sweet Myrrh, Tonka Bean, Golden Sandalwood\n\nCrafted in 30% Extrait de Parfum concentration for monumental staying power.`
    }
  ];

  // Helper to render markdown preview simply and elegantly
  const renderFormattedPreview = (text: string) => {
    if (!text.trim()) {
      return (
        <div className="py-12 text-center text-zinc-400 italic font-serif">
          No description written yet. Type in Edit mode or choose a luxury template above.
        </div>
      );
    }

    const lines = text.split("\n");
    return (
      <div className="space-y-3 font-serif text-zinc-800 leading-relaxed text-sm sm:text-base">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} className="h-2" />;
          }

          // Heading 2
          if (trimmed.startsWith("## ")) {
            return (
              <h2 key={idx} className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950 pt-2 pb-1 border-b border-zinc-200">
                {trimmed.replace("## ", "")}
              </h2>
            );
          }

          // Heading 3
          if (trimmed.startsWith("### ")) {
            return (
              <h3 key={idx} className="text-xs sm:text-sm uppercase tracking-widest font-bold text-[#9E8255] font-sans pt-2">
                {trimmed.replace("### ", "")}
              </h3>
            );
          }

          // Quote
          if (trimmed.startsWith("> ")) {
            return (
              <blockquote key={idx} className="pl-4 py-1 border-l-2 border-[#C5A880] italic text-zinc-600 bg-[#C5A880]/5 rounded-r my-2 font-serif">
                {trimmed.replace(/^>\s*"?/, '"').replace(/"?$/, '"')}
              </blockquote>
            );
          }

          // Bullet list
          if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            const content = trimmed.replace(/^[-*]\s*/, "");
            return (
              <div key={idx} className="flex items-start gap-2 text-zinc-700 pl-2">
                <span className="text-[#C5A880] mt-1 text-xs">◆</span>
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(content) }} />
              </div>
            );
          }

          // Divider
          if (trimmed === "---" || trimmed === "***") {
            return <hr key={idx} className="border-zinc-200 my-4" />;
          }

          // Normal paragraph with inline formatting
          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
          );
        })}
      </div>
    );
  };

  const formatInlineMarkdown = (str: string) => {
    // Bold: **text**
    let formatted = str.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-zinc-950">$1</strong>');
    // Italic: *text*
    formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic text-zinc-800">$1</em>');
    // Code/Tag: `tag`
    formatted = formatted.replace(/`(.*?)`/g, '<span class="px-1.5 py-0.5 bg-zinc-100 border border-zinc-200 rounded text-xs font-mono text-[#9E8255]">$1</span>');
    return formatted;
  };

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  return (
    <div className="w-full space-y-2">
      {/* Header with Label and Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>{label}</span>
        </label>

        <div className="flex items-center gap-2">
          {/* Quick Templates Toggle */}
          <button
            type="button"
            onClick={() => setShowTemplates(!showTemplates)}
            className="px-2.5 py-1 text-[11px] font-bold text-[#9E8255] bg-[#C5A880]/10 hover:bg-[#C5A880]/20 border border-[#C5A880]/30 rounded-md transition-colors flex items-center gap-1.5"
            title="Use pre-written luxury perfume storytelling templates"
          >
            <Sparkles className="w-3 h-3 text-[#C5A880]" />
            <span>Story Templates</span>
          </button>

          {/* Edit / Preview Tabs */}
          <div className="inline-flex p-0.5 bg-zinc-100 border border-zinc-200 rounded-lg">
            <button
              type="button"
              onClick={() => setIsPreview(false)}
              className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                !isPreview
                  ? "bg-white text-zinc-950 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <Edit3 className="w-3 h-3" />
              <span>Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPreview(true)}
              className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isPreview
                  ? "bg-zinc-950 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <Eye className="w-3 h-3 text-[#C5A880]" />
              <span>Live Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Templates Drawer */}
      {showTemplates && (
        <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center justify-between pb-1 border-b border-zinc-200 text-xs font-bold text-zinc-700">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              Select a Luxury Perfume Storyline
            </span>
            <button
              type="button"
              onClick={() => setShowTemplates(false)}
              className="text-zinc-400 hover:text-zinc-600 text-xs"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
            {templates.map((tpl, i) => (
              <div
                key={i}
                onClick={() => applyTemplate(tpl.content)}
                className="p-2.5 bg-white border border-zinc-200 hover:border-[#C5A880] rounded-lg cursor-pointer transition-all hover:shadow-sm group"
              >
                <div className="text-xs font-bold text-zinc-900 group-hover:text-[#9E8255] transition-colors flex items-center justify-between">
                  <span>{tpl.name}</span>
                  <span className="text-[10px] text-zinc-400 font-mono">Use</span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">
                  {tpl.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white focus-within:border-zinc-400 focus-within:ring-1 focus-within:ring-zinc-400 transition-all shadow-sm">
        {/* Formatting Toolbar */}
        {!isPreview && (
          <div className="bg-zinc-50 border-b border-zinc-200 px-3 py-1.5 flex flex-wrap items-center gap-1 text-zinc-600 select-none">
            {/* Bold */}
            <button
              type="button"
              onClick={() => insertFormatting("**", "**", "Bold Text")}
              title="Bold (**text**)"
              className="p-1.5 hover:bg-zinc-200 rounded text-zinc-700 hover:text-zinc-950 transition-colors"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>

            {/* Italic */}
            <button
              type="button"
              onClick={() => insertFormatting("*", "*", "Italic text")}
              title="Italic (*text*)"
              className="p-1.5 hover:bg-zinc-200 rounded text-zinc-700 hover:text-zinc-950 transition-colors"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-4 bg-zinc-300 mx-1" />

            {/* Heading 2 */}
            <button
              type="button"
              onClick={() => insertLinePrefix("## ")}
              title="Heading 2 (## Title)"
              className="px-2 py-1 hover:bg-zinc-200 rounded text-xs font-bold text-zinc-700 transition-colors"
            >
              H2
            </button>

            {/* Heading 3 (Accords/Notes) */}
            <button
              type="button"
              onClick={() => insertLinePrefix("### ")}
              title="Heading 3 (### Section)"
              className="px-2 py-1 hover:bg-zinc-200 rounded text-xs font-bold text-zinc-700 transition-colors"
            >
              H3
            </button>

            <span className="w-px h-4 bg-zinc-300 mx-1" />

            {/* Bullet list */}
            <button
              type="button"
              onClick={() => insertLinePrefix("- ")}
              title="Bullet Point (- list item)"
              className="p-1.5 hover:bg-zinc-200 rounded text-zinc-700 hover:text-zinc-950 transition-colors"
            >
              <List className="w-3.5 h-3.5" />
            </button>

            {/* Quote */}
            <button
              type="button"
              onClick={() => insertLinePrefix("> ")}
              title="Luxury Quote (> quote)"
              className="p-1.5 hover:bg-zinc-200 rounded text-zinc-700 hover:text-zinc-950 transition-colors"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-4 bg-zinc-300 mx-1" />

            {/* Fragrance Accords Quick Insert */}
            <button
              type="button"
              onClick={() => insertLinePrefix("- **Top Notes:** Bergamot, Mandarin\n- **Heart Notes:** Turkish Rose, Jasmine\n- **Base Notes:** Oud, Amber, Vanilla\n")}
              title="Insert Olfactory Notes List"
              className="px-2 py-1 bg-white border border-zinc-200 hover:border-[#C5A880] rounded text-[11px] font-semibold text-zinc-700 hover:text-[#9E8255] transition-colors flex items-center gap-1 shadow-2xs"
            >
              <Flower2 className="w-3 h-3 text-[#C5A880]" />
              <span>Notes Pyramid</span>
            </button>

            {/* Longevity badge */}
            <button
              type="button"
              onClick={() => insertLinePrefix("**Longevity:** 12-16 Hours Extrait | **Sillage:** Monumental\n")}
              title="Insert Longevity & Sillage spec"
              className="px-2 py-1 bg-white border border-zinc-200 hover:border-[#C5A880] rounded text-[11px] font-semibold text-zinc-700 hover:text-[#9E8255] transition-colors flex items-center gap-1 shadow-2xs hidden sm:flex"
            >
              <Clock className="w-3 h-3 text-[#C5A880]" />
              <span>Longevity Spec</span>
            </button>

            {toastMessage && (
              <span className="ml-auto text-xs font-semibold text-emerald-600 animate-in fade-in flex items-center gap-1">
                <Check className="w-3 h-3" />
                {toastMessage}
              </span>
            )}
          </div>
        )}

        {/* Content Area: Editor or Live Preview */}
        {!isPreview ? (
          <textarea
            ref={textareaRef}
            rows={minRows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none resize-y font-mono leading-relaxed"
          />
        ) : (
          <div className="p-6 bg-gradient-to-b from-[#FAF8F5] to-white min-h-[220px] max-h-[460px] overflow-y-auto">
            <div className="max-w-2xl mx-auto border-l-2 border-[#C5A880]/30 pl-4 py-2">
              <span className="text-[10px] uppercase tracking-widest text-[#9E8255] font-sans font-bold block mb-2">
                Aura Haute Parfumerie • Storefront Preview
              </span>
              {renderFormattedPreview(value)}
            </div>
          </div>
        )}

        {/* Status bar */}
        <div className="bg-zinc-50 border-t border-zinc-200 px-3 py-2 flex items-center justify-between text-[11px] text-zinc-500">
          <div className="flex items-center gap-3">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} characters</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline text-zinc-400">Markdown syntax supported</span>
          </div>

          {value && !isPreview && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Clear all description content?")) {
                  onChange("");
                }
              }}
              className="text-zinc-400 hover:text-red-500 transition-colors text-[10px] uppercase font-bold tracking-wider"
            >
              Clear Text
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
