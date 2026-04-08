import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AICareerAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI Career Assistant for Civil Engineering. How can I help you today with job openings, internships, or interview prep?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...messages.map(m => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }]
          })),
          { role: "user", parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: "You are a career assistant specialized in civil engineering students in India. Provide job openings, internships, resume advice, and interview preparation guidance. Be professional, encouraging, and specific to the Indian context (PSUs, private firms like L&T, Tata Projects, etc.).",
        }
      });

      const assistantMessage = response.text || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: "assistant", content: assistantMessage }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4"
          >
            <Card className="w-[350px] md:w-[400px] h-[500px] shadow-2xl border-slate-200 flex flex-col overflow-hidden">
              <CardHeader className="bg-slate-900 text-white p-4 flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="text-yellow-400" size={20} />
                  AI Career Assistant
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-slate-800"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={20} />
                </Button>
              </CardHeader>
              
              <CardContent className="flex-1 p-0 bg-slate-50 overflow-hidden">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                            msg.role === "user"
                              ? "bg-blue-600 text-white rounded-tr-none"
                              : "bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {msg.role === "assistant" ? <Bot size={14} /> : <User size={14} />}
                            <span className="text-[10px] font-bold uppercase opacity-70">
                              {msg.role === "assistant" ? "AI Assistant" : "You"}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 rounded-tl-none">
                          <Loader2 className="animate-spin text-slate-400" size={20} />
                        </div>
                      </div>
                    )}
                    <div ref={scrollRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              <CardFooter className="p-4 bg-white border-t border-slate-100">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex w-full gap-2"
                >
                  <Input
                    placeholder="Ask about jobs, prep..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-slate-50 border-slate-200 focus-visible:ring-slate-900"
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={isLoading || !input.trim()}
                    className="bg-slate-900 hover:bg-blue-900"
                  >
                    <Send size={18} />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        className={`rounded-full w-16 h-16 shadow-2xl transition-all duration-300 ${
          isOpen ? "bg-red-500 hover:bg-red-600 rotate-90" : "bg-slate-900 hover:bg-blue-900"
        }`}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </Button>
    </div>
  );
}
