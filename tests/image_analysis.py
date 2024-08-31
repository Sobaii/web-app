import base64
import os
from pdf2image import convert_from_path
import json
from openai import OpenAI
from config import OPENAI_API_KEY
from io import BytesIO

# Set up OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

def encode_image(image):
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode('utf-8')

def analyze_receipt(image):
    base64_image = encode_image(image)
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Extract from this receipt: total, subtotal, total_tax, company_name, date_of_transaction. Return as JSON. Use null for missing/zero values. Include confidence (0-1) for each. Ensure number values are numbers, not strings. Example format: {\"total\":{\"value\":10.99,\"confidence\":0.9},\"subtotal\":{\"value\":null,\"confidence\":0}}. No additional text."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/png;base64,{base64_image}",
                            "detail": "high"
                        }
                    }
                ]
            }
        ],
        max_tokens=300
    )
    
    return response.choices[0].message.content

# Path to your PDF file
pdf_path = "receipts.pdf"

# Convert PDF to images
images = convert_from_path(pdf_path)

results = []

# Process each page
for i, image in enumerate(images):
    print(f"Processing page {i+1}/{len(images)}")
    result = analyze_receipt(image)
    try:
        # Strip code block markers if present
        result = result.strip().lstrip('```json').rstrip('```')
        result_dict = json.loads(result)
        result_dict['page_number'] = i + 1
        results.append(result_dict)
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON for page {i+1}. Error: {str(e)}. Raw result: {result}")

# Save results to a JSON file
with open('receipt_analysis_results.json', 'w') as f:
    json.dump(results, f, indent=2)

print("Analysis complete. Results saved to receipt_analysis_results.json")