import { memo, type FC, type ReactNode } from 'react';
import { motion } from 'framer-motion';

import { createSpringTransition } from '@/lib/animation';

interface AnimatedWrapperProps {
  readonly children: ReactNode;
}

const AnimatedWrapperComponent: FC<AnimatedWrapperProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={createSpringTransition()}
    >
      {children}
    </motion.div>
  );
};

const AnimatedWrapper = memo(AnimatedWrapperComponent);
AnimatedWrapper.displayName = 'AnimatedWrapper';

export default AnimatedWrapper;
export { AnimatedWrapper };
