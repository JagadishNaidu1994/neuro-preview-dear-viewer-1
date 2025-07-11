
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const SampleJournalContent = () => {
  useEffect(() => {
    const createSampleJournals = async () => {
      try {
        // Check if journals already exist
        const { data: existingJournals } = await supabase
          .from("journals")
          .select("id")
          .limit(1);

        if (existingJournals && existingJournals.length > 0) {
          console.log("Sample journals already exist");
          return;
        }

        // Only create sample journal content, NO ORDERS
        const sampleJournals = [
          {
            title: "The Science Behind Functional Mushrooms",
            content: "Discover the incredible benefits of Lion's Mane, Reishi, and Cordyceps mushrooms...",
            excerpt: "Explore how functional mushrooms can enhance your cognitive performance and overall well-being.",
            author: "Dr. Sarah Chen",
            published: true,
            image_url: "https://images.pexels.com/photos/6207734/pexels-photo-6207734.jpeg"
          },
          {
            title: "Building Better Sleep Habits",
            content: "Quality sleep is the foundation of optimal health and cognitive performance...",
            excerpt: "Learn practical strategies to improve your sleep quality and wake up refreshed.",
            author: "DearNeuro Team",
            published: true,
            image_url: "https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg"
          }
        ];

        const { error } = await supabase
          .from("journals")
          .insert(sampleJournals);

        if (error) {
          console.error("Error creating sample journals:", error);
        } else {
          console.log("Sample journals created successfully");
        }
      } catch (error) {
        console.error("Error in createSampleJournals:", error);
      }
    };

    createSampleJournals();
  }, []);

  return null;
};

export default SampleJournalContent;
