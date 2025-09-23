import type { FC } from 'react';
import { memo } from 'react';

interface TopicChipProps {
  readonly topic: string;
}

const TopicChipComponent: FC<TopicChipProps> = ({ topic }) => {
  return (
    <div className="mb-1 inline-block rounded-lg border border-[color:var(--white)]/30 px-2 py-1 text-sm font-semibold text-[color:var(--white)]/80 md:mr-1">
      {topic}
    </div>
  );
};

export const TopicChip = memo(TopicChipComponent);
TopicChip.displayName = 'TopicChip';
export default TopicChip;
