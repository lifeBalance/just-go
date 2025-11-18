export const load = async ({ url }: { url: URL }) => {
  return { path: url.pathname }
}
