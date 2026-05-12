import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { chatService, userService } from "../services/chatService";
import Layout from "../components/Layout";
import { MessageSquare, Code2, Bug, Languages, Sparkles, Plus, Clock, Zap, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

const quickActions = [
  { icon: Code2, label: "Generate Code", color: "from-purple-600 to-purple-800", action: "generate" },
  { icon: Bug, label: "Debug Code", color: "from-red-600 to-red-800", action: "debug" },
  { icon: Sparkles, label: "Explain Code", color: "from-cyan-600 to-cyan-800", action: "explain" },
  { icon: Languages, label: "Convert Code", color: "from-green-600 to-green-800", action: "convert" },
];

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="glass rounded-xl p-5 flex items-center gap-4">
    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
      <Icon size={18} className="text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [stats, setStats] = useState({ total_chats: 0, total_messages: 0, total_snippets: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chatsRes, statsRes] = await Promise.all([
          chatService.getChats(),
          userService.getStats(),
        ]);
        setChats(chatsRes.data.slice(0, 5));
        setStats(statsRes.data);
      } catch {
        // silently fail, show empty state
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNewChat = async (action) => {
    try {
      const titles = { generate: "Code Generation", debug: "Debug Session", explain: "Code Explanation", convert: "Language Conversion" };
      const res = await chatService.createChat(titles[action] || "New Chat");
      navigate(`/chat/${res.data.id}?mode=${action}`);
    } catch {
      toast.error("Failed to create chat");
    }
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <Layout>
      <div className="h-screen overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{greeting}, {user?.username} 👋</h1>
            <p className="text-slate-400 text-sm mt-1">What are you building today?</p>
          </div>
          <button
            onClick={() => handleNewChat("generate")}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus size={16} /> New Chat
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={MessageSquare} label="Total Chats" value={stats.total_chats} color="from-purple-600 to-purple-800" />
          <StatCard icon={Zap} label="AI Messages" value={stats.total_messages} color="from-cyan-600 to-cyan-800" />
          <StatCard icon={BookOpen} label="Saved Snippets" value={stats.total_snippets} color="from-green-600 to-green-800" />
          <StatCard icon={Clock} label="Days Active" value={stats.days_active || 1} color="from-orange-600 to-orange-800" />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map(({ icon: Icon, label, color, action }) => (
              <button
                key={action}
                onClick={() => handleNewChat(action)}
                className={`glass glass-hover rounded-xl p-5 flex flex-col items-center gap-3 transition-all duration-200 group`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon size={22} className="text-white" />
                </div>
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Chats */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Recent Chats</h2>
            <button onClick={() => navigate("/history")} className="text-xs text-purple-400 hover:text-purple-300">View all</button>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="glass rounded-xl h-16 animate-pulse" />)}
            </div>
          ) : chats.length === 0 ? (
            <div className="glass rounded-xl p-8 text-center">
              <MessageSquare size={32} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No chats yet. Start a new conversation!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => navigate(`/chat/${chat.id}`)}
                  className="w-full glass glass-hover rounded-xl px-4 py-3.5 flex items-center gap-3 text-left transition-all"
                >
                  <MessageSquare size={16} className="text-purple-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{chat.title}</p>
                    <p className="text-xs text-slate-500">{new Date(chat.created_at).toLocaleDateString()}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
