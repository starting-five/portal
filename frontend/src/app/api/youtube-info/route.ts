import { NextRequest, NextResponse } from 'next/server';

// Helper to extract YouTube video ID from various URL formats
function getYouTubeVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    
    // Handle youtu.be short links
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }
    
    // Handle youtube.com/watch?v=VIDEO_ID
    if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.has('v')) {
      return urlObj.searchParams.get('v');
    }
    
    // Handle youtube.com/embed/VIDEO_ID
    if (urlObj.hostname.includes('youtube.com') && urlObj.pathname.startsWith('/embed/')) {
      return urlObj.pathname.split('/embed/')[1];
    }
  } catch (e) {
    // Invalid URL
  }
  
  return null;
}

// Parse dimensions from YouTube's embedHtml
function parseEmbedDimensions(embedHtml: string): { width: number; height: number } | null {
  const widthMatch = embedHtml.match(/width="(\d+)"/);
  const heightMatch = embedHtml.match(/height="(\d+)"/);
  
  if (widthMatch && heightMatch) {
    return {
      width: parseInt(widthMatch[1]),
      height: parseInt(heightMatch[1])
    };
  }
  
  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 });
  }
  
  const videoId = getYouTubeVideoId(url);
  
  if (!videoId) {
    return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
  }
  
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: 'YouTube API key not configured' }, { status: 500 });
  }
  
  try {
    // Call YouTube Data API
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=player,snippet`
    );
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }
    
    const video = data.items[0];
    
    // Extract dimensions from embedHtml
    let aspectRatio = 16/9; // Default fallback
    
    if (video.player?.embedHtml) {
      const dimensions = parseEmbedDimensions(video.player.embedHtml);
      if (dimensions) {
        aspectRatio = dimensions.width / dimensions.height;
      }
    }
    
    return NextResponse.json({
      videoId,
      title: video.snippet?.title || 'Unknown Video',
      aspectRatio,
      embedUrl: `https://www.youtube.com/embed/${videoId}`
    });
    
  } catch (error) {
    console.error('YouTube API error:', error);
    return NextResponse.json({ error: 'Failed to fetch video info' }, { status: 500 });
  }
}