
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const SampleJournalContent = () => {
  useEffect(() => {
    const addSampleJournals = async () => {
      try {
        // Check if journals already exist
        const { data: existingJournals } = await supabase
          .from("journals")
          .select("id")
          .limit(1);

        if (existingJournals && existingJournals.length > 0) {
          return; // Journals already exist
        }

        const sampleJournals = [
          {
            title: "The Science Behind Nootropics: Unlocking Cognitive Potential",
            excerpt: "Explore the fascinating world of nootropics and how they can enhance brain function, memory, and focus through targeted nutritional support.",
            content: `In recent years, the field of cognitive enhancement has gained significant attention, particularly through the study of nootropics—substances that can improve cognitive function. These "smart drugs" or brain boosters work by supporting various neurological pathways that affect memory, focus, creativity, and overall brain health.

The term "nootropic" was coined by Romanian psychologist and chemist Corneliu E. Giurgea in 1972. He defined true nootropics as substances that enhance learning and memory, protect the brain against injury, and have minimal side effects. Modern research has expanded our understanding of how certain compounds can support brain health through multiple mechanisms.

Key mechanisms of action include:

1. **Neurotransmitter Support**: Many nootropics work by supporting the production or function of key neurotransmitters like acetylcholine, dopamine, and serotonin. These chemical messengers are crucial for memory formation, mood regulation, and cognitive processing.

2. **Neuroprotection**: Some compounds provide antioxidant effects that protect brain cells from oxidative stress and inflammation, which are major contributors to cognitive decline.

3. **Blood Flow Enhancement**: Improved cerebral circulation ensures that brain tissue receives adequate oxygen and nutrients, supporting optimal cognitive function.

4. **Neuroplasticity Support**: Certain nootropics can enhance the brain's ability to form new neural connections, supporting learning and adaptation.

Popular natural nootropics include:
- Lion's Mane mushroom for nerve growth factor support
- Bacopa Monnieri for memory enhancement
- Rhodiola Rosea for stress adaptation
- Ginkgo Biloba for circulation support

The future of cognitive enhancement lies in understanding these natural compounds and their synergistic effects. As research continues, we're discovering new ways to support brain health through targeted nutrition and lifestyle interventions.`,
            author: "Dr. Sarah Chen, Neuroscientist",
            image_url: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            published: true
          },
          {
            title: "Mushroom Medicine: How Functional Fungi Support Brain Health",
            excerpt: "Discover the ancient wisdom and modern science behind medicinal mushrooms and their powerful effects on cognitive function and neurological health.",
            content: `For thousands of years, traditional medicine systems have recognized the powerful healing properties of medicinal mushrooms. Today, modern science is validating what ancient practitioners have long known—certain fungi possess remarkable compounds that can support brain health and cognitive function.

The world of functional mushrooms offers a diverse array of species, each with unique bioactive compounds that support different aspects of neurological health:

**Lion's Mane (Hericium erinaceus)**
Perhaps the most celebrated mushroom for brain health, Lion's Mane contains unique compounds called hericenones and erinacines. These compounds can cross the blood-brain barrier and stimulate the production of nerve growth factor (NGF), a protein essential for neuron growth, maintenance, and survival. Studies suggest Lion's Mane may support memory, focus, and potentially slow age-related cognitive decline.

**Reishi (Ganoderma lucidum)**
Known as the "mushroom of immortality" in traditional Chinese medicine, Reishi supports the nervous system through its adaptogenic properties. It helps regulate stress hormones and supports healthy sleep patterns, both crucial for optimal brain function. Reishi's triterpenes and ganoderic acids contribute to its neuroprotective effects.

**Cordyceps (Cordyceps sinensis)**
This unique fungus supports brain health by enhancing cellular energy production. Cordyceps increases ATP synthesis, providing the brain with the energy it needs for optimal function. It also supports healthy blood flow and oxygen utilization, crucial for cognitive performance.

**Chaga (Inonotus obliquus)**
Rich in antioxidants, Chaga provides powerful neuroprotective effects. Its high concentration of melanin and betulinic acid helps protect brain cells from oxidative stress and inflammation, key factors in cognitive aging.

The synergistic effects of combining multiple mushroom species can provide comprehensive brain support. Modern extraction techniques allow us to concentrate these beneficial compounds while maintaining their bioavailability.

As we continue to understand the complex relationships between nutrition and brain health, medicinal mushrooms represent a promising avenue for supporting cognitive function naturally and sustainably.`,
            author: "Dr. Michael Torres, Mycologist",
            image_url: "https://images.unsplash.com/photo-1518389876769-58b0b3f82d54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            published: true
          },
          {
            title: "The Gut-Brain Connection: How Digestive Health Impacts Cognitive Function",
            excerpt: "Uncover the fascinating relationship between gut health and brain function, and learn how supporting your microbiome can enhance mental clarity and mood.",
            content: `The human body's most fascinating highway isn't found in our circulatory or nervous systems—it's the bidirectional communication pathway between our gut and brain, known as the gut-brain axis. This complex network involves the central nervous system, enteric nervous system, and the trillions of microorganisms that make up our gut microbiome.

**Understanding the Gut-Brain Axis**

The gut-brain connection operates through multiple pathways:

1. **The Vagus Nerve**: This major neural pathway directly connects the brain and gut, allowing for rapid communication between the two systems.

2. **Neurotransmitter Production**: Surprisingly, about 95% of serotonin—our "happiness hormone"—is produced in the gut. The gut microbiome plays a crucial role in neurotransmitter synthesis.

3. **Immune System Modulation**: The gut houses approximately 70% of our immune system. Inflammation in the gut can trigger systemic inflammation that affects brain function.

4. **Short-Chain Fatty Acids**: Beneficial gut bacteria produce these compounds, which can cross the blood-brain barrier and support neurological health.

**The Microbiome's Role in Cognitive Health**

Research has revealed that specific bacterial strains can influence mood, memory, and cognitive function:

- **Lactobacillus helveticus** and **Bifidobacterium longum** have shown promise in reducing anxiety and depression symptoms
- **Akkermansia muciniphila** supports the intestinal barrier and may protect against neuroinflammation
- **Faecalibacterium prausnitzii** produces butyrate, a short-chain fatty acid that supports brain health

**Supporting the Gut-Brain Connection**

Practical strategies for optimizing this crucial connection include:

1. **Diverse Fiber Intake**: Feed beneficial bacteria with prebiotic fibers from vegetables, fruits, and whole grains
2. **Fermented Foods**: Include yogurt, kefir, sauerkraut, and kimchi to introduce beneficial probiotics
3. **Stress Management**: Chronic stress disrupts gut health through the hypothalamic-pituitary-adrenal axis
4. **Quality Sleep**: Poor sleep negatively impacts gut microbiome diversity
5. **Targeted Supplementation**: Specific probiotic strains and digestive enzymes can support gut health

The emerging field of psychobiotics—probiotics that influence mood and cognition—represents an exciting frontier in mental health and cognitive enhancement. As we continue to understand this intricate relationship, supporting gut health becomes increasingly important for optimal brain function.`,
            author: "Dr. Lisa Rodriguez, Gastroenterologist",
            image_url: "https://images.unsplash.com/photo-1628859788995-adc36d1ced8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            published: true
          }
        ];

        for (const journal of sampleJournals) {
          await supabase.from("journals").insert([journal]);
        }

        console.log("Sample journals added successfully");
      } catch (error) {
        console.error("Error adding sample journals:", error);
      }
    };

    addSampleJournals();
  }, []);

  return null; // This component doesn't render anything
};

export default SampleJournalContent;
