import type { ForceMountable } from '~/components/primitives/types';

type CheckboxRootProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
};

type CheckboxIndicator = ForceMountable;

export type { CheckboxIndicator, CheckboxRootProps };
