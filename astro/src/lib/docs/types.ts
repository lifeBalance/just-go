export type NavItem = { url: string; title: string; weight: number }
export type NavGroup = {
  dir: string
  label: string
  href?: string
  items: NavItem[]
}
export type ContentEntry = {
  url: string
  dir: string
  title: string
  isIndex: boolean
  mod?: any
}
