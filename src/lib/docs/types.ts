export type NavItem = { url: string; title: string }
export type NavGroup = {
  dir: string
  label: string
  href?: string
  items: NavItem[]
}
export type ContentEntry = {
  url: string
  title: string
  isIndex: boolean
}
