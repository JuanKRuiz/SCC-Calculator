---
description: Update the SCC pricing data by scraping the official Google Cloud pricing page using Selenium and LLM analysis.
---

1. Install necessary Python dependencies (if not already installed).
// turbo
python -m pip install -r scripts/requirements.txt

2. Run the scraping script to capture the rendered pricing page.
// turbo
python scripts/update_prices.py

3. Read the captured content to extract the latest prices.
// turbo
view_file tmp/rendered_content.txt

4. Update `src/data/scc_rates.json` with the extracted data.
   - Look for specific pricing tables for "Project-level" (PAYG) and "Organization-level".
   - Update `rates.project` and `rates.org` accordingly.
   - **CRITICAL:** The JSON structure and key names MUST remain identical. Do NOT change key names or nesting structure, as the application logic depends entirely on this specific format. Only update the numeric values and the `lastUpdated` string.
   - Ensure `lastUpdated` field is set to the current date.
   - Ensure strict accuracy with the scraped text.
   - IF specific rates are missing in the text, keep the existing values.
