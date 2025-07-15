// awsApi.js

export async function invokeAwsService({ aws_account_id, region, service }) {
  const url = 'https://dwjl79az0c.execute-api.ap-south-1.amazonaws.com/UAT/invoke-service';
  const payload = { aws_account_id, region, service };
  console.log('invokeAwsService called with:', payload);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    console.log('Fetch response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Parsed JSON response:', data);
    return data;
  } catch (error) {
    console.error('invokeAwsService error:', error);
    return { error: error.message };
  }
} 