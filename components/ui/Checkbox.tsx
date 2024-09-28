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
          'web:peer native:rounded h-10 w-10 shrink-0 rounded-sm border-2 border-neutral-900 disabled:cursor-not-allowed disabled:opacity-50 web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
          props.checked && 'border-2 border-orange-500 bg-orange-50',
          className
        )}
        {...props}>
        <CheckboxPrimitive.Indicator className={cn('h-full w-full items-center justify-center')}>
          <Ionicons name='checkmark' size={20} color='black' />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  }
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
