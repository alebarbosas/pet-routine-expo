import { createContext, useContext, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text as RNText,
  TextInput,
  View,
  type PressableProps,
  type StyleProp,
  type TextInputProps,
  type TextProps,
  type TextStyle,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import { useTheme, type ModoTema } from '../../context/theme-context';

type UiConfig = {
  mode: ModoTema;
};

const GluestackUiContext = createContext<UiConfig>({ mode: 'claro' });

export function GluestackUIProvider({
  mode,
  children,
}: {
  mode?: ModoTema;
  children: ReactNode;
}) {
  const { modo } = useTheme();
  return (
    <GluestackUiContext.Provider value={{ mode: mode ?? modo }}>
      {children}
    </GluestackUiContext.Provider>
  );
}

export function useGluestackUi() {
  return useContext(GluestackUiContext);
}

const SPACE_MAP = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

type SpaceToken = keyof typeof SPACE_MAP;

function parseViewClassName(className?: string): ViewStyle {
  if (!className) return {};
  const tokens = className.split(/\s+/);
  const style: ViewStyle = {};

  for (const token of tokens) {
    if (token === 'flex-1') style.flex = 1;
    else if (token === 'flex-row') style.flexDirection = 'row';
    else if (token === 'flex-wrap') style.flexWrap = 'wrap';
    else if (token === 'items-center') style.alignItems = 'center';
    else if (token === 'items-start') style.alignItems = 'flex-start';
    else if (token === 'items-end') style.alignItems = 'flex-end';
    else if (token === 'justify-between') style.justifyContent = 'space-between';
    else if (token === 'justify-center') style.justifyContent = 'center';
    else if (token === 'w-full') style.width = '100%';
    else if (token === 'rounded-lg') style.borderRadius = 10;
    else if (token === 'rounded-xl') style.borderRadius = 14;
    else if (token === 'rounded-2xl') style.borderRadius = 18;
    else if (token === 'rounded-full') style.borderRadius = 999;
    else if (token === 'p-2') style.padding = 8;
    else if (token === 'p-3') style.padding = 12;
    else if (token === 'p-4') style.padding = 16;
    else if (token === 'p-5') style.padding = 20;
    else if (token === 'p-6') style.padding = 24;
    else if (token === 'px-3') style.paddingHorizontal = 12;
    else if (token === 'px-4') style.paddingHorizontal = 16;
    else if (token === 'py-2') style.paddingVertical = 8;
    else if (token === 'py-3') style.paddingVertical = 12;
    else if (token === 'gap-1') style.gap = 4;
    else if (token === 'gap-2') style.gap = 8;
    else if (token === 'gap-3') style.gap = 12;
    else if (token === 'gap-4') style.gap = 16;
    else if (token === 'gap-5') style.gap = 20;
  }

  return style;
}

function parseTextClassName(className?: string): TextStyle {
  if (!className) return {};
  const tokens = className.split(/\s+/);
  const style: TextStyle = {};

  for (const token of tokens) {
    if (token === 'font-bold') style.fontWeight = '700';
    else if (token === 'font-semibold') style.fontWeight = '600';
    else if (token === 'font-medium') style.fontWeight = '500';
    else if (token === 'text-center') style.textAlign = 'center';
    else if (token === 'uppercase') style.textTransform = 'uppercase';
    else if (token === 'capitalize') style.textTransform = 'capitalize';
    else if (token === 'text-xs') style.fontSize = 12;
    else if (token === 'text-sm') style.fontSize = 14;
    else if (token === 'text-base') style.fontSize = 15;
    else if (token === 'text-lg') style.fontSize = 18;
    else if (token === 'text-xl') style.fontSize = 22;
    else if (token === 'text-2xl') style.fontSize = 28;
  }

  return style;
}

export type CardProps = ViewProps & {
  variant?: 'elevated' | 'outline' | 'filled';
  className?: string;
};

export function Card({
  variant = 'elevated',
  className,
  style,
  children,
  ...rest
}: CardProps) {
  const { tema, isDark } = useTheme();

  const surfaceStyle: ViewStyle =
    variant === 'filled'
      ? { backgroundColor: tema.superficie, borderColor: tema.borda }
      : { backgroundColor: tema.cartao, borderColor: tema.borda };

  const elevationStyle: ViewStyle =
    variant === 'elevated' && !isDark
      ? {
          shadowColor: '#2A181B',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
        }
      : {};

  return (
    <View
      style={[
        styles.cardBase,
        surfaceStyle,
        elevationStyle,
        parseViewClassName(className),
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

export type StackProps = ViewProps & {
  space?: SpaceToken;
  className?: string;
};

export function VStack({
  space = 'md',
  className,
  style,
  children,
  ...rest
}: StackProps) {
  return (
    <View
      style={[
        { flexDirection: 'column', gap: SPACE_MAP[space] },
        parseViewClassName(className),
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

export function HStack({
  space = 'sm',
  className,
  style,
  children,
  ...rest
}: StackProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: SPACE_MAP[space],
        },
        parseViewClassName(className),
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

export type HeadingProps = TextProps & {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
};

const HEADING_SIZES = {
  sm: { fontSize: 16, lineHeight: 22 },
  md: { fontSize: 18, lineHeight: 24 },
  lg: { fontSize: 22, lineHeight: 28 },
  xl: { fontSize: 26, lineHeight: 32 },
  '2xl': { fontSize: 32, lineHeight: 38 },
} as const;

export function Heading({
  size = 'md',
  className,
  style,
  children,
  ...rest
}: HeadingProps) {
  const { tema } = useTheme();
  return (
    <RNText
      accessibilityRole="header"
      style={[
        {
          fontWeight: '700',
          color: tema.primaria,
          letterSpacing: -0.2,
          ...HEADING_SIZES[size],
        },
        parseTextClassName(className),
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
}

export type UiTextProps = TextProps & {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  muted?: boolean;
  className?: string;
};

const TEXT_SIZES = {
  xs: { fontSize: 12, lineHeight: 17 },
  sm: { fontSize: 14, lineHeight: 20 },
  md: { fontSize: 15, lineHeight: 22 },
  lg: { fontSize: 17, lineHeight: 24 },
} as const;

export function Text({
  size = 'md',
  muted = false,
  className,
  style,
  children,
  ...rest
}: UiTextProps) {
  const { tema } = useTheme();
  return (
    <RNText
      style={[
        {
          color: muted ? tema.textoFraco : tema.texto,
          ...TEXT_SIZES[size],
        },
        parseTextClassName(className),
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
}

export type BadgeAction = 'success' | 'warning' | 'error' | 'info' | 'muted';

type BadgeContextValue = {
  textColor: string;
};

const BadgeContext = createContext<BadgeContextValue>({ textColor: '#2A181B' });

export type BadgeProps = ViewProps & {
  action?: BadgeAction;
  variant?: 'solid' | 'outline';
  className?: string;
};

export function Badge({
  action = 'info',
  variant = 'solid',
  className,
  style,
  children,
  ...rest
}: BadgeProps) {
  const { tema, isDark } = useTheme();

  const paletteByAction: Record<
    BadgeAction,
    { bg: string; border: string; text: string }
  > = {
    success: {
      bg: isDark ? '#143322' : '#DCFCE7',
      border: isDark ? '#22C55E' : '#86EFAC',
      text: isDark ? '#86EFAC' : '#166534',
    },
    warning: {
      bg: isDark ? '#382610' : '#FEF3C7',
      border: isDark ? '#F59E0B' : '#FCD34D',
      text: isDark ? '#FCD34D' : '#92400E',
    },
    error: {
      bg: isDark ? '#3B181C' : '#FEE2E2',
      border: isDark ? '#F87171' : '#FCA5A5',
      text: isDark ? '#FCA5A5' : '#991B1B',
    },
    info: {
      bg: tema.azulSuave,
      border: tema.azulClaro,
      text: tema.azulTexto,
    },
    muted: {
      bg: tema.primariaSuave,
      border: tema.borda,
      text: tema.primaria,
    },
  };

  const cor = paletteByAction[action];

  return (
    <BadgeContext.Provider value={{ textColor: cor.text }}>
      <View
        style={[
          styles.badgeBase,
          {
            backgroundColor: variant === 'outline' ? 'transparent' : cor.bg,
            borderColor: cor.border,
          },
          parseViewClassName(className),
          style,
        ]}
        {...rest}
      >
        {children}
      </View>
    </BadgeContext.Provider>
  );
}

export function BadgeText({
  className,
  style,
  children,
  ...rest
}: TextProps & { className?: string }) {
  const { textColor } = useContext(BadgeContext);
  return (
    <RNText
      style={[
        styles.badgeText,
        { color: textColor },
        parseTextClassName(className),
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
}

export type ButtonAction =
  | 'primary'
  | 'secondary'
  | 'positive'
  | 'negative'
  | 'warning';

type ButtonContextValue = {
  textColor: string;
};

const ButtonContext = createContext<ButtonContextValue>({
  textColor: '#FAF8F5',
});

export type ButtonProps = Omit<PressableProps, 'style'> & {
  action?: ButtonAction;
  variant?: 'solid' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isDisabled?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  action = 'primary',
  variant = 'solid',
  size = 'md',
  isDisabled = false,
  disabled,
  className,
  style,
  children,
  ...rest
}: ButtonProps) {
  const { tema } = useTheme();
  const bloqueado = Boolean(isDisabled || disabled);

  const tokens: Record<
    ButtonAction,
    { bg: string; border: string; text: string }
  > = {
    primary: {
      bg: tema.primaria,
      border: tema.primaria,
      text: '#FAF8F5',
    },
    secondary: {
      bg: tema.azulSuave,
      border: tema.azulClaro,
      text: tema.azulTexto,
    },
    positive: {
      bg: tema.sucesso,
      border: tema.sucesso,
      text: '#FAF8F5',
    },
    negative: {
      bg: tema.erro,
      border: tema.erro,
      text: '#FAF8F5',
    },
    warning: {
      bg: tema.alerta,
      border: tema.alerta,
      text: '#FAF8F5',
    },
  };

  const t = tokens[action];
  const isOutline = variant === 'outline';
  const paddingY = size === 'sm' ? 9 : size === 'lg' ? 15 : 13;
  const minHeight = size === 'sm' ? 38 : size === 'lg' ? 52 : 46;
  const textColor = isOutline
    ? action === 'secondary'
      ? tema.azulTexto
      : tema.texto
    : t.text;

  return (
    <ButtonContext.Provider value={{ textColor }}>
      <Pressable
        accessibilityRole="button"
        disabled={bloqueado}
        style={({ pressed }) => [
          styles.buttonBase,
          {
            minHeight,
            paddingVertical: paddingY,
            backgroundColor: isOutline ? tema.cartao : t.bg,
            borderColor: isOutline ? tema.borda : t.border,
          },
          bloqueado && styles.disabled,
          pressed && !bloqueado && styles.pressed,
          parseViewClassName(className),
          style,
        ]}
        {...rest}
      >
        {children}
      </Pressable>
    </ButtonContext.Provider>
  );
}

export function ButtonText({
  className,
  style,
  children,
  ...rest
}: TextProps & { className?: string }) {
  const { textColor } = useContext(ButtonContext);
  return (
    <RNText
      style={[
        styles.buttonText,
        { color: textColor },
        parseTextClassName(className),
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
}

export function ButtonSpinner({ color }: { color?: string }) {
  const { textColor } = useContext(ButtonContext);
  return <ActivityIndicator size="small" color={color ?? textColor} />;
}

export type InputProps = ViewProps & {
  isDisabled?: boolean;
  isInvalid?: boolean;
  className?: string;
};

export function Input({
  isDisabled = false,
  isInvalid = false,
  className,
  style,
  children,
  ...rest
}: InputProps) {
  const { tema } = useTheme();

  return (
    <View
      style={[
        styles.inputContainer,
        {
          backgroundColor: tema.fundo,
          borderColor: isInvalid ? tema.erro : tema.borda,
        },
        isDisabled && styles.disabled,
        parseViewClassName(className),
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

export function InputField({
  className,
  style,
  placeholderTextColor,
  ...rest
}: TextInputProps & { className?: string }) {
  const { tema } = useTheme();
  return (
    <TextInput
      placeholderTextColor={placeholderTextColor ?? tema.textoFraco}
      style={[
        styles.inputField,
        { color: tema.texto },
        parseTextClassName(className),
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  cardBase: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  badgeBase: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  buttonBase: {
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  inputContainer: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  inputField: {
    fontSize: 15,
    paddingVertical: 11,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.84,
    transform: [{ scale: 0.99 }],
  },
});