"use client";
import { P5CanvasInstance, ReactP5Wrapper } from "@p5-wrapper/react";
import { useCallback, useEffect, useState } from "react";
import sketch from "../../assets/Sketch";
import { useWindowSize } from "@/hooks/useWindowSize";
import { Metadata } from "@/types/metadata";
import { cn } from "@/lib/utils";
import { ShareIcon } from "@heroicons/react/24/outline";

type IProps = {
  metadata: Metadata;
  width?: number;
  height?: number;
  hideButton?: boolean;
};

export default function Viewer({
  metadata,
  width = 500,
  height = 500,
  hideButton = false,
}: IProps) {
  const [canvasSize, setCanvasSize] = useState({ width, height });
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  useEffect(() => {
    if (windowWidth && windowWidth < 640) {
      setCanvasSize({ width: 300, height: 300 });
    } else {
      setCanvasSize({ width: 500, height: 500 });
    }
  }, [windowWidth, windowHeight]);

  const populateSketch = useCallback(
    (p5: P5CanvasInstance) => {
      return sketch(
        p5,
        metadata.hidden[0].value,
        metadata.tokenId,
        canvasSize.width,
        canvasSize.height
      );
    },
    [canvasSize, metadata.hidden[0].value]
  );

  return (
    <div className="bg-white">
      <div className="mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
          <div className="lg:col-span-4 lg:row-end-1">
            <div className="aspect-h-3 aspect-w-3 overflow-hidden rounded-lg bg-transparent">
              <div
                className={cn("mx-auto", {
                  "w-[300px] h-[300px]": canvasSize.width === 300,
                  "w-[500px] h-[500px]": canvasSize.width === 500,
                })}
              >
                <ReactP5Wrapper sketch={populateSketch} />
              </div>
            </div>
          </div>

          <div className="mx-auto mt-14 max-w-2xl sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
            <div className="flex flex-col-reverse">
              <div className="mt-4">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  {metadata.name}
                </h1>

                <h2 id="information-heading" className="sr-only">
                  Details
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  ID: {metadata.tokenId} <br /> Hash:{" "}
                  {metadata.hidden[0].value.slice(0, 8) +
                    "..." +
                    metadata.hidden[0].value.slice(-8)}
                </p>
              </div>
            </div>

            <p className="mt-6 text-gray-500">{metadata.description}</p>

            {!hideButton && (
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <button
                  type="button"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-rb-black px-8 py-3 text-base font-medium text-white hover:bg-rb-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rb-black"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      document.location.origin + `/viewer/${metadata.tokenId}`
                    );
                    window.open(`/viewer/${metadata.tokenId}`, "_blank");
                  }}
                >
                  Public Link
                  <ShareIcon className="ml-1 h-4 w-auto" />
                </button>
              </div>
            )}
            <div className="mt-10 border-t border-gray-200 pt-10">
              <h3 className="text-xs font-medium text-gray-900">Traits</h3>
              <div className="prose prose-sm mt-4 text-gray-500">
                <ul role="list">
                  {metadata.attributes.map((attribute) => (
                    <li key={attribute.trait_type}>
                      <strong>{attribute.trait_type}</strong>: {attribute.value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
