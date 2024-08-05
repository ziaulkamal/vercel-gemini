import axios from 'axios';

export async function GET(req) {
  // Ambil query parameter dari URL
  const url = new URL(req.url);
  const key = url.searchParams.get('key');

  if (!key) {
    return new Response(JSON.stringify({ error: 'Query parameter "key" is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: [
          {
            parts: [
              {
                text: `Create a comprehensive article on ${key} in English with a professional tone, including headings from H1 to H6 based on the context of each paragraph. Structure the article as follows: H1 for the title, H2 for introduction and overview, H3 for detailed explanation of key aspects or benefits, H4 for specific strategies or techniques, H5 for in-depth analysis or examples, and H6 for additional tips or advanced techniques. Include a comparison table with pros and cons for different time management techniques. Each paragraph should contain approximately 2000 words, with a total of 20 paragraphs. Ensure at least 3 outbound links to reputable sources. Provide the article in HTML format, not Markdown, with proper headings, images (including H2 headings, alt tags, and paragraphs), and ensure rich and informative content. Format the content in JSON with title attribute, body attribute, and keywords attribute.`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 1,
          topP: 1,
          maxOutputTokens: 6000,
          stopSequences: []
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
        },
        timeout: 60000 // 60 detik
      }
    );

    // Debugging output
    // Uncomment the following line to see the response structure
    // console.log('API Response:', response.data);

    const result = response.data;

    // Safely access the content
    const content = result.candidates?.[0]?.content?.parts?.[0]?.text || 'No content found';

    return new Response(JSON.stringify({ content }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
