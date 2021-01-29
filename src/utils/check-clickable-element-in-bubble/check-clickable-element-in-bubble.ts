export const checkClickableElementInBubble = (
  e: React.SyntheticEvent<Element, Event> | undefined,
): boolean => {
  let hasClickable = false;
  if (!e) {
    return hasClickable;
  }
  const interactiveTags = ['A', 'INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'];
  const elements = e.nativeEvent.composedPath();

  hasClickable = elements.some((el) =>
    interactiveTags.some((tag) => tag === (el as Element).tagName),
  );

  return hasClickable;
};
