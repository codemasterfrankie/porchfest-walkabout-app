import requests

res = requests.get('https://www.porchfest.org/') // sends a GET request to url
print(res.status_code) // http status code, 200 == success
