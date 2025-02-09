export async function* streamText(text: string) {
  const words = text.split(" ");
  for (const word of words) {
    yield word + " ";
    await new Promise((resolve) => setTimeout(resolve, 50)); // Simulate network delay
  }
}
