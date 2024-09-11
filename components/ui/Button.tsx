import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Pressable } from 'react-native';

import { TextClassContext } from '~/components/ui/Text';
import { cn } from '~/lib/utils';

const buttonVariants = cva('group flex items-center justify-center', {
  variants: {
    variant: {
      default: 'bg-orange-500 py-3.5 px-5 rounded-none active:opacity-90',
      destructive: 'bg-destructive active:opacity-90',
      outline: 'border border-input  active:bg-accent',
      secondary: 'bg-secondary active:opacity-80',
      ghost: 'active:bg-accent',
      link: 'active:underline',
    },

    size: {
      default: 'w-full',
      sm: 'w-full h-7',
      md: 'w-full h-8.5',
      lg: 'w-full h-12.5',
      icon: 'w-7 h-7',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

const buttonTextVariants = cva('text-sm native:text-base font-medium text-foreground ', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      destructive: 'text-destructive-foreground',
      outline: 'group-active:text-accent-foreground',
      secondary: 'text-secondary-foreground group-active:text-secondary-foreground',
      ghost: 'group-active:text-accent-foreground',
      link: 'text-primary group-active:underline',
    },
    size: {
      default: '',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      icon: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> & VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <TextClassContext.Provider value={cn(props.disabled && '', buttonTextVariants({ variant, size }))}>
        <Pressable
          className={cn(props.disabled && 'opacity-50', buttonVariants({ variant, size, className }))}
          ref={ref}
          role='button'
          {...props}
        />
      </TextClassContext.Provider>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };