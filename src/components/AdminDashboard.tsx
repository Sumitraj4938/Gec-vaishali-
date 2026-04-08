import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2, LogOut, Bell, Calendar, Tag, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface Notification {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
}

export function AdminDashboard() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Placement");
  const [isLoading, setIsLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [principalImageUrl, setPrincipalImageUrl] = useState("");
  const [hodImageUrl, setHodImageUrl] = useState("");
  const [tpoImageUrl, setTpoImageUrl] = useState("");
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login");
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/admin/login");
      }
    });

    fetchNotifications();
    fetchSettings();

    // Subscribe to real-time changes
    const channelId = Math.random().toString(36).substring(7);
    const channel = supabase
      .channel(`notifications_changes_${channelId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
        fetchNotifications();
      })
      .subscribe();

    return () => {
      authListener.subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [navigate]);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*');
    
    if (error) {
      console.error("Error fetching settings:", error);
    } else if (data) {
      const settings: Record<string, string> = {};
      data.forEach(s => settings[s.id] = s.value);
      setLogoUrl(settings.logo_url || "");
      setPrincipalImageUrl(settings.principal_image_url || "");
      setHodImageUrl(settings.hod_image_url || "");
      setTpoImageUrl(settings.tpo_image_url || "");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size too large. Please upload an image smaller than 2MB.");
      return;
    }

    setUploadingField(field);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `site-assets/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);

      if (uploadError) {
        if (uploadError.message.includes("bucket not found")) {
          throw new Error("Storage bucket 'assets' not found. Please create a public bucket named 'assets' in your Supabase dashboard.");
        }
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);

      if (field === 'logo') setLogoUrl(publicUrl);
      if (field === 'principal') setPrincipalImageUrl(publicUrl);
      if (field === 'hod') setHodImageUrl(publicUrl);
      if (field === 'tpo') setTpoImageUrl(publicUrl);

    } catch (err: any) {
      console.error("Upload error:", err);
      alert(err.message || "Failed to upload image. Please try again.");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const updates = [
        { id: 'logo_url', value: logoUrl },
        { id: 'principal_image_url', value: principalImageUrl },
        { id: 'hod_image_url', value: hodImageUrl },
        { id: 'tpo_image_url', value: tpoImageUrl }
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .upsert(update);
        if (error) throw error;
      }
      alert("Settings updated successfully!");
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Failed to save settings. Make sure the 'site_settings' table exists in Supabase.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error("Error fetching notifications:", error);
    } else {
      setNotifications(data || []);
    }
  };

  const handleAddNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('notifications')
        .insert([
          {
            title,
            content,
            category,
            date: new Date().toISOString()
          }
        ]);

      if (error) throw error;
      
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Error adding notification:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 p-2 rounded-lg">
              <Bell className="text-slate-900" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="text-white hover:bg-slate-800 gap-2"
          >
            <LogOut size={18} /> Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-6 grid md:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="md:col-span-1">
          <Card className="shadow-xl border-none rounded-3xl overflow-hidden sticky top-24">
            <CardHeader className="bg-slate-100 p-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <PlusCircle className="text-blue-600" size={20} />
                New Notification
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleAddNotification} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500">Title</label>
                  <Input 
                    placeholder="e.g. L&T Recruitment Drive"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500">Category</label>
                  <select 
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white text-sm"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option>Placement</option>
                    <option>Training</option>
                    <option>Internship</option>
                    <option>General</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500">Content</label>
                  <Textarea 
                    placeholder="Details about the notice..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="rounded-xl min-h-[120px]"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 font-bold"
                  disabled={isLoading}
                >
                  {isLoading ? "Posting..." : "Post Notification"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Site Settings Card */}
          <Card className="shadow-xl border-none rounded-3xl overflow-hidden mt-8">
            <CardHeader className="bg-slate-100 p-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <ImageIcon className="text-purple-600" size={20} />
                Site Assets & Photos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* Logo */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase text-slate-500">College Logo</label>
                    {logoUrl && <img src={logoUrl} alt="Preview" className="w-8 h-8 rounded-full border border-slate-200 object-cover" />}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Paste logo URL..."
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      className="rounded-xl flex-1"
                    />
                    <div className="relative">
                      <input 
                        type="file" 
                        id="logo-upload" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'logo')}
                      />
                      <Button 
                        type="button"
                        variant="outline"
                        size="icon"
                        className="rounded-xl"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                        disabled={uploadingField === 'logo'}
                      >
                        {uploadingField === 'logo' ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Principal */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase text-slate-500">Principal Photo</label>
                    {principalImageUrl && <img src={principalImageUrl} alt="Preview" className="w-8 h-8 rounded-full border border-slate-200 object-cover" />}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Paste photo URL..."
                      value={principalImageUrl}
                      onChange={(e) => setPrincipalImageUrl(e.target.value)}
                      className="rounded-xl flex-1"
                    />
                    <div className="relative">
                      <input 
                        type="file" 
                        id="principal-upload" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'principal')}
                      />
                      <Button 
                        type="button"
                        variant="outline"
                        size="icon"
                        className="rounded-xl"
                        onClick={() => document.getElementById('principal-upload')?.click()}
                        disabled={uploadingField === 'principal'}
                      >
                        {uploadingField === 'principal' ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* HOD */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase text-slate-500">HOD Photo</label>
                    {hodImageUrl && <img src={hodImageUrl} alt="Preview" className="w-8 h-8 rounded-full border border-slate-200 object-cover" />}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Paste photo URL..."
                      value={hodImageUrl}
                      onChange={(e) => setHodImageUrl(e.target.value)}
                      className="rounded-xl flex-1"
                    />
                    <div className="relative">
                      <input 
                        type="file" 
                        id="hod-upload" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'hod')}
                      />
                      <Button 
                        type="button"
                        variant="outline"
                        size="icon"
                        className="rounded-xl"
                        onClick={() => document.getElementById('hod-upload')?.click()}
                        disabled={uploadingField === 'hod'}
                      >
                        {uploadingField === 'hod' ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* TPO */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase text-slate-500">TPO Head Photo</label>
                    {tpoImageUrl && <img src={tpoImageUrl} alt="Preview" className="w-8 h-8 rounded-full border border-slate-200 object-cover" />}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Paste photo URL..."
                      value={tpoImageUrl}
                      onChange={(e) => setTpoImageUrl(e.target.value)}
                      className="rounded-xl flex-1"
                    />
                    <div className="relative">
                      <input 
                        type="file" 
                        id="tpo-upload" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'tpo')}
                      />
                      <Button 
                        type="button"
                        variant="outline"
                        size="icon"
                        className="rounded-xl"
                        onClick={() => document.getElementById('tpo-upload')?.click()}
                        disabled={uploadingField === 'tpo'}
                      >
                        {uploadingField === 'tpo' ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                      </Button>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-6 font-bold"
                  disabled={isSavingSettings}
                >
                  {isSavingSettings ? "Saving..." : "Update All Assets"}
                </Button>
                <p className="text-[10px] text-slate-400 italic text-center">
                  Tip: You can paste a URL or click the upload icon to select an image from your device.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* List Section */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Recent Notifications</h2>
            <span className="text-sm text-slate-500 bg-slate-200 px-3 py-1 rounded-full font-medium">
              {notifications.length} Total
            </span>
          </div>

          <div className="space-y-4">
            {notifications.map((notif) => (
              <Card key={notif.id} className="shadow-md border-none rounded-2xl overflow-hidden group">
                <CardContent className="p-6 flex justify-between items-start gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="bg-blue-100 text-blue-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1">
                        <Tag size={10} /> {notif.category}
                      </span>
                      <span className="text-slate-400 text-xs flex items-center gap-1">
                        <Calendar size={12} /> 
                        {notif.date?.toDate ? format(notif.date.toDate(), "MMM dd, yyyy") : "Just now"}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{notif.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{notif.content}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(notif.id)}
                    className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 size={18} />
                  </Button>
                </CardContent>
              </Card>
            ))}

            {notifications.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <Bell className="mx-auto text-slate-300 mb-4" size={48} />
                <p className="text-slate-500 font-medium">No notifications posted yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
