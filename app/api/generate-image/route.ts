import { NextResponse } from 'next/server';
import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';

export async function POST(request: Request) {
    const { tweetText, author } = await request.json();

    // Create a larger canvas for higher resolution
    const scale = 3; // 3x resolution
    const canvasSize = 500 * scale;
    const canvas = createCanvas(canvasSize, canvasSize);
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return NextResponse.json({ error: 'Failed to get canvas context' }, { status: 500 });
    }

    // Scale all drawing operations
    ctx.scale(scale, scale);

    // Set background
    ctx.fillStyle = '#f7f9f9';  // Light gray background
    ctx.fillRect(0, 0, 500, 500);

    // Add a decorative element (rounded rectangle at the top)
    ctx.fillStyle = '#9bd7ff';  // X.com blue
    roundRect(ctx, 20, 20, 460, 460, 20);

    // Add white background for content
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, 25, 25, 450, 450, 15);

    // Add author name and username
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#27292b';
    ctx.fillText(author || 'Unknown Author', 40, 60);

    // Add tweet text
    ctx.font = '20px Arial';
    ctx.fillStyle = '#14171A';
    wrapText(ctx, tweetText, 40, 100, 420, 30);

    // Add X.com logo (you might want to replace this with an actual logo image)
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#657786';  // X.com light gray
    ctx.fillText('Posted on X.com', 40, 460);

    const buffer = canvas.toBuffer('image/png');

    return new NextResponse(buffer, {
        headers: { 'Content-Type': 'image/png' },
    });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, currentY);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    ctx.fill();
}