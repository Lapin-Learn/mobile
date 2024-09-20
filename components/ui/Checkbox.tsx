import Ionicons from '@expo/vector-icons/Ionicons';
import * as React from 'react';

import { cn } from '~/lib/utils';

import * as CheckboxPrimitive from '../primitives/checkbox';

type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
  className?: string;
  checked?: boolean;
};

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          'web:peer h-10 w-10 shrink-0 rounded-sm native:rounded border-2 border-neutral-900 web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          props.checked && 'bg-orange-50 border-2 border-orange-500',
          className
        )}
        {...props}>
        <CheckboxPrimitive.Indicator className={cn('items-center justify-center h-full w-full')}>
          <Ionicons name='checkmark' size={20} color='black' />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  }
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
