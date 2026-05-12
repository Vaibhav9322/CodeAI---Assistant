import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import toast from "react-hot-toast";

const CodeBlock = ({ code, language = "plaintext", showActions = true }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = { python: "py", javascript: "js", java: "java", cpp: "cpp", c: "c" }[language] || "txt";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded!");
  };

  return (
    <div className="rounded-lg overflow-hidden border border-white/10 my-2">
      <div className="flex items-center justify-between px-4 py-2 bg-dark-600 border-b border-white/10">
        <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">{language}</span>
        {showActions && (
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
            >
              {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
            >
              <Download size={12} />
              Download
            </button>
          </div>
        )}
      </div>
      <pre className="p-4 bg-dark-800 overflow-x-auto text-sm text-slate-300 code-block leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
