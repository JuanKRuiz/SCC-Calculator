import json
import os
import time
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

# Configuración
URL = "https://cloud.google.com/security-command-center/pricing?hl=en"
TEMP_FILE = os.path.join("tmp", "rendered_content.txt")

print(f"🔄 Initializing Selenium WebDriver to fetch: {URL}")

# Setup Chrome Options
chrome_options = Options()
chrome_options.add_argument("--headless")  # Run invisible
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--log-level=3") # Suppress logs

driver = None
try:
    # Initialize Driver
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    driver.get(URL)
    
    # Wait for page (dynamic rendering)
    print("⏳ Waiting for page to render...")
    try:
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.TAG_NAME, "table"))
        )
    except:
        print("⚠️ Timeout waiting for explicit tables, proceeding with body text...")
        
    time.sleep(5) # Generous buffer for any JS injection to complete

    # Extract text
    page_text = driver.find_element(By.TAG_NAME, "body").text
    print("✅ Page rendered and text captured.")

    # Save to temp file
    os.makedirs(os.path.dirname(TEMP_FILE), exist_ok=True)
    
    with open(TEMP_FILE, "w", encoding="utf-8") as f:
        f.write(page_text)

    print(f"\n💾 Rendered content saved to: {TEMP_FILE}")
    print("👉 Now ask the LLM to read this file and extract the prices.")

except Exception as e:
    print(f"❌ Error with Selenium: {e}")

finally:
    if driver:
        try:
            driver.quit()
        except:
            pass
