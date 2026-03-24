"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

interface PortfolioGalleryProps {
  gallery: string[];
  title: string;
}

export function PortfolioGallery({ gallery, title }: PortfolioGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!gallery || gallery.length === 0) return null;

  // Форматуємо масив картинок для Lightbox
  const slides = gallery.map((src) => ({ src }));

  return (
    <div className="mb-10 md:mb-14 w-full">
      <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-4 md:mb-6">
        {title}
      </h3>
      
      {/* Стандартна карусель на сторінці */}
      <Carousel className="w-full relative group">
        <CarouselContent className="-ml-2 sm:-ml-4">
          {gallery.map((imgUrl, idx) => (
            <CarouselItem key={idx} className="pl-2 sm:pl-4 basis-full sm:basis-1/2">
              <div 
                className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden border shadow-sm group/slide bg-muted cursor-zoom-in"
                onClick={() => {
                  setPhotoIndex(idx); // Запам'ятовуємо, на яку картинку клікнули
                  setIsOpen(true);    // Відкриваємо Lightbox
                }}
              >
                <Image
                  src={imgUrl}
                  alt={`Gallery image ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover/slide:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover/slide:bg-black/20 transition-colors flex items-center justify-center">
                  <Maximize2 className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-0 group-hover/slide:opacity-100 transition-opacity drop-shadow-md" />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {gallery.length > 1 && (
          <>
            <CarouselPrevious className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0" />
            <CarouselNext className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0" />
          </>
        )}
      </Carousel>

      {/* Повноекранна галерея зі свайпами */}
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        index={photoIndex}
        slides={slides}
        carousel={{ finite: false }} // Дозволяє гортати по колу
        controller={{ closeOnBackdropClick: true }}
      />
    </div>
  );
}