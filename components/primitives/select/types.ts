import type { ForceMountable, PressableRef } from '~/components/primitives/types';

type Option =
  | {
      value: string;
      label: string;
    }
  | undefined;

type SelectRootContext = {
  value: Option;
  onValueChange: (option: Option) => void;
  disabled?: boolean;
};

type SelectRootProps = {
  value?: Option;
  defaultValue?: Option;
  onValueChange?: (option: Option) => void;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  /**
   * Platform: WEB ONLY
   */
  dir?: 'ltr' | 'rtl';
  /**
   * Platform: WEB ONLY
   */
  name?: string;
  /**
   * Platform: WEB ONLY
   */
  required?: boolean;
};

type SelectValueProps = {
  placeholder: string;
};

type SelectPortalProps = ForceMountable & {
  children: React.ReactNode;
  /**
   * Platform: NATIVE ONLY
   */
  hostName?: string;
  /**
   * Platform: WEB ONLY
   */
  container?: HTMLElement | null | undefined;
};

type SelectOverlayProps = ForceMountable & {
  closeOnPress?: boolean;
};

type SelectContentProps = {
  /**
   * Platform: WEB ONLY
   */
  position?: 'popper' | 'item-aligned' | undefined;
};

type SelectItemProps = {
  value: string;
  label: string;
  closeOnPress?: boolean;
};

type SelectSeparatorProps = {
  decorative?: boolean;
};

type SelectTriggerRef = PressableRef & {
  open: () => void;
  close: () => void;
};

export type {
  Option,
  SelectContentProps,
  SelectItemProps,
  SelectOverlayProps,
  SelectPortalProps,
  SelectRootContext,
  SelectRootProps,
  SelectSeparatorProps,
  SelectTriggerRef,
  SelectValueProps,
};
