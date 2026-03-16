"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Announcement, getAnnouncements } from "@/lib/supabase";
import { Tag } from "lucide-react";

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    getAnnouncements()
      .then(setAnnouncements)
      .catch(() => {});
  }, []);

  const items =
    announcements.length > 0
      ? announcements
      : [
          {
            id: "1",
            text: "🕯️ Free delivery on orders above ₹999!",
            link: "/candles",
            is_active: true,
            sort_order: 1,
          },
          {
            id: "2",
            text: "✨ New latte candle scents just dropped!",
            link: "/candles",
            is_active: true,
            sort_order: 2,
          },
          {
            id: "3",
            text: "🌸 Handmade pipecleaner flowers — forever blooms!",
            link: "/crafts",
            is_active: true,
            sort_order: 3,
          },
          {
            id: "4",
            text: "🎁 Custom gift sets available — WhatsApp us!",
            link: "/contact",
            is_active: true,
            sort_order: 4,
          },
        ];

  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    // fixed to top, z-60 (above navbar z-50)
    <div
      className="fixed top-0 left-0 right-0 z-[60] bg-blush-400 overflow-hidden"
      style={{ height: "36px" }}
    >
      <div className="flex items-center h-full gap-0 marquee-track">
        {doubled.map((item, i) => (
          <div
            key={`${item.id}-${i}`}
            className="flex items-center gap-2 px-8 shrink-0"
          >
            <Tag size={11} className="text-white/70" />
            {item.link ? (
              <Link
                href={item.link}
                className="font-body text-xs text-white font-medium tracking-wide hover:text-white/80 transition-colors whitespace-nowrap"
              >
                {item.text}
              </Link>
            ) : (
              <span className="font-body text-xs text-white font-medium tracking-wide whitespace-nowrap">
                {item.text}
              </span>
            )}
            <span className="text-white/40 ml-4">•</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .marquee-track {
          animation: marquee 30s linear infinite;
          width: max-content;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
