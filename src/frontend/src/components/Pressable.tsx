import { forwardRef, ComponentPropsWithoutRef } from 'react';

interface PressableProps extends ComponentPropsWithoutRef<'button'> {
  children: React.ReactNode;
  asDiv?: boolean;
}

const Pressable = forwardRef<HTMLButtonElement | HTMLDivElement, PressableProps>(
  ({ children, asDiv = false, className = '', ...props }, ref) => {
    const baseClass = 'active:scale-[0.96] transition-transform duration-150';
    const combinedClass = `${baseClass} ${className}`;

    if (asDiv) {
      return (
        <div ref={ref as React.Ref<HTMLDivElement>} className={combinedClass} {...(props as any)}>
          {children}
        </div>
      );
    }

    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} className={combinedClass} {...props}>
        {children}
      </button>
    );
  }
);

Pressable.displayName = 'Pressable';

export default Pressable;
