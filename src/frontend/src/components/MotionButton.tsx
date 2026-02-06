import { Button } from '@/components/ui/button';
import { forwardRef, ComponentPropsWithoutRef } from 'react';

type ButtonProps = ComponentPropsWithoutRef<typeof Button>;

const MotionButton = forwardRef<HTMLButtonElement, ButtonProps>(({ children, className = '', ...props }, ref) => {
  return (
    <Button className={`active:scale-[0.96] transition-transform duration-150 ${className}`} {...props} ref={ref}>
      {children}
    </Button>
  );
});

MotionButton.displayName = 'MotionButton';

export default MotionButton;
