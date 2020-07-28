type LengthParams = {
  input?: string;
  length: number;
  message: string;
};

export const minLength = (params: LengthParams): string | undefined => {
  const { length, input, message } = params;
  if (!input) {
    return undefined;
  }
  return input.length > length ? undefined : message;
};
