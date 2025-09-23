import type { FC } from 'react';
import { memo } from 'react';

const DividerComponent: FC = () => {
  return <hr className="border-border" />;
};

export const Divider = memo(DividerComponent);
Divider.displayName = 'Divider';
export default Divider;
