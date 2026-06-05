export function sortByDate(items) {
  if (!items) return [];
  return [...items].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}
