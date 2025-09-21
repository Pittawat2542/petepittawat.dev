import type { FC } from 'react';
import { memo } from 'react';

interface TopicChipProps {
  readonly topic: string;
}

const TopicChipComponent: FC<TopicChipProps> = ({ topic }) => {
  return (
    <div className="rounded-lg px-2 py-1 border text-sm font-semibold inline-block md:mr-1 mb-1 border-[color:var(--white)]/30 text-[color:var(--white)]/80">
      {topic}
    </div>
  );
};

export const TopicChip = memo(TopicChipComponent);
TopicChip.displayName = 'TopicChip';
export default TopicChip;