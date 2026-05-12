import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Editor from "@monaco-editor/react";
import { chatService, snippetService } from "../services/chatService";
import Layout from "../components/Layout";
import { Send, Plus, Code2, Bookmark, RefreshCw, Zap, X, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

const SUGGESTIONS = [
  { icon: "💡", text: "Explain how recursion works with an example" },
  { icon: "🐍", text: "Write a Python function to reverse a linked list" },
  { icon: "🗄️", text: "What's the difference between SQL and NoSQL?" },
  { icon: "🐛", text: "Why does my for loop run infinitely?" },
  { icon: "🔄", text: "Convert this Python code to JavaScript" },
  { icon: "⚡", text: "How does async/await work in JavaScript?" },
  { icon: "🚀", text: "Write a REST API in FastAPI" },
  { icon: "📊", text: "Explain Big O notation simply" },
];

const LANGUAGES = ["python", "javascript", "java", "cpp", "c"];

// Inline copy button for code blocks
const CopyButton = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
    >
      {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

// Full markdown renderer — ChatGPT style
const MarkdownContent = ({ content, onSaveSnippet, isUser }) => {
  if (isUser) return <p className="text-sm text-white whitespace-pre-wrap">{content}</p>;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Headings
        h1: ({ children }) => <h1 className="text-xl font-bold text-white mt-4 mb-2">{children}</h1>,
        h2: ({ children }) => <h2 className="text-lg font-bold text-white mt-4 mb-2">{children}</h2>,
        h3: ({ children }) => <h3 className="text-base font-semibold text-white mt-3 mb-1">{children}</h3>,

        // Paragraph
        p: ({ children }) => <p className="text-sm text-slate-200 leading-7 mb-3">{children}</p>,

        // Bold & Italic
        strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
        em: ({ children }) => <em className="text-slate-300 italic">{children}</em>,

        // Inline code
        code: ({ inline, className, children }) => {
          const lang = (className || "").replace("language-", "") || "plaintext";
          const codeStr = String(children).replace(/\n$/, "");

          if (inline) {
            return (
              <code className="bg-white/10 text-cyan-300 px-1.5 py-0.5 rounded text-xs font-mono">
                {codeStr}
              </code>
            );
          }

          // Block code
          return (
            <div className="my-3 rounded-xl overflow-hidden border border-white/10">
              <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e2e] border-b border-white/10">
                <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">{lang}</span>
                <div className="flex items-center gap-2">
                  {onSaveSnippet && (
                    <button
                      onClick={() => onSaveSnippet(codeStr, lang)}
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
                    >
                      <Bookmark size={11} /> Save
                    </button>
                  )}
                  <CopyButton code={codeStr} />
                  <button
                    onClick={() => {
                      const ext = { python: "py", javascript: "js", java: "java", cpp: "cpp", c: "c" }[lang] || "txt";
                      const blob = new Blob([codeStr], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url; a.download = `code.${ext}`; a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
                  >
                    ↓
                  </button>
                </div>
              </div>
              <pre className="p-4 bg-[#0d0d14] overflow-x-auto text-sm text-slate-300 font-mono leading-relaxed">
                <code>{codeStr}</code>
              </pre>
            </div>
          );
        },

        // Lists
        ul: ({ children }) => <ul className="list-disc list-outside pl-5 space-y-1 mb-3 text-sm text-slate-200">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-outside pl-5 space-y-1 mb-3 text-sm text-slate-200">{children}</ol>,
        li: ({ children }) => <li className="leading-7">{children}</li>,

        // Blockquote
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-purple-500 pl-4 my-3 text-slate-400 italic text-sm">
            {children}
          </blockquote>
        ),

        // Table
        table: ({ children }) => (
          <div className="overflow-x-auto my-3">
            <table className="w-full text-sm border-collapse border border-white/10 rounded-lg overflow-hidden">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-white/5">{children}</thead>,
        th: ({ children }) => <th className="px-4 py-2 text-left text-white font-semibold border border-white/10">{children}</th>,
        td: ({ children }) => <td className="px-4 py-2 text-slate-300 border border-white/10">{children}</td>,
        tr: ({ children }) => <tr className="hover:bg-white/[0.03] transition-colors">{children}</tr>,

        // Horizontal rule
        hr: () => <hr className="border-white/10 my-4" />,

        // Links
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline underline-offset-2">
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

const Message = ({ msg, onSaveSnippet }) => {
  const isUser = msg.role === "user";
  return (
    <div className={`group flex gap-4 px-6 py-5 ${isUser ? "flex-row-reverse" : ""} hover:bg-white/[0.015] transition-colors`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${isUser ? "bg-purple-600" : "bg-gradient-to-br from-purple-500 to-cyan-500"}`}>
        {isUser ? "U" : "AI"}
      </div>

      {/* Content */}
      <div className={`min-w-0 ${isUser ? "flex flex-col items-end max-w-[85%]" : "flex-1 max-w-[90%]"}`}>
        <span className="text-xs text-slate-500 font-medium mb-1.5 block">{isUser ? "You" : "CodeAI"}</span>
        <div className={isUser ? "bg-purple-600/80 rounded-2xl rounded-tr-sm px-4 py-2.5" : ""}>
          <MarkdownContent
            content={msg.content}
            onSaveSnippet={isUser ? null : onSaveSnippet}
            isUser={isUser}
          />
        </div>
      </div>
    </div>
  );
};

const ChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(chatId || null);
  const [showEditor, setShowEditor] = useState(false);
  const [editorCode, setEditorCode] = useState("");
  const [editorLang, setEditorLang] = useState("python");
  const [chatTitle, setChatTitle] = useState("New Chat");
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (chatId) {
      setCurrentChatId(chatId);
      chatService.getMessages(chatId).then(res => setMessages(res.data)).catch(() => {});
    } else {
      setMessages([]);
      setCurrentChatId(null);
      setChatTitle("New Chat");
    }
  }, [chatId]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  const handleSend = useCallback(async (overrideInput) => {
    const text = (overrideInput || input).trim();
    const hasCode = editorCode.trim() && showEditor;
    if (!text && !hasCode) return;

    const userContent = hasCode ? `${text}\n\`\`\`${editorLang}\n${editorCode}\n\`\`\`` : text;
    setMessages(prev => [...prev, { role: "user", content: userContent, id: Date.now() }]);
    setInput("");
    setLoading(true);

    try {
      let cid = currentChatId;
      if (!cid) {
        const title = text.slice(0, 50) || "New Chat";
        const res = await chatService.createChat(title);
        cid = res.data.id;
        setCurrentChatId(cid);
        setChatTitle(title);
        navigate(`/chat/${cid}`, { replace: true });
      }
      const res = await chatService.sendMessage(cid, userContent);
      const aiContent = res.data.content || res.data.response;
      setMessages(prev => [...prev, { role: "assistant", content: aiContent, id: Date.now() + 1 }]);
      if (hasCode) setEditorCode("");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Something went wrong");
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }, [input, editorCode, editorLang, showEditor, currentChatId, navigate]);

  const handleSaveSnippet = async (code, language) => {
    try {
      await snippetService.saveSnippet({ code, language, title: `${language} snippet` });
      toast.success("Snippet saved!");
    } catch {
      toast.error("Failed to save snippet");
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <Layout>
      <div className="flex flex-col h-screen bg-dark-900">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <span className="text-sm font-medium text-slate-300 truncate max-w-xs">{chatTitle}</span>
          </div>
          <button
            onClick={() => { navigate("/chat"); setMessages([]); setCurrentChatId(null); setInput(""); setEditorCode(""); setShowEditor(false); setChatTitle("New Chat"); }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white glass px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all"
          >
            <Plus size={13} /> New chat
          </button>
        </div>

        {/* Messages / Empty State */}
        <div className="flex-1 overflow-y-auto">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full px-6 pb-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center mb-5 glow-purple">
                <Zap size={30} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">How can I help you?</h1>
              <p className="text-slate-400 text-sm mb-8">Ask me anything — code, concepts, debugging, or just chat.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.text}
                    onClick={() => handleSend(s.text)}
                    className="glass glass-hover text-left px-4 py-3 rounded-xl text-sm text-slate-300 hover:text-white transition-all flex items-start gap-3"
                  >
                    <span className="text-base flex-shrink-0">{s.icon}</span>
                    <span>{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto w-full py-4">
              {messages.map((msg) => (
                <Message key={msg.id || msg.created_at} msg={msg} onSaveSnippet={handleSaveSnippet} />
              ))}
              {loading && (
                <div className="flex gap-4 px-6 py-5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold flex-shrink-0">AI</div>
                  <div className="flex items-center gap-1.5 mt-2">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full bg-purple-400 typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex-shrink-0 px-4 pb-5 pt-2 max-w-3xl mx-auto w-full">
          {showEditor && (
            <div className="mb-2 rounded-xl overflow-hidden border border-white/10">
              <div className="flex items-center justify-between px-3 py-1.5 bg-dark-700 border-b border-white/10">
                <select value={editorLang} onChange={e => setEditorLang(e.target.value)} className="bg-transparent text-xs text-slate-400 focus:outline-none">
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <button onClick={() => { setShowEditor(false); setEditorCode(""); }} className="text-slate-500 hover:text-white transition-colors">
                  <X size={14} />
                </button>
              </div>
              <Editor
                height="180px"
                language={editorLang}
                value={editorCode}
                onChange={val => setEditorCode(val || "")}
                theme="vs-dark"
                options={{ minimap: { enabled: false }, fontSize: 13, fontFamily: "JetBrains Mono, monospace", lineNumbers: "on", scrollBeyondLastLine: false, padding: { top: 8 }, automaticLayout: true }}
              />
            </div>
          )}

          <div className="glass rounded-2xl border border-white/10 focus-within:border-purple-500/40 transition-colors shadow-lg">
            <div className="flex items-end gap-2 px-4 py-3">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Message CodeAI..."
                rows={1}
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 resize-none focus:outline-none leading-relaxed"
                style={{ minHeight: "24px", maxHeight: "160px" }}
              />
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => setShowEditor(!showEditor)}
                  title="Attach code"
                  className={`p-1.5 rounded-lg transition-colors ${showEditor ? "text-cyan-400 bg-cyan-500/10" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}
                >
                  <Code2 size={16} />
                </button>
                <button
                  onClick={() => handleSend()}
                  disabled={loading || (!input.trim() && !editorCode.trim())}
                  className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center hover:opacity-90 disabled:opacity-30 transition-all"
                >
                  {loading ? <RefreshCw size={14} className="animate-spin text-white" /> : <Send size={14} className="text-white" />}
                </button>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-slate-600 mt-2">Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
