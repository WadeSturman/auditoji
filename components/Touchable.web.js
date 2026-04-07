import React from 'react';
import { StyleSheet } from 'react-native';

// Expands React Native style shorthands that have no direct CSS equivalent.
function rnToCSS(style) {
  const s = { ...style };
  if (s.paddingVertical != null)   { s.paddingTop    ??= s.paddingVertical;   s.paddingBottom ??= s.paddingVertical;   delete s.paddingVertical; }
  if (s.paddingHorizontal != null) { s.paddingLeft   ??= s.paddingHorizontal; s.paddingRight  ??= s.paddingHorizontal; delete s.paddingHorizontal; }
  if (s.marginVertical != null)    { s.marginTop     ??= s.marginVertical;    s.marginBottom  ??= s.marginVertical;    delete s.marginVertical; }
  if (s.marginHorizontal != null)  { s.marginLeft    ??= s.marginHorizontal;  s.marginRight   ??= s.marginHorizontal;  delete s.marginHorizontal; }
  return s;
}

// Renders a plain HTML <button> so clicks fire immediately via the browser's
// native click event — no 50 ms press-delay from react-native-web's PressResponder.
export default function Touchable({ onPress, style, children, disabled }) {
  const css = rnToCSS(StyleSheet.flatten(style) ?? {});
  return (
    <button
      onClick={disabled ? undefined : onPress}
      disabled={disabled}
      style={{
        // Reset browser button defaults, then apply the RN style on top.
        border: 'none',
        padding: 0,
        margin: 0,
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        background: 'none',
        font: 'inherit',
        textAlign: 'left',
        ...css,
      }}
    >
      {children}
    </button>
  );
}
