export type Post = {
    id: string
    title: string // max 50
    summary: string // max 250
    content: string
    author: string // max 40
    email: string // valid email
    date: string // ISO or YYYY-MM-DD
}
