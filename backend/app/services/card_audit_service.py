from __future__ import annotations

import base64
from openai import OpenAI

client = OpenAI()


def analyze_product_card(image_bytes: bytes, filename: str = "card.jpg") -> dict:
    image_b64 = base64.b64encode(image_bytes).decode("utf-8")

    prompt = """
Ты эксперт по маркетплейсам, инфографике и продажам карточек товаров.

Проанализируй изображение карточки товара.
Дай ответ строго JSON:

{
  "score": 0-100,
  "summary": "краткий вывод",
  "pros": ["плюс 1", "плюс 2", "плюс 3"],
  "cons": ["минус 1", "минус 2", "минус 3"],
  "recommendations": ["что улучшить 1", "что улучшить 2", "что улучшить 3"],
  "sales_verdict": "будет ли такая карточка продавать и почему"
}

Оценивай:
- виден ли товар
- читаемость текста
- доверие
- дизайн
- композицию
- преимущества товара
- соответствие маркетплейсу
- вероятность клика и покупки
"""

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=[
            {
                "role": "user",
                "content": [
                    {"type": "input_text", "text": prompt},
                    {
                        "type": "input_image",
                        "image_url": f"data:image/jpeg;base64,{image_b64}",
                    },
                ],
            }
        ],
    )

    text = response.output_text

    return {
        "raw": text
    }
