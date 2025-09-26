import { getPostMetadataSSG } from '@/lib/blog'
import HomeClient from '@/components/HomeClient'

export default async function Home() {
    const ssgPosts = await getPostMetadataSSG('content')

    return <HomeClient ssgPosts={ssgPosts} />
}
