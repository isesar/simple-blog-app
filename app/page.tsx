import HomeClient from '@/components/HomeClient'
import { getPostListSSG } from '@/lib/blog'

export default async function Home() {
    const ssgPosts = await getPostListSSG('content')
    return <HomeClient ssgPosts={ssgPosts} />
}
