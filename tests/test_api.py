import os

from dotenv import load_dotenv
from openai import OpenAI


# Load environment variables
load_dotenv()


# Get OpenRouter API key
api_key = os.getenv("OPENROUTER_API_KEY")

if not api_key:
    raise ValueError("OPENROUTER_API_KEY not found in .env")


# Connect to OpenRouter
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=api_key
)


# NVIDIA model
MODEL = "nvidia/nemotron-3-ultra-550b-a55b:free"


# Send a test message
response = client.chat.completions.create(
    model=MODEL,
    messages=[
        {
         "role": "user",
            "content": "Write exactly ONE complete sentence introducing SwarmSentriAI. Make sure the sentence ends with a period."
        }
    ],
      temperature=0.2,
    max_tokens=200
)


# Display response
print("\nAI Response:")
print(response.choices[0].message.content)