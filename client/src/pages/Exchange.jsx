import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import axios from "axios";

const Exchanges = () => {
  const { token, darkMode, user } = useAuth();
  const [exchanges, setExchanges] = useState([]);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [showRatingForm, setShowRatingForm] = useState(false);

  const d = darkMode;
  const bg = d ? "#0f172a" : "#f8fafc";
  const cardBg = d ? "#1e293b" : "#ffffff";
  const text = d ? "#f1f5f9" : "#111827";
  const subtext = d ? "#94a3b8" : "#6b7280";
  const border = d ? "#334155" : "#e5e7eb";
  const inputBg = d ? "#0f172a" : "#f9fafb";

  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/exchanges", config);
        setExchanges(res.data);
      } catch (err) {
        console.error("Failed to load exchanges");
      }
    };
    fetchExchanges();
  }, [token]);

  const sendMessage = async () => {
    if (!messageText.trim() || !selectedExchange) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/exchanges/${selectedExchange._id}/message`,
        { text: messageText },
        config
      );
      setExchanges(exchanges.map(e => e._id === selectedExchange._id ? res.data : e));
      setSelectedExchange(res.data);
      setMessageText("");
    } catch (err) {
      console.error("Failed to send message");
    }
    setLoading(false);
  };

  const acceptExchange = async () => {
    if (!selectedExchange) return;

    try {
      const res = await axios.put(
        `http://localhost:5000/api/exchanges/${selectedExchange._id}/accept`,
        {},
        config
      );
      setExchanges(exchanges.map(e => e._id === selectedExchange._id ? res.data : e));
      setSelectedExchange(res.data);
    } catch (err) {
      console.error("Failed to accept exchange");
    }
  };

  const submitRating = async () => {
    if (!selectedExchange || rating === 0) return;

    try {
      const res = await axios.post(
        `http://localhost:5000/api/exchanges/${selectedExchange._id}/rate`,
        { rating, comment: ratingComment },
        config
      );
      setExchanges(exchanges.map(e => e._id === selectedExchange._id ? res.data.exchange : e));
      setSelectedExchange(res.data.exchange);
      setShowRatingForm(false);
      setRating(0);
      setRatingComment("");
    } catch (err) {
      console.error("Failed to submit rating");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#f59e0b",
      accepted: "#10b981",
      completed: "#6366f1",
      cancelled: "#ef4444"
    };
    return colors[status] || "#6b7280";
  };

  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "system-ui, sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>

        <h2 style={{ fontSize: "22px", fontWeight: "700", color: text, marginBottom: "4px" }}>
          💬 Exchanges
        </h2>
        <p style={{ color: subtext, fontSize: "14px", marginBottom: "24px" }}>
          Chat and manage your skill exchange requests
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "20px", height: "600px" }}>

          {/* Exchanges List */}
          <div style={{
            background: cardBg, border: `1px solid ${border}`,
            borderRadius: "12px", padding: "20px",
            overflowY: "auto"
          }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: text, marginBottom: "16px" }}>
              Your Exchanges ({exchanges.length})
            </h3>

            {exchanges.length === 0 && (
              <p style={{ color: subtext, fontSize: "13px", textAlign: "center", padding: "20px" }}>
                No exchanges yet. Send a request in Find Skills!
              </p>
            )}

            {exchanges.map((ex) => (
              <div
                key={ex._id}
                onClick={() => setSelectedExchange(ex)}
                style={{
                  background: selectedExchange?._id === ex._id ? "#f0fdf4" : "transparent",
                  border: `1px solid ${selectedExchange?._id === ex._id ? "#16a34a" : border}`,
                  borderRadius: "8px", padding: "12px",
                  marginBottom: "8px", cursor: "pointer"
                }}
              >
                <p style={{ fontWeight: "600", color: text, marginBottom: "4px" }}>
                  {ex.initiator._id === user._id ? ex.recipient.name : ex.initiator.name}
                </p>
                <p style={{ fontSize: "12px", color: subtext, marginBottom: "4px" }}>
                  {ex.skillOffered} ↔ {ex.skillRequested}
                </p>
                <span style={{
                  background: getStatusColor(ex.status),
                  color: "white",
                  padding: "2px 8px", borderRadius: "12px",
                  fontSize: "11px", fontWeight: "500"
                }}>
                  {ex.status}
                </span>
              </div>
            ))}
          </div>

          {/* Chat Area */}
          <div style={{
            background: cardBg, border: `1px solid ${border}`,
            borderRadius: "12px", padding: "20px",
            display: "flex", flexDirection: "column"
          }}>
            {selectedExchange ? (
              <>
                <div style={{ marginBottom: "16px", borderBottom: `1px solid ${border}`, paddingBottom: "12px" }}>
                  <p style={{ fontWeight: "600", color: text, marginBottom: "4px" }}>
                    {selectedExchange.initiator._id === user._id 
                      ? selectedExchange.recipient.name 
                      : selectedExchange.initiator.name}
                  </p>
                  <p style={{ fontSize: "13px", color: subtext }}>
                    {selectedExchange.skillOffered} ↔ {selectedExchange.skillRequested}
                  </p>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: "auto", marginBottom: "16px", paddingRight: "8px" }}>
                  {selectedExchange.messages.length === 0 ? (
                    <p style={{ color: subtext, fontSize: "13px", textAlign: "center", padding: "20px" }}>
                      No messages yet. Start the conversation!
                    </p>
                  ) : (
                    selectedExchange.messages.map((msg, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: msg.sender === user._id ? "#f0fdf4" : inputBg,
                          borderRadius: "8px", padding: "10px 12px",
                          marginBottom: "8px", maxWidth: "80%",
                          marginLeft: msg.sender === user._id ? "auto" : "0"
                        }}
                      >
                        <p style={{ fontSize: "13px", color: text }}>{msg.text}</p>
                        <p style={{ fontSize: "11px", color: subtext, marginTop: "4px" }}>
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Action Buttons */}
                {selectedExchange.status === "pending" && selectedExchange.recipient._id === user._id && (
                  <button
                    onClick={acceptExchange}
                    style={{
                      width: "100%", background: "#10b981",
                      color: "white", border: "none", borderRadius: "8px",
                      padding: "10px", fontSize: "13px", fontWeight: "600",
                      cursor: "pointer", marginBottom: "8px"
                    }}
                  >
                    ✅ Accept Exchange
                  </button>
                )}

                {selectedExchange.status === "completed" && !showRatingForm && (
                  <button
                    onClick={() => setShowRatingForm(true)}
                    style={{
                      width: "100%", background: "#f59e0b",
                      color: "white", border: "none", borderRadius: "8px",
                      padding: "10px", fontSize: "13px", fontWeight: "600",
                      cursor: "pointer", marginBottom: "8px"
                    }}
                  >
                    ⭐ Rate Exchange
                  </button>
                )}

                {showRatingForm && (
                  <div style={{ marginBottom: "8px", padding: "12px", background: inputBg, borderRadius: "8px" }}>
                    <div style={{ marginBottom: "8px" }}>
                      <p style={{ fontSize: "12px", color: subtext, marginBottom: "4px" }}>Rating</p>
                      <div style={{ display: "flex", gap: "4px" }}>
                        {[1, 2, 3, 4, 5].map((r) => (
                          <button
                            key={r}
                            onClick={() => setRating(r)}
                            style={{
                              fontSize: "20px", background: "none",
                              border: "none", cursor: "pointer",
                              opacity: rating >= r ? 1 : 0.3
                            }}
                          >
                            ⭐
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      value={ratingComment}
                      onChange={(e) => setRatingComment(e.target.value)}
                      placeholder="Optional review..."
                      style={{
                        width: "100%", padding: "6px", borderRadius: "6px",
                        border: `1px solid ${border}`, color: text,
                        background: cardBg, fontSize: "12px", outline: "none",
                        marginBottom: "8px", minHeight: "50px"
                      }}
                    />
                    <button
                      onClick={submitRating}
                      style={{
                        width: "100%", background: "#16a34a",
                        color: "white", border: "none", borderRadius: "6px",
                        padding: "6px", fontSize: "12px", fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      Submit Rating
                    </button>
                  </div>
                )}

                {/* Message Input */}
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type message..."
                    style={{
                      flex: 1, padding: "8px 12px", borderRadius: "8px",
                      border: `1px solid ${border}`, background: inputBg,
                      color: text, fontSize: "13px", outline: "none"
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading}
                    style={{
                      background: "#16a34a", color: "white",
                      border: "none", borderRadius: "8px",
                      padding: "8px 16px", fontSize: "13px",
                      fontWeight: "600", cursor: "pointer"
                    }}
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <p style={{ color: subtext, fontSize: "14px", textAlign: "center", padding: "40px 20px" }}>
                Select an exchange to view messages
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exchanges;