interface ScrollArrowProps {
  direction: 'left' | 'right';
  onClick: () => void;
  onMouseEnter: () => void;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  hoveredRow: string;
}

export default function ScrollArrow({
  direction,
  onClick,
  onMouseEnter,
  scrollContainerRef,
  hoveredRow,
}: ScrollArrowProps) {
  const getPosition = () => {
    if (!scrollContainerRef.current) return { left: '12px', top: '50%' };

    const containerRect = scrollContainerRef.current.getBoundingClientRect();
    const rowElement = scrollContainerRef.current.querySelector(
      `tr[data-candidate-id="${hoveredRow}"]`
    );

    const left =
      direction === 'left'
        ? `${containerRect.left + 12}px`
        : `${containerRect.right - 52}px`;

    const top = rowElement
      ? `${rowElement.getBoundingClientRect().top + rowElement.getBoundingClientRect().height / 2}px`
      : '50%';

    return { left, top };
  };

  const position = getPosition();
  const arrowPath = direction === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7';

  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className="fixed bg-black/80 hover:bg-black text-white p-2.5 rounded-full shadow-2xl transition-opacity z-50"
      style={position}
      aria-label={`Scroll ${direction}`}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d={arrowPath}
        />
      </svg>
    </button>
  );
}
