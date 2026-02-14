import { useEffect, useState } from "react";
import { getChat, sendChat } from "../api/matches";
import { ChatMessage } from "../types";

type Props = {
  matchId: string | number;
};

const ChatBox = ({ matchId }: Props) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  const load = () => {
    getChat(matchId).then(setMessages);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, [matchId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendChat(matchId, input.trim());
    setInput("");
    load();
  };

  return (
    <div className="mt-6 border border-zinc-800 rounded p-3 flex flex-col h-64">
      <div className="font-semibold text-sm mb-2">Match Chat</div>
      <div className="flex-1 overflow-y-auto space-y-1 text-xs mb-2">
        {messages.map((m) => (
          <div key={m.id} className="text-zinc-300">
            <span className="text-zinc-500 mr-1">
              {new Date(m.created_at).toLocaleTimeString()}
            </span>
            <span>{m.message}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="flex space-x-2">
        <input
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="px-3 py-1 text-xs rounded bg-emerald-600 hover:bg-emerald-500"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
