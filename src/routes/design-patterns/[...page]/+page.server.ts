export const load = ({ params }: { params: { page?: string } }) => {
  return { pageParam: params.page ?? '' }
}
