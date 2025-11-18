export const load = ({ params }: { params: { page?: string } }) => {
  return { segment: params.page ?? '' }
}
