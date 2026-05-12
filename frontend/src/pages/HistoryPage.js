import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { chatService, snippetService } from "../services/chatService";
import Layout from "../components/Layout";
import CodeBlock from "../components/CodeBlock";
import { MessageSquare, Search, Trash2, Code2, Clock } from "lucide-react";
import toast from "react-hot-toast";

const HistoryPage = () => {
  const [chats, setChats] = useState([]);
  const [snippets, setSnippets] = useState([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("chats");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [chatsRes, snippetsRes] = await Promise.all([
          chatService.getChats(),
          snippetService.getSnippets(),
        ]);
        setChats(chatsRes.data);
        setSnippets(snippetsRes.data);
      } catch {
        toast.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const deleteChat = async (id, e) => {
    e.stopPropagation();
    try {
      await chatService.deleteChat(id);
      setChats(prev => prev.filter(c => c.id !== id));
      toast.success("Chat deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const deleteSnippet = async (id) => {
    try {
      await snippetService.deleteSnippet(id);
      setSnippets(prev => prev.filter(s => s.id !== id));
      toast.success("Snippet deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const filteredChats = chats.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));
  const filteredSnippets = snippets.filter(s =>
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.language?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="h-screen overflow-y-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">History</h1>
          <p className="text-slate-400 text-sm mt-1">Your past conversations and saved snippets</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search chats and snippets..."
            className="w-full bg-dark-700 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { id: "chats", label: "Chats", icon: MessageSquare, count: chats.length },
            { id: "snippets", label: "Snippets", icon: Code2, count: snippets.length },
          ].map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === id ? "bg-purple-600 text-white" : "glass text-slate-400 hover:text-white"}`}
            >
              <Icon size={14} /> {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === id ? "bg-white/20" : "bg-white/10"}`}>{count}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="glass rounded-xl h-16 animate-pulse" />)}
          </div>
        ) : tab === "chats" ? (
          filteredChats.length === 0 ? (
            <div className="glass rounded-xl p-10 text-center">
              <MessageSquare size={32} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">{search ? "No chats match your search" : "No chat history yet"}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredChats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => navigate(`/chat/${chat.id}`)}
                  className="glass glass-hover rounded-xl px-4 py-3.5 flex items-center gap-3 cursor-pointer transition-all group"
                >
                  <MessageSquare size={16} className="text-purple-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{chat.title}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock size={11} className="text-slate-600" />
                      <p className="text-xs text-slate-500">{new Date(chat.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => deleteChat(chat.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )
        ) : (
          filteredSnippets.length === 0 ? (
            <div className="glass rounded-xl p-10 text-center">
              <Code2 size={32} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">{search ? "No snippets match your search" : "No saved snippets yet"}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSnippets.map(snippet => (
                <div key={snippet.id} className="glass rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-white">{snippet.title || "Untitled Snippet"}</p>
                      <p className="text-xs text-slate-500">{new Date(snippet.created_at).toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => deleteSnippet(snippet.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <CodeBlock code={snippet.code} language={snippet.language} />
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </Layout>
  );
};

export default HistoryPage;
