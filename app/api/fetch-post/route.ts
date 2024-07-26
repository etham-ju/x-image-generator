import { NextResponse } from 'next/server';
import axios from 'axios';

interface OEmbedResponse {
    url: string;
    author_name: string;
    author_url: string;
    html: string;
    width: number;
    height: number;
    type: string;
    cache_age: string;
    provider_name: string;
    provider_url: string;
    version: string;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const tweetUrl = searchParams.get('url');

    if (!tweetUrl) {
        return NextResponse.json({ error: 'Invalid URL provided' }, { status: 400 });
    }

    try {
        console.log(`Fetching oEmbed data for URL: ${tweetUrl}`);
        const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(tweetUrl)}`;
        const response = await axios.get<OEmbedResponse>(oembedUrl);

        console.log('oEmbed Response:', response.data);

        if (response.data && response.data.html) {
            const tweetText = response.data.html.replace(/<[^>]*>/g, '').trim();
            const author = response.data.author_name;

            console.log('Extracted tweet text:', tweetText);
            console.log('Author:', author);

            return NextResponse.json({ tweetText, author });
        } else {
            console.log('No tweet data found in oEmbed response');
            return NextResponse.json({ error: 'Failed to extract tweet data' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error fetching post:', error);
        if (axios.isAxiosError(error)) {
            console.error('Axios error details:', error.response?.data);
        }
        return NextResponse.json({ error: 'Failed to fetch post data' }, { status: 500 });
    }
}