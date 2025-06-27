// src/pages/TheScience.tsx
import Header from "@/components/Header";
import { Link } from "react-router-dom";

interface ScienceItem {
  id: number;
  title: string;
  description: string;
  img: string;
}

const SCIENCE_ITEMS: ScienceItem[] = [
  {
    id: 1,
    title: "Neuro Wellness Explained",
    description: "How our mushroom blend benefits cognition & mood",
    img: "https://cdn.builder.io/api/v1/image/assets/TEMP/science1.jpg",
  },
  {
    id: 2,
    title: "The Power of Adaptogens",
    description: "Adaptogenic mushrooms and your stress response",
    img: "https://cdn.builder.io/api/v1/image/assets/TEMP/science2.jpg",
  },
  {
    id: 3,
    title: "Client-Grade Formulas",
    description: "Formulation process, safety & quality control",
    img: "https://cdn.builder.io/api/v1/image/assets/TEMP/science3.jpg",
  },
];

export default function TheScience() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
        <h1 className="text-4xl font-semibold mb-6">The Science</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SCIENCE_ITEMS.map((item) => (
            <Link
              key={item.id}
              to="#"
              className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h2 className="text-lg font-medium mb-2">{item.title}</h2>
                <p className="text-gray-600 flex-1">{item.description}</p>
                <span className="mt-4 text-sm text-[#514B3D] font-medium">
                  Learn more →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
