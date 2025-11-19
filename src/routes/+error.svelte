<script lang="ts">
  import ErrorPage from '$lib/components/svelte-doc/ErrorPage.svelte'
  let { status, error } = $props()
  const is404 = status === 404
  const title = is404 ? 'Page Not Found' : 'Something went wrong'
  const message =
    error?.message ??
    (is404
      ? 'The page you requested does not exist.'
      : 'An unexpected error occurred.')
</script>

<ErrorPage
  {title}
  {message}
  {status}
  homeHref="/"
/>
