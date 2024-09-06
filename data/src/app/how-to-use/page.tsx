"use client";
import React from "react";
import { StickyScroll } from "@/components/ui/sticky-roll";
import Image from "next/image";

const content = [
  {
    title: "Upload Your Docs",
    description:
      "Here you can directly drag and drop your documents or you can provide it from your computer.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <Image
          src="/assets/upload.jpg"  // Fixed the src attribute
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="Upload demo"
        />
      </div>
    ),
  },
  {
    title: "Redact/Blur and Customisation",
    description:
      "You can either choose to redact(blank) or blur your docs.You can choose to redact/blur only those parts of your document that you find necessary.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <Image
          src="/assets/redact_blur.jpg"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="Redact or blur demo"
        />
      </div>
    ),
  },
  // {
  //   title: "Customisation",
  //   description:
  //     "You can choose to redact/blur only those parts of your document that you find necessary.",
  //   content: (
  //     <div className="h-full w-full flex items-center justify-center text-white">
  //       <Image
  //         src="/linear.webp"
  //         width={300}
  //         height={300}
  //         className="h-full w-full object-cover"
  //         alt="Customisation demo"
  //       />
  //     </div>
  //   ),
  // },
  {
    title: "Show Preview",
    description:
      "Here you can view a live preview of what your document will look like.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <Image
          src="/linear.webp"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="Preview demo"
        />
      </div>
    ),
  },
  {
    title: "Download doc",
    description:
      "Here you can download the final redacted/blurred version of your document.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <Image
          src="/assets/download.jpg"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="Download demo"
        />
      </div>
    ),
  },

  {
    title: "Follow",
    description:
      "Follow the steps to completely and peacefully use our website without plucking any of your hair.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <Image
          src="/assets/download.jpg"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="Download demo"
        />
      </div>
    ),
  },
];

export default function StickyScrollRevealDemo() {
  return (
    <div className="min-h-screen flex flex-col p-10">
      {/* Ensure the content takes up full height */}
      <StickyScroll content={content} />
    </div>
  );
}
