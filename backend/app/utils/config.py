import os
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials

# Load env variables (for other vars)
load_dotenv(override=True)

required_vars = [
    "TYPE",
    "PRIVATE_KEY_ID",  
    "CLIENT_EMAIL",
    "CLIENT_ID",
    "AUTH_URI",
    "TOKEN_URI",
    "AUTH_PROVIDER_X509_CERT_URL",
    "CLIENT_X509_CERT_URL",
    "UNIVERSE_DOMAIN"
]

missing_vars = [var for var in required_vars if not os.getenv(var)]
if missing_vars:
    raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
PROJECT_ID = "university-project-463915"
CLIENT_EMAIL = "university-project@university-project-463915.iam.gserviceaccount.com"

# Hardcoded private key as a multiline string (with real newlines)
PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCm6bEBmjWgZvTY\nQQcOzLN/U+WGBnuE0oFcSy+mjMJUpTqdflxxU5Ybn450cEB2K3+pHvjsGB1GmUkA\nVQ2vSHZ5xBXa/P9GIe4+4cqcF/2OW/Y8vYojQ/v0ac2+8tUaxIX1vl8eVuXxouFR\nJ639E7TSGLUCLXo6RHlCISjIjTv/LI/CQMQDtPcldcXtTZ8X3JPJ403YFOV8NL04\nbFlbB0Gjf/741XE5Fwtwcgpu14HymZmP62oaurOXRBmM1hYjuIntjvjCny3sa9g0\nypsB0056MXmm4qKRkuv44BiLWSGJBzDm2sYWr9CId/m0YbW0PON4dcMB7FU01xNi\nBJe6mY2fAgMBAAECggEAMoTw6kc+i/odiYbFGBmlCpjeE57Kq/z64nBvT72y4+PO\nxfSFDlf6SwoUF/IR0LKBxTJ2rR7vXXrvuYYEylToZxqOcuW4bgW/EpFMvcoVGI2F\nDgVgViQxklyjxXPCRIPO9/5S0+ABYQ2nnOShqMPaKu0HfE0/fXtUKEvZCDqXOjhJ\nTyh1vQh07WzU9xvlVuWpINBZauh9F7ViyOMsw+ER9Anysrp1PyTwV79eBuCK9Kre\n9KOODWY890HZPTmwNw2Oq5mAqj/VZ2GI52C+Lur6+4OeXXMT2KmVTYtnsmuFN/S9\naEi07UBcWWdcZjPWpp4SAhzf4Mvz3Rb513CLYjo1AQKBgQDZiqVQpX4ivjOqatRi\ndNWOYUWpcYTMVLNGBd7p6PRzMmMiIztAEyolSbS1nTGvMvS7sZgE8SJ3okCoW44C\nvuSxfImawMX0o+Uq1zqorFMkHTbbHQ0+Dwl+51TZwxksbvk5DzxRTeJg/b9JyGoZ\n98jrU0FEtJFLqtM0Bj2pEIo8PwKBgQDEa7lUOEtZuNobdXQRmTtd6SOGNei8SAxM\n1ka936VkmYj6Z+NKeXmusvPFYWKwdIIuQJWKoPGquK5cTAlIgTKNUIw0Mg7qnpiJ\nAsmJv+GbE4l9BWayDS23uiLzO9gzAUAGcD3nrC/B6PAORNwHzbzNPnaY3dn4cDfs\nLnj/C3PWoQKBgQCvyYd4uaJJtOTPCvCAduSy3wuJtr+W1cLgDJJq9eHCzK6qwUl5\np4LhCsRKFbI2XrjAiuvK4of1oFkbMpB4y4TFn1sagDf2ThI7Ihy2fDna7viK6tju\nkvwbXheEuFC5RRuC7jrRgFw0ABf5KUgDn+TttCMDv93BBVMRsRFWcpUhxQKBgHR2\nEtrWzgaSze9+AqX0nvidpUyMZkRMy847NpKaKmythEREmMWtpPJqdJNRnLxXOGDI\nNmKN7vx0qB1dkBuHTzvuyFKiY6nFA1gpaOnd9ZyHRvvz2eI0YikPmm1xzEzhrt6i\nanIU6/Qjc0JinbuaxxlCsfsNf5IIp3/IRkGivrpBAoGAD/cxp2yDoQwfyRV1gGGs\nqaO1e4m1u3JBrBBs2mU/DdPlNuWHCxfs0Q8FMkhfxbJ2zoWfO5SyHsQW5JI1Kb3M\nStVo0NunNb/96NaYF8v4Ir2tqVamaZ6PIFfBUp/A6/wz48K2z8B5sXi9KeV4FD4v\nfINxmhcYqbrlDEfdFDu1VBg=\n-----END PRIVATE KEY-----\n"

service_account_info = {
    "type": os.getenv("TYPE"),
    "project_id": PROJECT_ID,
    "private_key_id": os.getenv("PRIVATE_KEY_ID"),
    "private_key": PRIVATE_KEY,
    "client_email": CLIENT_EMAIL,
    "client_id": os.getenv("CLIENT_ID"),
    "auth_uri": os.getenv("AUTH_URI"),
    "token_uri": os.getenv("TOKEN_URI"),
    "auth_provider_x509_cert_url": os.getenv("AUTH_PROVIDER_X509_CERT_URL"),
    "client_x509_cert_url": os.getenv("CLIENT_X509_CERT_URL"),
    "universe_domain": os.getenv("UNIVERSE_DOMAIN")
}

cred = Credentials.from_service_account_info(service_account_info, scopes=SCOPES)

GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1kcXWeXgPmnQaRsKrYSl4NXOBJby5bg12-1t3Om5xWG8/edit?gid=120320431#gid=120320431"
SHEET_ID = "1kcXWeXgPmnQaRsKrYSl4NXOBJby5bg12-1t3Om5xWG8"
