const interactiveTags = new Set(['A', 'INPUT', 'SELECT', 'TEXTAREA', 'BUTTON']);

export const hasNestedInteractiveTarget = (e: React.SyntheticEvent | undefined): boolean => {
  if (!e) {
    return false;
  }
  const elements = e.nativeEvent.composedPath();

  const clickableElement = elements.find((el) => interactiveTags.has((el as Element).tagName));

  return Boolean(clickableElement);
};
