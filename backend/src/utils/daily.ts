import axios from 'axios';

export const createDailyRoom = async (bookingId: string, durationMinutes: number) => {
  try {
    const apiKey = process.env.DAILY_API_KEY;
    if (!apiKey) {
      console.warn('DAILY_API_KEY not set. Falling back to mock video URL.');
      return `https://mentroo.daily.co/mock-${bookingId}`;
    }

    const exp = Math.floor(Date.now() / 1000) + (durationMinutes * 60) + 3600; // Expires 1 hour after duration

    const response = await axios.post(
      'https://api.daily.co/v1/rooms',
      {
        name: `booking-${bookingId}`,
        properties: {
          exp,
          enable_chat: true,
          enable_screenshare: true,
          start_audio_off: true,
          start_video_off: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.url;
  } catch (error) {
    console.error('Error creating Daily.co room:', error);
    // Fallback to ensure app doesn't break if API fails
    return `https://mentroo.daily.co/mock-${bookingId}`;
  }
};
