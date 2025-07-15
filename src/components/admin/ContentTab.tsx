
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface PageContent {
  id: string;
  page_key: string;
  content: { [key: string]: string };
}

const ContentTab = () => {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [selectedPage, setSelectedPage] = useState<PageContent | null>(null);
  const [content, setContent] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase.from("pages").select("*");
      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error("Error fetching pages:", error);
    }
  };

  const handleSelectPage = (pageKey: string) => {
    const page = pages.find((p) => p.page_key === pageKey);
    if (page) {
      setSelectedPage(page);
      setContent(page.content || {});
    }
  };

  const handleContentChange = (field: string, value: string) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!selectedPage) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("pages")
        .update({ content })
        .eq("id", selectedPage.id);
      if (error) throw error;
      toast({ title: "Success", description: "Content saved." });
      await fetchPages();
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "Error",
        description: "Failed to save content.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Content Management</h2>
      <div className="flex space-x-4 mb-4">
        {pages.map((page) => (
          <Button
            key={page.id}
            variant={selectedPage?.id === page.id ? "default" : "outline"}
            onClick={() => handleSelectPage(page.page_key)}
          >
            {page.page_key}
          </Button>
        ))}
      </div>
      {selectedPage && (
        <div className="space-y-4">
          {Object.entries(content).map(([key, value]) => (
            <div key={key}>
              <Label htmlFor={key}>{key}</Label>
              <Textarea
                id={key}
                value={value}
                onChange={(e) => handleContentChange(key, e.target.value)}
                rows={5}
              />
            </div>
          ))}
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Content"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContentTab;
