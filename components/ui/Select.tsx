/* eslint-disable */
import { Check, ChevronDown } from 'lucide-react-native';
import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Styles from '~/constants/GlobalStyles';
import * as SelectPrimitive from '../primitives/select';

type Option = SelectPrimitive.Option;

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ children, style, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    style={StyleSheet.flatten([selectTriggerStyles.root, props.disabled ? { opacity: 0.5 } : {}, style])}
    {...props}>
    <>{children}</>
    <ChevronDown size={20} color='#6b2020' />
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const selectTriggerStyles = StyleSheet.create({
  root: {
    display: 'flex',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    borderWidth: 1,
    ...Styles.borderColor.border,
    ...Styles.color.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    lineHeight: 20,
  },
});

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & { portalHost?: string }
>(({ className, children, position = 'popper', portalHost, ...props }, ref) => {
  return (
    <SelectPrimitive.Portal hostName={portalHost}>
      <SelectPrimitive.Overlay style={Platform.OS !== 'web' ? StyleSheet.absoluteFill : undefined}>
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <SelectPrimitive.Content
            ref={ref}
            position={position}
            style={StyleSheet.flatten([selectContentStyles.root, props.style])}
            {...props}>
            {children}
          </SelectPrimitive.Content>
        </Animated.View>
      </SelectPrimitive.Overlay>
    </SelectPrimitive.Portal>
  );
});
SelectContent.displayName = SelectPrimitive.Content.displayName;

const selectContentStyles = StyleSheet.create({
  root: {
    position: 'relative',
    zIndex: 50,
    maxHeight: 240,
    minWidth: 200,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    borderWidth: 1,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    backgroundColor: 'white',
    ...Styles.borderColor.border,
  },
});

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ style, ...props }, ref) => (
  <SelectPrimitive.Label ref={ref} style={StyleSheet.flatten([selectLabelStyle.root, style])} {...props} />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const selectLabelStyle = StyleSheet.create({
  root: {
    ...Styles.font.semibold,
    fontSize: 14,
    lineHeight: 20,
    color: 'rgb(146, 146, 146)',
    paddingVertical: 6,
    paddingLeft: 32,
    paddingRight: 8,
  },
});

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ style, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    style={StyleSheet.flatten([
      selectItemStyles.root,
      props.disabled
        ? {
            opacity: 0.5,
          }
        : {},
      style,
    ])}
    {...props}>
    <View style={selectItemStyles.indicator}>
      <SelectPrimitive.ItemIndicator>
        <Check size={12} strokeWidth={3} color='black' />
      </SelectPrimitive.ItemIndicator>
    </View>
    <SelectPrimitive.ItemText style={selectItemStyles.text} />
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const selectItemStyles = StyleSheet.create({
  root: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    paddingVertical: 6,
    paddingLeft: 32,
    paddingRight: 4,
  },
  text: {
    ...Styles.font.medium,
    ...Styles.fontSize.subhead,
  },
  indicator: {
    paddingTop: 1,
    position: 'absolute',
    left: 8,
    display: 'flex',
    height: 14,
    width: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ style, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} style={StyleSheet.flatten([selectSeparatorStyles.root, style])} {...props} />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

const selectSeparatorStyles = StyleSheet.create({
  root: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: -4,
    marginVertical: 4,
  },
});

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type Option,
};
