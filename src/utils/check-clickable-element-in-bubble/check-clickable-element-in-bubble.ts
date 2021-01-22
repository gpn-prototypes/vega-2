export const checkClickableElementInBubble = (
  e: React.SyntheticEvent<Element, Event> | undefined,
): boolean => {
  let hasClickable = false;
  if (!e) {
    return hasClickable;
  }
  const interactiveTags = ['A', 'INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'];
  const elements = e.nativeEvent.composedPath();

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < elements.length; i++) {
    hasClickable = interactiveTags.some((tag) => tag === (elements[i] as Element).tagName);
    if (hasClickable) {
      break;
    }
  }

  return hasClickable;
};
