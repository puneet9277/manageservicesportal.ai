// awsApi.js

export async function invokeAwsService({ accountId, region, service }) {
  const url = 'https://dwjl79az0c.execute-api.ap-south-1.amazonaws.com/UAT/invoke-service';
  const payload = { accountId, region, service };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    // You can customize error handling/logging here
    return { error: error.message };
  }
} 