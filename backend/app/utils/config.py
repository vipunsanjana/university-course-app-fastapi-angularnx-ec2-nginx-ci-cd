import os
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials

# Load env variables (for other vars)
load_dotenv(override=True)

required_vars = [
    "SHEET_ID",
    "GOOGLE_SHEET_URL",
    "TYPE",
    "PROJECT_ID",
    "PRIVATE_KEY_ID",
    # "PRIVATE_KEY",  
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

# Hardcoded private key as a multiline string (with real newlines)
HARDCODED_PRIVATE_KEY = """-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCm6bEBmjWgZvTY
QQcOzLN/U+WGBnuE0oFcSy+mjMJUpTqdflxxU5Ybn450cEB2K3+pHvjsGB1GmUkA
VQ2vSHZ5xBXa/P9GIe4+4cqcF/2OW/Y8vYojQ/v0ac2+8tUaxIX1vl8eVuXxouFR
J639E7TSGLUCLXo6RHlCISjIjTv/LI/CQMQDtPcldcXtTZ8X3JPJ403YFOV8NL04
bFlbB0Gjf/741XE5Fwtwcgpu14HymZmP62oaurOXRBmM1hYjuIntjvjCny3sa9g0
ypsB0056MXmm4qKRkuv44BiLWSGJBzDm2sYWr9CId/m0YbW0PON4dcMB7FU01xNi
BJe6mY2fAgMBAAECggEAMoTw6kc+i/odiYbFGBmlCpjeE57Kq/z64nBvT72y4+PO
xfSFDlf6SwoUF/IR0LKBxTJ2rR7vXXrvuYYEylToZxqOcuW4bgW/EpFMvcoVGI2F
DgVgViQxklyjxXPCRIPO9/5S0+ABYQ2nnOShqMPaKu0HfE0/fXtUKEvZCDqXOjhJ
Tyh1vQh07WzU9xvlVuWpINBZauh9F7ViyOMsw+ER9Anysrp1PyTwV79eBuCK9Kre
9KOODWY890HZPTmwNw2Oq5mAqj/VZ2GI52C+Lur6+4OeXXMT2KmVTYtnsmuFN/S9
aEi07UBcWWdcZjPWpp4SAhzf4Mvz3Rb513CLYjo1AQKBgQDZiqVQpX4ivjOqatRi
dNWOYUWpcYTMVLNGBd7p6PRzMmMiIztAEyolSbS1nTGvMvS7sZgE8SJ3okCoW44C
vuSxfImawMX0o+Uq1zqorFMkHTbbHQ0+Dwl+51TZwxksbvk5DzxRTeJg/b9JyGoZ
98jrU0FEtJFLqtM0Bj2pEIo8PwKBgQDEa7lUOEtZuNobdXQRmTtd6SOGNei8SAxM
1ka936VkmYj6Z+NKeXmusvPFYWKwdIIuQJWKoPGquK5cTAlIgTKNUIw0Mg7qnpiJ
AsmJv+GbE4l9BWayDS23uiLzO9gzAUAGcD3nrC/B6PAORNwHzbzNPnaY3dn4cDfs
Lnj/C3PWoQKBgQCvyYd4uaJJtOTPCvCAduSy3wuJtr+W1cLgDJJq9eHCzK6qwUl5
p4LhCsRKFbI2XrjAiuvK4of1oFkbMpB4y4TFn1sagDf2ThI7Ihy2fDna7viK6tju
kvwbXheEuFC5RRuC7jrRgFw0ABf5KUgDn+TttCMDv93BBVMRsRFWcpUhxQKBgHR2
EtrWzgaSze9+AqX0nvidpUyMZkRMy847NpKaKmythEREmMWtpPJqdJNRnLxXOGDI
NmKN7vx0qB1dkBuHTzvuyFKiY6nFA1gpaOnd9ZyHRvvz2eI0YikPmm1xzEzhrt6i
anIU6/Qjc0JinbuaxxlCsfsNf5IIp3/IRkGivrpBAoGAD/cxp2yDoQwfyRV1gGGs
qaO1e4m1u3JBrBBs2mU/DdPlNuWHCxfs0Q8FMkhfxbJ2zoWfO5SyHsQW5JI1Kb3M
StVo0NunNb/96NaYF8v4Ir2tqVamaZ6PIFfBUp/A6/wz48K2z8B5sXi9KeV4FD4v
fINxmhcYqbrlDEfdFDu1VBg=
-----END PRIVATE KEY-----
"""

service_account_info = {
    "type": os.getenv("TYPE"),
    "project_id": os.getenv("PROJECT_ID"),
    "private_key_id": os.getenv("PRIVATE_KEY_ID"),
    "private_key": HARDCODED_PRIVATE_KEY,
    "client_email": os.getenv("CLIENT_EMAIL"),
    "client_id": os.getenv("CLIENT_ID"),
    "auth_uri": os.getenv("AUTH_URI"),
    "token_uri": os.getenv("TOKEN_URI"),
    "auth_provider_x509_cert_url": os.getenv("AUTH_PROVIDER_X509_CERT_URL"),
    "client_x509_cert_url": os.getenv("CLIENT_X509_CERT_URL"),
    "universe_domain": os.getenv("UNIVERSE_DOMAIN")
}

cred = Credentials.from_service_account_info(service_account_info, scopes=SCOPES)

GOOGLE_SHEET_URL = os.getenv("GOOGLE_SHEET_URL").replace("\\n", "\n")
SHEET_ID = os.getenv("SHEET_ID")
