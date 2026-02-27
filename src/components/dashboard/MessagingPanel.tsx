import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/integrations/firebase/client";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp
} from "firebase/firestore";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: Timestamp | null;
  read: boolean;
}

interface MessagingPanelProps {
  campaignId: string;
  receiverId: string;
  receiverName: string;
}

const MessagingPanel = ({ campaignId, receiverId, receiverName }: MessagingPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const auth = getAuth();

  const chatId =
    currentUserId && receiverId
      ? [campaignId, currentUserId, receiverId].sort().join("_")
      : null;


  /* ---------- CURRENT USER ---------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUserId(user.uid);
    });
    return unsub;
  }, []);

  /* ---------- REALTIME MESSAGES ---------- */
  useEffect(() => {
  if (!chatId) return;

  const q = query(
    collection(db, "messages"),
    where("chat_id", "==", chatId),
    orderBy("created_at", "asc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const msgs: Message[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Message, "id">),
    }));

    setMessages(msgs); // 🔥 REPLACE state, not append
  });

  return unsubscribe;
}, [chatId]);
//     const data: Message[] = snapshot.docs.map((doc) => {
//       const d = doc.data();
//       return {
//         id: doc.id,
//         sender_id: d.sender_id,
//         receiver_id: d.receiver_id,
//         message: d.message,
//         created_at: d.created_at,
//         read: d.read ?? false,
//       };
//     });

//     setMessages(data);
//   });

//   return unsubscribe;
// }, [chatId]);


  /* ---------- SEND MESSAGE ---------- */
 const handleSendMessage = async () => {
  if (!newMessage.trim() || !currentUserId || !chatId) return;

  try {
    await addDoc(collection(db, "messages"), {
      chat_id: chatId,
      campaign_id: campaignId,
      sender_id: currentUserId,
      receiver_id: receiverId,
      message: newMessage.trim(),
      created_at: serverTimestamp(), // IMPORTANT
      read: false,
    });

    setNewMessage("");
  } catch (error) {
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to send",
    });
  }
};

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Messages with {receiverName}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No messages yet. Start the conversation!
            </p>
          ) : (
            messages.map((msg) => {
              const date = msg.created_at?.toDate?.();
              return (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender_id === currentUserId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                      msg.sender_id === currentUserId
                        ? "bg-blue-100 text-blue-900 rounded-bl-none"
                        : "bg-blue-100 text-blue-900 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    {date && (
                      <span className="text-[10px] opacity-70 block mt-1">
                        {date.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessagingPanel;
