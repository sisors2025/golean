"use client";

import { useState } from "react";
import { LeadMagnetSection as LeadMagnetSectionType } from "@/types/contentful";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { motion, PanInfo, AnimatePresence } from "framer-motion";

interface LeadMagnetSectionProps {
  content: LeadMagnetSectionType;
}

interface FormData {
  [key: string]: string;
}

export function LeadMagnetSection({ content }: LeadMagnetSectionProps) {
  const {
    title,
    subtitle,
    leadMagnets,
    titleModal,
    subtitleModal,
    ctaTextModal,
    fieldsToCapture,
    submitEndpoint,
    confirmationTitle,
    confirmationMessage,
    backgroundColor,
    isVisible,
  } = content;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeadMagnet, setSelectedLeadMagnet] = useState<string | null>(
    null
  );
  const [formData, setFormData] = useState<FormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const { toast } = useToast();

  if (!isVisible || !leadMagnets || leadMagnets.length === 0) return null;

  const isSingleLeadMagnet = leadMagnets.length === 1;

  const getBackgroundStyle = () => {
    if (!backgroundColor) return {};

    const hexToRgba = (hex: string, alpha: number) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    return {
      background: `linear-gradient(135deg, 
        ${hexToRgba(backgroundColor, 0.15)}, 
        ${hexToRgba(backgroundColor, 0.05)}
      )`,
    };
  };

  const getObjectFitClass = (fit?: string) => {
    switch (fit) {
      case "Ajustar":
        return "object-contain";
      case "Rellenar":
        return "object-fill";
      case "Expandir":
      default:
        return "object-cover";
    }
  };

  const handleOpenModal = (leadMagnetId: string) => {
    setSelectedLeadMagnet(leadMagnetId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
      setIsSuccess(false);
      setFormData({});
      setSelectedLeadMagnet(null);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(submitEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadMagnetId: selectedLeadMagnet,
          ...formData,
        }),
        redirect: "follow",
        mode: "no-cors",
      });

      if (!response.ok) throw new Error("Error al enviar el formulario");

      setIsSuccess(true);
      toast({
        title: "¡Éxito!",
        description: "Formulario enviado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el formulario",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const SWIPE_THRESHOLD = 50;
    const SWIPE_VELOCITY = 0.5;

    if (
      Math.abs(info.offset.x) > SWIPE_THRESHOLD ||
      Math.abs(info.velocity.x) > SWIPE_VELOCITY
    ) {
      if (info.offset.x > 0 || info.velocity.x > 0) {
        // Swipe derecha (anterior)
        if (currentPage > 0) {
          setDirection("right");
          setCurrentPage((prev) => prev - 1);
        }
      } else {
        // Swipe izquierda (siguiente)
        if (currentPage < Math.ceil(leadMagnets.length) - 1) {
          setDirection("left");
          setCurrentPage((prev) => prev + 1);
        }
      }
    }
  };

  const slideVariants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "left" ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: "left" | "right") => ({
      zIndex: 0,
      x: direction === "left" ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  const renderHeroLayout = () => {
    const leadMagnet = leadMagnets[0];
    const imagePosition = leadMagnet.fields.imagePosition || "right";

    const ContentSection = () => (
      <div className="flex flex-col justify-between h-full space-y-6">
        <div className="space-y-6">
          <h3 className="text-2xl md:text-3xl font-bold">
            {leadMagnet.fields.title}
          </h3>
          <div className="prose prose-invert max-w-none">
            {documentToReactComponents(leadMagnet.fields.description)}
          </div>

          {leadMagnet.fields.features &&
            leadMagnet.fields.features.length > 0 && (
              <ul className="space-y-4">
                {leadMagnet.fields.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    </div>
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>
            )}
        </div>

        <div className="flex flex-wrap gap-4 pt-4">
          <Button
            onClick={() => handleOpenModal(leadMagnet.sys.id)}
            className="w-full md:w-auto"
          >
            {leadMagnet.fields.ctaText}
          </Button>
        </div>
      </div>
    );

    const ImageSection = () =>
      leadMagnet.fields.image && (
        <div className="relative aspect-square md:aspect-[1.2/1] rounded-xl overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={`https:${leadMagnet.fields.image.fields.file.url}`}
              alt={leadMagnet.fields.image.fields.title}
              className={cn(
                "w-full h-full rounded-lg",
                getObjectFitClass(leadMagnet.fields.imageFit)
              )}
            />
          </div>
        </div>
      );

    return (
      <div className="card-gradient rounded-lg p-6 md:p-12">
        <div
          className={cn(
            "grid gap-8 md:gap-12 items-center",
            imagePosition === "right"
              ? "md:grid-cols-[1fr,1.2fr]"
              : "md:grid-cols-[1.2fr,1fr]"
          )}
        >
          {imagePosition === "right" ? (
            <>
              <ContentSection />
              <ImageSection />
            </>
          ) : (
            <>
              <ImageSection />
              <ContentSection />
            </>
          )}
        </div>
      </div>
    );
  };

  const renderCardsLayout = () => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const itemsPerPage = isMobile ? 1 : 3;
    const totalPages = Math.ceil(leadMagnets.length / itemsPerPage);
    const visibleLeadMagnets = leadMagnets.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    );

    const getGridClasses = () => {
      if (isMobile) return "grid-cols-1 max-w-md mx-auto";

      switch (visibleLeadMagnets.length) {
        case 1:
          return "md:grid-cols-1 max-w-sm mx-auto";
        case 2:
          return "md:grid-cols-2 max-w-3xl mx-auto";
        default:
          return "md:grid-cols-3 max-w-6xl mx-auto";
      }
    };

    return (
      <div className="relative">
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag={isMobile ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={isMobile ? handleDragEnd : undefined}
            className="relative"
          >
            <div className={cn("grid gap-8", getGridClasses())}>
              {visibleLeadMagnets.map((leadMagnet) => (
                <div
                  key={leadMagnet.sys.id}
                  className="card-gradient rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg flex flex-col"
                >
                  {leadMagnet.fields.image && (
                    <div className="relative aspect-[16/9]">
                      <img
                        src={`https:${leadMagnet.fields.image.fields.file.url}`}
                        alt={leadMagnet.fields.image.fields.title}
                        className={cn(
                          "w-full h-full",
                          getObjectFitClass(leadMagnet.fields.imageFit)
                        )}
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-semibold mb-4">
                      {leadMagnet.fields.title}
                    </h3>
                    <div className="prose prose-invert max-w-none mb-6 flex-grow">
                      {documentToReactComponents(leadMagnet.fields.description)}
                    </div>

                    {leadMagnet.fields.features &&
                      leadMagnet.fields.features.length > 0 && (
                        <ul className="space-y-2 mb-6">
                          {leadMagnet.fields.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm"
                            >
                              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-foreground/80">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}

                    <Button
                      onClick={() => handleOpenModal(leadMagnet.sys.id)}
                      className="w-full mt-auto"
                    >
                      {leadMagnet.fields.ctaText}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controles de navegación - Solo en escritorio */}
        {!isMobile && leadMagnets.length > 3 && (
          <div className="hidden md:flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setDirection("right");
                setCurrentPage((prev) => prev - 1);
              }}
              disabled={currentPage === 0}
              className="rounded-full"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setDirection("left");
                setCurrentPage((prev) => prev + 1);
              }}
              disabled={currentPage === totalPages - 1}
              className="rounded-full"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        )}

        {/* Indicadores de página - Solo en móvil */}
        {isMobile && (
          <div className="flex md:hidden justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentPage ? "left" : "right");
                  setCurrentPage(index);
                }}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  currentPage === index
                    ? "bg-primary w-4"
                    : "bg-primary/30 hover:bg-primary/50"
                )}
                aria-label={`Ir a la página ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="py-24 relative" style={getBackgroundStyle()}>
      <div className="container max-w-6xl mx-auto  px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-foreground/80 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {isSingleLeadMagnet ? renderHeroLayout() : renderCardsLayout()}

        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isSuccess ? confirmationTitle : titleModal}
              </DialogTitle>
              <DialogDescription>
                {isSuccess ? confirmationMessage : subtitleModal}
              </DialogDescription>
            </DialogHeader>

            {!isSuccess && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {fieldsToCapture.map((field) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field}>{field}</Label>
                    <Input
                      id={field}
                      value={formData[field] || ""}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      required
                    />
                  </div>
                ))}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : ctaTextModal}
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
