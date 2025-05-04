import {
  Avatar,
  Badge,
  Button,
  createStyles,
  Group,
  Loader,
  Paper,
  ScrollArea,
  TextInput,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../../hooks/use-store";
import { ChatMessage, PitchRoom } from "../../types/pitch-room";
import socket from "../../utils/socket";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const useStyles = createStyles((theme) => ({
  root: {
    display: "flex",
    height: "100vh",
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  chatContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    border: `1px solid ${theme.colors.gray[3]}`,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
  messagesArea: {
    flex: 1,
    overflowY: "auto",
    marginBottom: theme.spacing.md,
  },
  messageBubble: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.gray[0],
    marginBottom: theme.spacing.xs,
  },
  inputGroup: {
    display: "flex",
    gap: theme.spacing.sm,
  },
  pdfViewer: {
    width: "50%",
    border: `1px solid ${theme.colors.gray[3]}`,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
  participant: {
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
}));

const ChatRoom = () => {
  const { classes } = useStyles();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { authStore } = useStore();

  const [pitchRoom, setPitchRoom] = useState<PitchRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);

  const user = authStore.User;
  const role = authStore.Role;

  useEffect(() => {
    if (!roomId || !user) return;

    fetch(`/api/pitchRoom/${roomId}`)
      .then((res) => res.json())
      .then((data) => {
        setPitchRoom(data);
        setMessages(data.chatMessages);
        socket.emit("join", { roomId, userId: user._id });
      })
      .catch(console.error);

    socket.on("newMessage", (message: ChatMessage) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === message._id);
        return exists ? prev : [...prev, message];
      });
    });

    socket.on("userConnected", (id: string) => {
      setConnectedUsers((prev) => [...new Set([...prev, id])]);
    });

    socket.on("userDisconnected", (id: string) => {
      setConnectedUsers((prev) => prev.filter((uid) => uid !== id));
      showNotification({
        title: "User Left",
        message: `User ${id} disconnected from chat.`,
        color: "red",
      });
    });

    return () => {
      socket.emit("leave", { roomId, userId: user._id });
      socket.off("newMessage");
      socket.off("userConnected");
      socket.off("userDisconnected");
    };
  }, [roomId, user]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const msg = { senderId: user?._id, content: newMessage };

    fetch(`/api/pitchRoom/${roomId}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.chatMessages);
        setNewMessage("");
      })
      .catch(console.error);
  };

  const handleExit = () => {
    socket.emit("leave", { roomId, userId: user?._id });
    showNotification({
      title: "Exited Chat",
      message: `${user?.fullName} has left the chat.`,
      color: "red",
    });
    navigate(role === "founder" ? "/founder/dashboard" : "/investor/feedback");
  };

  if (!pitchRoom)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Loader />
      </div>
    );

  return (
    <div className={classes.root}>
      <div className={classes.chatContainer}>
        <div className={classes.topBar}>
          <Group>
            <Title order={4}>{pitchRoom.roomName}</Title>
            <Group>
              {[pitchRoom.founderId, ...pitchRoom.investorIds].map((id) => (
                <Group key={id} className={classes.participant}>
                  <Avatar radius="xl" size="sm" />
                  <Badge color={connectedUsers.includes(id) ? "green" : "gray"}>
                    {connectedUsers.includes(id) ? "Online" : "Offline"}
                  </Badge>
                </Group>
              ))}
            </Group>
          </Group>
          <Group>
            <Button color="gray" variant="outline" onClick={handleExit}>
              Exit Chat
            </Button>
            <Button
              color="blue"
              onClick={() =>
                navigate(
                  role === "founder"
                    ? "/founder/dashboard"
                    : "/investor/feedback"
                )
              }
            >
              Complete
            </Button>
          </Group>
        </div>

        <ScrollArea className={classes.messagesArea}>
          {messages.map((msg) => (
            <Paper key={msg._id} className={classes.messageBubble} shadow="xs">
              <strong>{msg.senderId}:</strong> {msg.content}
            </Paper>
          ))}
        </ScrollArea>

        <Group className={classes.inputGroup}>
          <TextInput
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.currentTarget.value)}
            sx={{ flex: 1 }}
          />
          <Button onClick={handleSend}>Send</Button>
        </Group>
      </div>

      <div className={classes.pdfViewer}>
        <Document file={pitchRoom.pitchPdf}>
          <Page pageNumber={1} />
        </Document>
      </div>
    </div>
  );
};

export default ChatRoom;
