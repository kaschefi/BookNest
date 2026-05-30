"use client";

import React, { useRef, useEffect } from 'react';
import rough from 'roughjs';

interface RoughCardBackgroundProps {
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    roughness?: number;
    bowing?: number;
}

export default function RoughCardBackground({
    fillColor = '#fdfaf6',
    strokeColor = '#64748b',
    strokeWidth = 1.5,
    roughness = 1.3,
    bowing = 1.0
}: RoughCardBackgroundProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const draw = () => {
            if (!svgRef.current) return;
            svgRef.current.innerHTML = '';
            const rc = rough.svg(svgRef.current);
            const parent = svgRef.current.parentElement;
            if (!parent) return;

            const w = parent.offsetWidth;
            const h = parent.offsetHeight;

            // 1. Draw card container base (without shadow)
            const card = rc.rectangle(2, 2, w - 4, h - 4, {
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                fillStyle: 'solid',
                roughness: roughness,
                bowing: bowing
            });

            svgRef.current.appendChild(card);
        };

        const parent = svgRef.current?.parentElement;
        if (!parent) {
            draw();
            return;
        }

        // Setup ResizeObserver to trigger wobbly redraws instantly when container layout shifts
        const resizeObserver = new ResizeObserver(() => {
            draw();
        });
        
        resizeObserver.observe(parent);

        // Dynamic initial draw
        draw();

        return () => {
            resizeObserver.disconnect();
        };
    }, [fillColor, strokeColor, strokeWidth, roughness, bowing]);

    return (
        <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-visible transition-transform duration-300 group-hover/card:scale-[1.01]"
        />
    );
}
