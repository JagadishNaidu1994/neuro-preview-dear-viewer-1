import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ProductPage = () => {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop"
              alt="Product"
              className="w-full rounded-lg"
            />
            <div className="flex space-x-2 mt-2">
              <img
                src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=100&h=100&fit=crop"
                alt="Product"
                className="w-20 h-20 rounded-lg border-2 border-primary"
              />
              <img
                src="https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=100&h=100&fit=crop"
                alt="Product"
                className="w-20 h-20 rounded-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop"
                alt="Product"
                className="w-20 h-20 rounded-lg"
              />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary">Focus</h1>
            <p className="text-2xl font-bold mt-2 text-accent-foreground">
              $32
            </p>
            <div className="flex space-x-2 mt-4">
              <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm">
                Sugar-Free
              </span>
              <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm">
                Vegan
              </span>
              <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm">
                Non-GMO
              </span>
            </div>
            <p className="mt-4 text-muted-foreground">
              Dual-layer gummies made to feel faster, better. Designed by
              neuroscientists to support crystal-clear thinking, sharp
              concentration and boosted energy. NOON Focus Gummies combine core
              daily vitamins and key adaptogenic mushrooms to support your mind
              feeling boosted, longer. No jitters, cliffs or dependences.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Brainpower unlocked in a 2-in-1 gummy made for both energy and
              focus. Clean, Energized Productivity · 60 pieces · Orange-Peach
              Flavor
            </p>
            <div className="mt-4">
              <p className="font-bold">Quantity</p>
              <div className="flex space-x-2 mt-2">
                <Button>Single • $32</Button>
                <Button variant="outline">Double • $60</Button>
                <Button variant="outline">Triple • $85</Button>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="subscribe" name="subscribe" />
                <label htmlFor="subscribe">Subscribe and Save 10%</label>
              </div>
            </div>
            <div className="mt-4">
              <Button className="w-full">Add to Bag</Button>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold text-primary">
            Made to be a healthy and powerful mushroom gummy for daily ritual.
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            For those who take their wellbeing with intention-- we did the hard
            part so you can enjoy living. Sustainably sourced ingredients that
            work quickly without the harmful additives. We’re powering an
            all-natural movement.
          </p>
        </div>
        <div className="mt-8">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-primary">
                Best For
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Instant clarity to focus on important tasks</li>
                  <li>Clearing brain fog and scattered thoughts</li>
                  <li>Getting into the flow zone</li>
                  <li>Elevating energy and reducing stress</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-primary">
                What’s Inside
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Proprietary Focus Mushroom SuperBlend containing Green Tea
                Extract (leaf, 10:1), Lion’s Mane Mushroom Extract (fruiting
                body, 10:1), Cordyceps Mushroom Extract (fruiting body, 10:1),
                Rhodiola Extract (root, 10:1), Goji Berry Extract (fruit,
                10:1), L-theanine, Vitamin B6 (Pyridoxine), Vitamin B9 (Folate),
                Vitamin B12 (Methylcobalamin), and Vitamin D3 (Cholecalciferol).
                Other ingredients: Water, Maltitol, Non-GMO Maltodextrin, Stevia
                (Steviol glycosides) Leaf Extract, Pectin, L-Malic Acid, Sodium
                Citrate, Natural Fruit Flavor, Natural Food Color, Carnauba
                Wax.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-primary">
                How to Take
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Take 2-4 gummies daily. Chew these gummies well to access the
                bioactives & full potential effect. Best after food. For a
                boosted effect, take 2 more gummies after 45 minutes. Can be
                combined with NOON Chill Gummies for a calm but focused
                experience.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-center text-primary">
            An innovative dual layered gummy that works better, faster- with
            total benefits better than anything else on shelf
          </h2>
          <div className="mt-4 grid grid-cols-4 gap-4 text-center text-muted-foreground">
            <div></div>
            <div className="font-bold text-foreground">NOON</div>
            <div className="font-bold text-foreground">Other Gummies</div>
            <div className="font-bold text-foreground">Rx Stimulants</div>

            <div>Immediate clean energy, no cliffs</div>
            <div className="text-primary">✓</div>
            <div></div>
            <div></div>

            <div>Increased steady focus for 2-3 hours</div>
            <div className="text-primary">✓</div>
            <div></div>
            <div></div>

            <div>Sugar-Free</div>
            <div className="text-primary">✓</div>
            <div></div>
            <div className="text-primary">✓</div>

            <div>Natural flavors & colors, no additives</div>
            <div className="text-primary">✓</div>
            <div></div>
            <div></div>

            <div>Vegan, plant-based</div>
            <div className="text-primary">✓</div>
            <div></div>
            <div></div>

            <div>Made by neuroscience and clinical team</div>
            <div className="text-primary">✓</div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-center text-primary">
            Customer Reviews
          </h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border p-4 rounded-lg bg-card text-card-foreground">
              <p>
                I felt more focus I think noticeably within an hour of taking
                them and I also felt more awake. I wasn’t hyper focused as if I
                was taking adhd meds or another drug but it was just a nice
                boost.
              </p>
              <p className="font-bold mt-2">- Sophie H., New York</p>
            </div>
            <div className="border p-4 rounded-lg bg-card text-card-foreground">
              <p>
                Loved how clear-headed the focus gummies made me feel. The first
                time I took it, I felt great. I would lock into my work for
                about 3 hours straight...clear mind, less brain fog, less
                mental chatter.
              </p>
              <p className="font-bold mt-2">- Mimosa T., California</p>
            </div>
            <div className="border p-4 rounded-lg bg-card text-card-foreground">
              <p>
                They definitely made my morning tasks and routines more
                enjoyable, and made me feel more present in the moment instead
                of doing tasks on autopilot mode. I also noticed better
                creative performance in the morning, which usually happens
                later in the afternoon.
              </p>
              <p className="font-bold mt-2">- Marco M., Nashville</p>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold text-primary">
            Delights backed by neuroscience and clinically researched
            ingredients for proven results
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Each gummy has 8+ natural ingredients carefully selected using
            clinical research. No additives, no sugar. We’re harnessing the
            best of plant technology that works together to help your mind &
            body adapt to life’s stress while helping you access mental
            clarity, higher cognition and better mood.
          </p>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-center text-primary">FAQS</h2>
          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-primary">
                How do NOON FOCUS gummy delights work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                They support boosting focus and clarity with our Proprietary
                Focus Mushroom SuperBlend with vitamins and nootropics. This
                powerful combo is backed by research to boost alertness and
                cognitive function, so you can think clearer and stay on top of
                your game.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-primary">
                How do NOON gummy delights provide energy without added
                caffeine?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Our energy-boosting ingredients–like B Vitamins, Green Tea
                Extract, Cordyceps, Rhodiola, and Goji Berry–offer steady focus
                without the jitters. NOON gummies have no added caffeine
                because while caffeine gives you a quick boost, it often comes
                with crashes and anxiety. We’re all about long-lasting,
                feel-good energy!
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-primary">
                How quickly will I start feeling the benefits? How long do they
                last?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Effects kick in within 30 minutes and last for 3-4 hours.
                Short-term benefits last 3-4 hours; long-term improvements in
                mood and mental clarity may appear after 3+ weeks of daily
                use.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-primary">
                Can I take them daily? How many can I take?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                NOON Mushroom Gummy Delights are designed to be taken every
                day. You can take them multiple times across the day if you
                feel the need. We recommend 2-4 gummies a day, preferably after
                food.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-primary">
                Can I take them with other supplements?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! Although they are designed to work on their own, all of
                our gummies are generally safe to be taken alongside your
                regular supplement regimen, and should enhance the function of
                most other supplements. If ever in doubt, consult your
                healthcare provider for further information.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-center">Goes well with</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <img
                src="https://cdn.shopify.com/s/files/1/0671/5382/1848/files/Chill_Bottle_Gummy.png?v=1729683993&width=100&height=125&crop=center"
                alt="Chill Mushroom Gummy"
                className="mx-auto"
              />
              <p className="font-bold mt-2">Chill Mushroom Gummy Delights</p>
              <p>$32</p>
              <p>For Happy Calm & Less Stress</p>
            </div>
            <div className="text-center">
              <img
                src="https://cdn.shopify.com/s/files/1/0671/5382/1848/files/Sleep_Bottle_Gummy.png?v=1729683996&width=100&height=125&crop=center"
                alt="Sleep Mushroom Gummy"
                className="mx-auto"
              />
              <p className="font-bold mt-2">Sleep Mushroom Gummy Delights</p>
              <p>$32</p>
              <p>For Deep & Rejuvenating ZZs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;