import { useState, useRef, useEffect, SyntheticEvent, FocusEvent } from "react";

export function useAnimatedPen(dependencies: any[] = []) {
  const [penPos, setPenPos] = useState({ x: 0, y: 0 });
  const [isWriting, setIsWriting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [defaultPos, setDefaultPos] = useState({ x: 0, y: 0 });
  
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const defaultPenContainerRef = useRef<HTMLDivElement>(null);

  // Function to calculate exact caret coordinates
  const getCaretCoordinates = (inputElement: HTMLInputElement) => {
    const { selectionStart } = inputElement;

    // type="email" inputs don't support selectionStart in most browsers.
    // Fall back to the end of the value string for the position.
    const caretPos = selectionStart ?? inputElement.value.length;

    const ghost = document.createElement("div");
    const style = window.getComputedStyle(inputElement);

    Array.from(style).forEach((prop) => {
      ghost.style.setProperty(prop, style.getPropertyValue(prop), style.getPropertyPriority(prop));
    });

    ghost.style.position = "absolute";
    ghost.style.visibility = "hidden";
    ghost.style.whiteSpace = "pre";
    ghost.style.width = style.width;
    ghost.style.height = style.height;
    ghost.style.overflow = "hidden";

    const textUpToCaret = inputElement.value.substring(0, caretPos) || "\u200b";
    ghost.textContent = textUpToCaret;

    const span = document.createElement("span");
    span.textContent = "|";
    ghost.appendChild(span);

    document.body.appendChild(ghost);

    const spanOffsetLeft = span.offsetLeft;
    const spanOffsetTop = span.offsetTop;

    document.body.removeChild(ghost);

    const rect = inputElement.getBoundingClientRect();

    return {
      x: rect.left + spanOffsetLeft - (inputElement.scrollLeft || 0) + window.scrollX,
      y: rect.top + spanOffsetTop + window.scrollY
    };
  };

  const updatePenPosition = (inputElement: HTMLInputElement) => {
    const coords = getCaretCoordinates(inputElement);
    if (coords) {
      setPenPos({ x: coords.x - 25, y: coords.y - 215 });
    }
  };

  const handleInputFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsWriting(true);
    updatePenPosition(e.target);
  };

  const handleInputBlur = () => {
    setIsWriting(false);
  };

  const handleInputInteraction = (e: SyntheticEvent<HTMLInputElement>) => {
    if (isWriting) {
      updatePenPosition(e.currentTarget);

      setIsTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 150);
    }
  };

  useEffect(() => {
    const updateDefaultPos = () => {
      if (defaultPenContainerRef.current) {
        const rect = defaultPenContainerRef.current.getBoundingClientRect();
        setDefaultPos({
          x: rect.left + (rect.width / 2) + 10 + window.scrollX,
          y: rect.top - 230 + window.scrollY
        });
      }
    };

    updateDefaultPos();
    setTimeout(updateDefaultPos, 500);
    window.addEventListener("resize", updateDefaultPos);
    return () => window.removeEventListener("resize", updateDefaultPos);
  }, dependencies);

  return {
    penPos,
    isWriting,
    isTyping,
    defaultPos,
    defaultPenContainerRef,
    handleInputFocus,
    handleInputBlur,
    handleInputInteraction
  };
}
