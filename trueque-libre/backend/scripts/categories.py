from selenium import webdriver
from urllib.parse import urlparse, parse_qs
import time
import os
import requests
import json
from datetime import date, timedelta

URL = "https://auth.mercadolibre.com.ar/authorization"
APP_ID = "6525045342859483"
CLIENT_SECRET = "Ks2B48vyNphGxkXhW0bH6I3Y8dsWDET5"
REDIRECT_URI = "https://localhost:8080"

# EXAMPLE AUTH https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=6525045342859483&redirect_uri=https%3A%2F%2Flocalhost%3A8080
AUTH_URL = f"{URL}?response_type=code&client_id={APP_ID}&redirect_uri={REDIRECT_URI}"

ruta_access_token = os.path.join(f"{os.getcwd()}/trueque-libre/backend/json", 'access_token.json')  # Guardará en el directorio actual
access_token = ''
date_created = ''

with open(ruta_access_token, 'r', encoding='utf-8') as archivo:
    data = json.load(archivo)
    access_token = data['access_token']
    date_created = data['date_created']
print(date.fromisoformat(date_created))
print(date.today())
print(date.fromisoformat(date_created) - date.today())
if(not date_created or not access_token or date.fromisoformat(date_created) - date.today() >= timedelta(days=-1)):
    # Configura el navegador (puedes usar ChromeDriver u otro driver compatible)
    driver = webdriver.Chrome()
    # Abre la página de autorización
    driver.get(AUTH_URL)
    # Espera a que la página se cargue (ajusta el tiempo según sea necesario)
    time.sleep(60)
    # Puedes obtener la URL que contiene el código de autorización
    redirected_url = driver.current_url
    if(redirected_url):
        # Aquí extraes el 'code' de la URL (si todo salió bien)
        parsed_url = urlparse(redirected_url)
        auth_code = parse_qs(parsed_url.query).get('code', [None])[0]

        # Cierra el navegador
        driver.quit()

        data = {
            "grant_type": "authorization_code",
            "client_id": f"{APP_ID}",
            "client_secret": f"{CLIENT_SECRET}",
            "code": auth_code,
            "redirect_uri": f"{REDIRECT_URI}",
        }
        response = requests.post("https://api.mercadolibre.com/oauth/token", data=data)

        access_token = response.json().get("access_token")

        with open(ruta_access_token, 'w', encoding='utf-8') as archivo:
            json.dump({"access_token": access_token, "date_created": date.today().isoformat()}, archivo, ensure_ascii=False, indent=4)

categoriesResponse = requests.get("https://api.mercadolibre.com/sites/MLA/categories/all", headers={ "Authorization": f"Bearer {access_token}", "Content-Type": "application/json"})
categories = categoriesResponse.json()

newCategories = []

for categorie in categories:
    if(newCategories.count(categories[categorie]['name']) == 0):
        newCategories.append(categories[categorie]['name'])

ruta_categories = os.path.join(f"{os.getcwd()}/trueque-libre/backend/json", 'categories.json')  # Guardará en el directorio actual

# Escribir el archivo JSON
with open(ruta_categories, 'w', encoding='utf-8') as archivo:
    json.dump(newCategories, archivo, ensure_ascii=False, indent=4)

