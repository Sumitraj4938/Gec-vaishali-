import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, Megaphone, Calendar, ArrowRight } from "lucide-react";
import { subDays, isAfter, parseISO } from "date-fns";

interface Notification {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
}

export function Announcements() {
  const [notices, setNotices] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      const sevenDaysAgo = subDays(new Date(), 7);
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error("Error fetching notices:", error);
      } else {
        // Filter for last 7 days on the client side
        const filtered = (data || []).filter((doc: Notification) => {
          const docDate = parseISO(doc.date);
          return isAfter(docDate, sevenDaysAgo);
        });
        setNotices(filtered);
      }
      setIsLoading(false);
    };

    fetchNotices();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('announcements_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
        fetchNotices();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
                    <div key={notice.id} className="flex gap-4 group hover:translate-x-1 transition-transform">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
                        {index !== notices.length - 1 && <div className="w-0.5 h-full bg-yellow-400/20 mt-2"></div>}
                      </div>
                      <div className="space-y-1 pb-6">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-yellow-400 uppercase tracking-tighter bg-yellow-400/10 px-2 py-0.5 rounded">
                            {notice.category}
                          </span>
                        </div>
                        <p className="text-slate-100 font-bold italic leading-tight">
                          {notice.title}
                        </p>
                        <p className="text-slate-400 text-xs italic line-clamp-2">
                          {notice.content}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <Bell className="mx-auto text-slate-700 mb-4 opacity-50" size={48} />
                    <p className="text-slate-500 italic font-medium">No new notices in the last 7 days.</p>
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
