import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, where, Timestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Megaphone, Calendar } from "lucide-react";
import { subDays, isAfter } from "date-fns";

interface Notification {
  id: string;
  title: string;
  content: string;
  date: any;
  category: string;
}

export function Announcements() {
  const [notices, setNotices] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sevenDaysAgo = subDays(new Date(), 7);
    const q = query(
      collection(db, "notifications"),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allDocs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      
      // Filter for last 7 days on the client side to ensure real-time accuracy with local time
      const filtered = allDocs.filter(doc => {
        const docDate = doc.date?.toDate ? doc.date.toDate() : new Date();
        return isAfter(docDate, sevenDaysAgo);
      });

      setNotices(filtered);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 text-center mb-16 italic uppercase tracking-wider">
          PORTAL ANNOUNCEMENTS
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Urgent Alert Card */}
          <Card className="border-none shadow-2xl bg-white rounded-3xl overflow-hidden border-t-4 border-yellow-400">
            <CardContent className="p-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-600 font-bold text-sm tracking-widest uppercase">URGENT INTERVIEW ALERT</span>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-8 leading-tight italic">
                Mock Interview registration for 2023 batch is open. Apply via the Google Form below.
              </h3>
              
              <a 
                href="https://docs.google.com/forms/d/e/1FAIpQLSf1u0F3sWul3DMovSbgIKsD-18Y__xdN9kfigCyAUhxFXXqeg/viewform" 
                target="_blank" 
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "bg-[#6b46c1] hover:bg-[#553c9a] text-white px-10 py-7 text-lg font-bold rounded-full transition-all shadow-lg inline-flex items-center justify-center"
                )}
              >
                Apply Now 🚀
              </a>
            </CardContent>
          </Card>

          {/* Notice Board Card */}
          <Card className="border-none shadow-2xl bg-[#0a192f] rounded-3xl overflow-hidden">
            <CardContent className="p-10">
              <div className="flex items-center gap-2 mb-8">
                <div className="h-1 w-8 bg-yellow-400"></div>
                <span className="text-yellow-400 font-bold text-sm tracking-widest uppercase">OFFICIAL NOTICE BOARD</span>
              </div>
              
              <div className="space-y-8 min-h-[200px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                  </div>
                ) : notices.length > 0 ? (
                  notices.map((notice, index) => (
                    <div key={notice.id} className="flex gap-4 group">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        {index !== notices.length - 1 && <div className="w-0.5 h-full bg-yellow-400/30 mt-2"></div>}
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-200 font-medium italic leading-relaxed">
                          {notice.title}
                        </p>
                        <p className="text-slate-400 text-xs italic">
                          {notice.content}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <Megaphone className="mx-auto text-slate-600 mb-4" size={32} />
                    <p className="text-slate-400 italic">No new notices in the last 7 days.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Bell({ className }: { className?: string }) {
  return <Megaphone className={className} />;
}
