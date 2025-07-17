"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
import { Star, Clock, StarIcon, Brain, Zap, Leaf } from "lucide-react"

export default function Component() {
  const [mainImage, setMainImage] = useState("/images/main-gummy.png")

  const productImages = [
    { src: "/images/thumb-gummy-stick.png", alt: "Gummy on a stick" },
    { src: "/images/thumb-yellow-cells.png", alt: "Yellow cells" },
    { src: "/images/thumb-gummy-jar.png", alt: "Gummy jar" },
    { src: "/images/thumb-woman-gummies.png", alt: "Woman holding gummies" },
  ]

  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#333333]">
      {/* Header */}
      <header className="flex items-center justify-center py-4 text-sm font-medium">
        
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
          ))}
        </div>
      </header>

      {/* Product Hero Section */}
      <section className="container mx-auto grid md:grid-cols-2 gap-8 py-12 px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center bg-[#3F4A5C] rounded-lg p-8">
          <Image
            src={mainImage || "/placeholder.svg"}
            alt="Focus Gummy"
            width={500}
            height={500}
            className="object-contain rounded-lg"
          />
          <div className="flex gap-4 mt-6">
            {productImages.map((img, index) => (
              <button key={index} onClick={() => setMainImage(img.src)} className="focus:outline-none">
                <Image
                  src={img.src || "/placeholder.svg"}
                  alt={img.alt}
                  width={80}
                  height={80}
                  className={`object-cover rounded-lg border-2 ${mainImage === img.src ? "border-white" : "border-transparent"}`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6 p-4">
          <h1 className="text-4xl font-bold">FOCUS</h1>
          <div className="flex gap-2">
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-[#B5B090] text-white">VEGETARIAN</span>
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-[#B5B090] text-white">VEGAN</span>
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-[#B5B090] text-white">NON-GMO</span>
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-[#B5B090] text-white">GLUTEN FREE</span>
          </div>
          <div className="text-3xl font-semibold">$32</div>
          <p className="text-base leading-relaxed">
            Dual-layer gummies made to feel better, better. Designed by neuroscience and backed by clinical research,
            these gummies combine natural nootropics and botanicals to support focus, clarity, and calm. The outer layer
            is a fast-acting energy booster, while the inner layer provides sustained focus and calm.
          </p>
          <p className="text-sm font-medium">
            OUTER LAYER INCLUDES CAFFEINE & L-THEANINE, INNER LAYER INCLUDES BACOPA, GINKGO, AND PANAX GINSENG.
          </p>

          <div>
            <h3 className="mb-2 text-lg font-semibold">Quantity</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="px-6 py-2 rounded-full border-[#B5B090] text-[#B5B090] hover:bg-[#B5B090] hover:text-white bg-transparent"
              >
                Single - 30
              </Button>
              <Button
                variant="outline"
                className="px-6 py-2 rounded-full border-[#B5B090] text-[#B5B090] hover:bg-[#B5B090] hover:text-white bg-transparent"
              >
                Double - 60
              </Button>
              <Button
                variant="outline"
                className="px-6 py-2 rounded-full border-[#B5B090] text-[#B5B090] hover:bg-[#B5B090] hover:text-white bg-transparent"
              >
                Triple - 90
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="subscribe"
              className="border-[#B5B090] data-[state=checked]:bg-[#B5B090] data-[state=checked]:text-white"
            />
            <label
              htmlFor="subscribe"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Subscribe and save 10%
            </label>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b border-gray-300">
              <AccordionTrigger className="text-base font-medium">Delivery and Returns</AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                <p>Free shipping on all orders over $50. Returns accepted within 30 days of purchase.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button className="w-full py-6 text-lg font-semibold text-white rounded-full bg-[#333333] hover:bg-[#555555]">
            Add to Bag
          </Button>
          <div className="text-right text-lg font-semibold">$32.00</div>
        </div>
      </section>

      {/* Introductory Text */}
      <section className="container mx-auto py-12 px-4 md:px-6 lg:px-8 text-center max-w-3xl">
        <p className="text-lg leading-relaxed">
          Made to be a dual-layered functional gummy to help you feel. For those who take their supplements seriously,
          these gummies combine natural nootropics and botanicals to support focus, clarity, and calm.
        </p>
      </section>

      {/* Image Grid */}
      <section className="container mx-auto grid md:grid-cols-3 gap-8 py-12 px-4 md:px-6 lg:px-8">
        <Image
          src="/images/grid-gummy-jar.png"
          alt="Gummy jar with falling gummies"
          width={400}
          height={400}
          className="object-cover w-full h-full rounded-lg"
        />
        <Image
          src="/images/grid-yellow-cells.png"
          alt="Close up of yellow cells"
          width={400}
          height={400}
          className="object-cover w-full h-full rounded-lg"
        />
        <Image
          src="/images/grid-woman-holding.png"
          alt="Woman holding gummies"
          width={400}
          height={400}
          className="object-cover w-full h-full rounded-lg"
        />
      </section>

      {/* Key Benefits Section */}
      <section className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              93% Experienced increased focus and productivity within the first 45 minutes of taking 2 gummies*
            </h2>
            <p className="text-sm text-gray-600 mb-8">*Based on an independent blinded study of 25 people</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-center mb-8">
              <div className="flex flex-col items-center gap-2">
                <Clock className="w-8 h-8 text-[#B5B090]" />
                <p className="text-sm">Fast-acting energy and focus in 20-40 minutes, lasting up to 6 hours</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <StarIcon className="w-8 h-8 text-[#B5B090]" />
                <p className="text-sm">Clinically studied ingredients for cognitive performance</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Brain className="w-8 h-8 text-[#B5B090]" />
                <p className="text-sm">Dual-layered gummies with fast and sustained release</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Zap className="w-8 h-8 text-[#B5B090]" />
                <p className="text-sm">Balanced energy without jitters or crash</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Leaf className="w-8 h-8 text-[#B5B090]" />
                <p className="text-sm">Natural flavors and colors, vegan and gluten-free</p>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="best-for" className="border-b border-gray-300">
                <AccordionTrigger className="text-base font-medium">Best For</AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600">
                  <ul className="list-disc pl-5">
                    <li>Students and professionals seeking enhanced focus.</li>
                    <li>Individuals looking for sustained energy without the jitters.</li>
                    <li>Anyone wanting to improve cognitive clarity and calm.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="whats-inside" className="border-b border-gray-300">
                <AccordionTrigger className="text-base font-medium">What&apos;s Inside</AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600">
                  <ul className="list-disc pl-5">
                    <li>Caffeine & L-Theanine for fast-acting energy.</li>
                    <li>Bacopa, Ginkgo, and Panax Ginseng for sustained focus.</li>
                    <li>Natural flavors and colors.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="how-to-take" className="border-b border-gray-300">
                <AccordionTrigger className="text-base font-medium">How to Take</AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600">
                  <p>Take 2 gummies daily, or as directed by your healthcare professional.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-center text-lg leading-relaxed mb-8">
              An innovative dual layered gummy that works better, faster – with total benefits better than anything else
              on shelf
            </p>
            <div className="grid md:grid-cols-2 gap-4 w-full">
              <Card className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Outer Protective Layer</h3>
                <ul className="space-y-2 text-sm">
                  <li>Fast-acting caffeine + L-theanine</li>
                  <li>Immediate energy, no jitters</li>
                  <li>Increased steady focus for 2-3 hours</li>
                </ul>
              </Card>
              <Card className="p-6 bg-[#B5B090] text-white rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">NOON</h3>
                <ul className="space-y-2 text-sm">
                  <li>&#10003; Immediate energy, no jitters</li>
                  <li>&#10003; Increased steady focus for 2-3 hours</li>
                  <li>&#10003; Sugar-free</li>
                  <li>&#10003; Natural flavors & colors, no additives</li>
                  <li>&#10003; Vegan/plant-based</li>
                  <li>&#10003; Made by neuroscience and clinical team</li>
                  <li>&#10003; Affordable</li>
                </ul>
                <Button variant="ghost" className="mt-4 w-full bg-white text-[#B5B090] hover:bg-gray-100">
                  Better
                </Button>
              </Card>
              <Card className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 md:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Other Gummies</h3>
                <ul className="grid grid-cols-2 gap-y-2 text-sm">
                  <li>&#10006; Immediate energy, no jitters</li>
                  <li>&#10006; Increased steady focus for 2-3 hours</li>
                  <li>&#10006; Sugar-free</li>
                  <li>&#10006; Natural flavors & colors, no additives</li>
                  <li>&#10006; Vegan/plant-based</li>
                  <li>&#10006; Made by neuroscience and clinical team</li>
                  <li>&#10006; Affordable</li>
                </ul>
                <Button variant="ghost" className="mt-4 w-full border border-gray-300 text-gray-600 hover:bg-gray-100">
                  Worse
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto grid md:grid-cols-3 gap-8 py-12 px-4 md:px-6 lg:px-8">
        <Card className="p-6 bg-[#7A6F7A] text-white rounded-lg shadow-sm">
          <p className="italic mb-4">
            &quot;If I&apos;m more focused I think noticeably within an hour of taking them and I didn&apos;t have any
            crash. I also don&apos;t hyper focus so it was just taking and made me a calmer drug but with just a little
            boost.&quot;
          </p>
          <p className="font-semibold">- Ryan M., New York</p>
        </Card>
        <Card className="p-6 bg-[#8B7B6B] text-white rounded-lg shadow-sm">
          <p className="italic mb-4">
            &quot;Loved how clear-headed the focus gummies made me feel. The &apos;outer layer&apos; which I felt gave
            me would kick in my workflow about 1 hour straight. Clear mind, less brain fog, less mental chatter.&quot;
          </p>
          <p className="font-semibold">- Ben M., California</p>
        </Card>
        <Card className="p-6 bg-[#7A6F7A] text-white rounded-lg shadow-sm">
          <p className="italic mb-4">
            &quot;They definitely made my morning tasks and routines more enjoyable, and morning focus was great. In the
            morning I noticed a direct benefit on my attention mode, I also noticed better creative participation in the
            morning, which usually happens later in the afternoon.&quot;
          </p>
          <p className="font-semibold">- Marcus V., New York</p>
        </Card>
      </section>

      {/* Ingredients Section */}
      <section className="container mx-auto py-12 px-4 md:px-6 lg:px-8 text-center">
        <p className="text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
          Delights backed by neuroscience and clinically researched ingredients for proven results
        </p>
        <p className="text-base leading-relaxed mb-12 max-w-4xl mx-auto">
          Each gummy is built with natural ingredients carefully selected using clinical research. No additives, no
          sugar. While harnessing the best of plant technology, these work together to keep you mentally & fully alert,
          while also stabilizing your nervous mental clarity, higher cognition, and better mood.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          <Card className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold mb-2">Lion&apos;s Mane Mushroom</h3>
            <p className="text-sm text-gray-600">
              Supports brain function, focus, memory, response time and cognitive health.
            </p>
          </Card>
          <Card className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold mb-2">Cordyceps Mushroom</h3>
            <p className="text-sm text-gray-600">A natural adaptogen that supports energy, focus, and endurance.</p>
          </Card>
          <Card className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold mb-2">Green Tea Leaf</h3>
            <p className="text-sm text-gray-600">
              An antioxidant-rich leaf with caffeine and L-theanine to support attention & calm.
            </p>
          </Card>
          <Card className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold mb-2">L-Theanine</h3>
            <p className="text-sm text-gray-600">
              A natural amino acid that supports relaxation and focus without drowsiness.
            </p>
          </Card>
          <Card className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold mb-2">Goji Berry</h3>
            <p className="text-sm text-gray-600">
              A nutrient-rich berry with antioxidants that supports focus and brain health.
            </p>
          </Card>
          <Card className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold mb-2">Rhodiola</h3>
            <p className="text-sm text-gray-600">
              An adaptogen that helps reduce stress and improve mental performance.
            </p>
          </Card>
        </div>

        <Button
          variant="outline"
          className="px-8 py-3 rounded-full border-[#B5B090] text-[#B5B090] hover:bg-[#B5B090] hover:text-white bg-transparent"
        >
          Explore the Science
        </Button>
      </section>

      {/* FAQs Section */}
      <section className="container mx-auto py-12 px-4 md:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-6">FAQs</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="faq-1" className="border-b border-gray-300">
              <AccordionTrigger className="text-base font-medium text-left">
                How do NOON FOCUS gummy delights work?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                NOON FOCUS gummies are dual-layered. The outer layer provides fast-acting energy with caffeine and
                L-theanine, while the inner layer offers sustained focus and calm from ingredients like Bacopa, Ginkgo,
                and Panax Ginseng.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-2" className="border-b border-gray-300">
              <AccordionTrigger className="text-base font-medium text-left">
                How do NOON gummy delights provide energy without added caffeine?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Some NOON gummy delights are formulated with natural adaptogens and botanicals that support energy
                production and mental clarity without relying on caffeine. Please check the specific product details for
                ingredient information.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-3" className="border-b border-gray-300">
              <AccordionTrigger className="text-base font-medium text-left">
                How quickly will I start feeling the benefits? How long do they last?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Many users report feeling the fast-acting benefits within 20-40 minutes, with sustained effects lasting
                up to 6 hours, depending on individual metabolism and dosage.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-4" className="border-b border-gray-300">
              <AccordionTrigger className="text-base font-medium text-left">
                Can I take them daily? How many can I take?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Yes, NOON FOCUS gummies are designed for daily use. We recommend taking 2 gummies per day, or as advised
                by your healthcare professional. Do not exceed the recommended dosage.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-5" className="border-b border-gray-300">
              <AccordionTrigger className="text-base font-medium text-left">
                Can I take them with other supplements?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                While NOON FOCUS gummies are generally safe to combine with most supplements, we recommend consulting
                with your doctor or a healthcare professional if you are taking other medications or supplements to
                ensure there are no contraindications.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Goes Well With Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">GOES WELL WITH</h2>
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 text-center">
              <Image
                src="/images/goes-well-chill.png"
                alt="NOON Chill Gummy"
                width={150}
                height={150}
                className="object-contain mx-auto mb-4"
              />
              <h3 className="font-semibold mb-1">Chill</h3>
              <p className="text-sm text-gray-600">Relaxation & Anxiety, Calming & Rest</p>
            </Card>
            <Card className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 text-center">
              <Image
                src="/images/goes-well-sleep.png"
                alt="NOON Sleep Gummy"
                width={150}
                height={150}
                className="object-contain mx-auto mb-4"
              />
              <h3 className="font-semibold mb-1">Sleep</h3>
              <p className="text-sm text-gray-600">Pre-Sleep, Deep Rest & Recovery</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProductPage;
