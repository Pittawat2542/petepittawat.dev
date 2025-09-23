import React, { type ReactNode, memo } from 'react';
import { motion } from 'framer-motion';

interface AnimatedWrapperProps {
  readonly children: ReactNode;
}

const AnimatedWrapperComponent: React.FC<AnimatedWrapperProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
      }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedWrapper = memo(AnimatedWrapperComponent);
AnimatedWrapper.displayName = 'AnimatedWrapper';

export default AnimatedWrapper;
export { AnimatedWrapper };
