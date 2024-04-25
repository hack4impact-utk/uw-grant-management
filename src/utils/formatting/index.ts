export function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function camelCaseToTitleCase(camelCase: string): string {
  if (camelCase === '') return camelCase;

  return camelCase
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str: string) => str.toUpperCase())
    .trim();
}
