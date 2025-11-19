// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  // Allow importing mdsvex files as components

  module '*.md' {
    const component: import('svelte').ComponentType
    export default component
    export const metadata: Record<string, any>
  }
}

export {}
