import {NextResponse} from 'next/server';
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

            const tweetText = extractTextFromPTags(response.data.html);
            const author = response.data.author_name;
            const userId = extractUserId(response.data.html);
            const dateTime = extractDateFromHTML(response.data.html);

            console.log('Extracted tweet text:', tweetText);
            console.log('Author:', author);
            console.log('userId:', userId);
            console.log('dateTime:', dateTime);

            return NextResponse.json({ tweetText, author, userId, dateTime });
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

function removeAnchorTags(html: string): string {
    // <a> 태그 내부의 모든 내용을 삭제합니다.
    return html.replace(/<a[^>]*>.*?<\/a>/gi, '');
}

function extractTextFromPTags(html: string): string {
    // Step 1: <a> 태그를 먼저 제거합니다.
    const cleanedHtml = removeAnchorTags(html);
    console.log("After removing <a> tags:", cleanedHtml);

    // Step 2: <br> 태그를 \n으로 바꿉니다.
    const htmlWithNewLines = cleanedHtml.replace(/<br\s*\/?>/gi, '\n');
    console.log("After replacing <br> tags with newlines:", htmlWithNewLines);

    // Step 3: <p> 태그를 찾고 텍스트를 추출합니다.
    // 개행 문자를 포함하도록 정규 표현식을 조정합니다.
    const pTagRegex = /<p[^>]*>((.|[\r\n])*?)<\/p>/gi;
    let match = pTagRegex.exec(htmlWithNewLines);
    let extractedText = "";

    while (match !== null) {
        // <p> 태그 내부의 텍스트를 추출합니다.
        extractedText += match[1] + " ";
        match = pTagRegex.exec(htmlWithNewLines);
    }

    console.log("Extracted text from <p> tags:", extractedText);

    // Step 4: 나머지 태그들을 제거합니다.
    const cleanText = extractedText.replace(/<[^>]*>/g, '').trim();
    console.log("Final clean text:", cleanText);

    return cleanText;
}

function extractUserId(html: string): string | null {
    // RegEx to find the userId in the format: "(@userId)"
    const userIdRegex = /\(@(\w+)\)/;
    const match = userIdRegex.exec(html);
    return match ? `@${match[1]}` : null;
}

function extractDateFromHTML(html: string): string | null {
    // RegEx to find the date in the format: "Month DD, YYYY"
    const dateRegex = /<a[^>]*>([A-Za-z]+ \d{1,2}, \d{4})<\/a>/;
    const match = dateRegex.exec(html);
    return match ? match[1] : null;
}