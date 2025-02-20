import { Button } from "./ui/button";
import { HeroSection } from "@/types/contentful";
import Link from "next/link";
import { getTargetHref } from "@/lib/scroll-utils";
import { SectionLink } from "./ui/section-link";

interface HeroProps {
  content: HeroSection;
}

export function Hero({ content }: HeroProps) {
  const {
    title,
    highlightedText,
    description,
    ctaText,
    ctaUrl,
    isVisible,
    image,
    imagePosition = "right",
    imageWidth,
    ctaSection,
    sectionId,
  } = content;

  if (!isVisible) return null;

  const computedImageWidth =
    typeof imageWidth === "number" && imageWidth > 0 ? imageWidth : 400;

  const imagePositionClasses = {
    right: "md:flex-row-reverse",
    left: "md:flex-row",
    top: "flex-col",
    bottom: "flex-col-reverse",
  };

  const layoutClasses =
    image && imagePosition !== "background"
      ? imagePositionClasses[
          imagePosition as keyof typeof imagePositionClasses
        ] || "md:flex-row"
      : "";

  const isVideo = image?.fields?.file?.contentType?.includes("video");
  const mediaUrl = image?.fields?.file?.url
    ? `https:${image.fields.file.url}`
    : null;

  return (
    <section
      id={sectionId}
      className={`relative ${
        image && imagePosition === "background"
          ? "pt-40 pb-24 overflow-hidden"
          : "py-20"
      }`}
    >
      {/* Fondo de video o imagen */}
      {mediaUrl && imagePosition === "background" && (
        <div className="absolute inset-0 z-0">
          {isVideo ? (
            <>
              <video
                src={mediaUrl}
                autoPlay
                muted
                loop
                className="w-full h-full object-cover"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              {/* Capa de gradiente para oscurecer el video */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))",
                }}
              />
            </>
          ) : (
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${mediaUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            />
          )}
          <div className="absolute inset-0 gradient-bg" />
        </div>
      )}

      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        {mediaUrl && imagePosition !== "background" ? (
          <div
            className={`w-full flex flex-col ${layoutClasses} items-center gap-8`}
          >
            {imagePosition === "top" || imagePosition === "bottom" ? (
              <>
                {isVideo ? (
                  <video
                    src={mediaUrl}
                    autoPlay
                    muted
                    loop
                    className="mx-auto rounded-lg w-full md:w-auto"
                    style={{ maxWidth: computedImageWidth }}
                  />
                ) : (
                  <img
                    src={mediaUrl}
                    alt={image?.fields?.title || "Hero Image"}
                    className="mx-auto rounded-lg w-full md:w-auto"
                    style={{ maxWidth: computedImageWidth }}
                  />
                )}
                <div className="text-center w-full">
                  <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mt-8 md:mt-20 mb-6">
                    {title}{" "}
                    <span className="text-gradient">{highlightedText}</span>
                  </h1>
                  <p className="text-base md:text-lg lg:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto">
                    {description}
                  </p>
                  {ctaText && (ctaUrl || ctaSection) && (
                    <SectionLink
                      href={getTargetHref(ctaSection, ctaUrl)}
                      ctaSection={ctaSection}
                      ctaUrl={ctaUrl}
                    >
                      {ctaText}
                    </SectionLink>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="w-full md:w-1/2 order-2 md:order-none">
                  {isVideo ? (
                    <video
                      src={mediaUrl}
                      autoPlay
                      muted
                      loop
                      className="mx-auto rounded-lg w-full"
                      style={{ maxWidth: computedImageWidth }}
                    />
                  ) : (
                    <img
                      src={mediaUrl}
                      alt={image?.fields?.title || "Hero Image"}
                      className="mx-auto rounded-lg w-full"
                      style={{ maxWidth: computedImageWidth }}
                    />
                  )}
                </div>
                <div className="text-start w-full md:w-1/2 order-1 md:order-none">
                  <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mt-8 md:mt-20 mb-6">
                    {title}{" "}
                    <span className="text-gradient">{highlightedText}</span>
                  </h1>
                  <p className="text-base md:text-lg lg:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto">
                    {description}
                  </p>
                  {ctaText && (ctaUrl || ctaSection) && (
                    <SectionLink
                      href={getTargetHref(ctaSection, ctaUrl)}
                      ctaSection={ctaSection}
                      ctaUrl={ctaUrl}
                      className="w-full md:w-auto"
                    >
                      {ctaText}
                    </SectionLink>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mt-8 md:mt-20 mb-6">
              {title} <span className="text-gradient">{highlightedText}</span>
            </h1>
            <p className="text-base md:text-lg lg:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto">
              {description}
            </p>
            {ctaText && (ctaUrl || ctaSection) && (
              <SectionLink
                href={getTargetHref(ctaSection, ctaUrl)}
                ctaSection={ctaSection}
                ctaUrl={ctaUrl}
                className="w-full md:w-auto btn btn-primary btn-lg"
              >
                {ctaText}
              </SectionLink>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
