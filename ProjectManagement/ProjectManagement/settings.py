import os
from pathlib import Path
import dj_database_url
from corsheaders.defaults import default_headers

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = "*hzb_c_mghc*gil_g@2t7=#)spc--!)b2bu^!4@0m%4$kl=wng"

DEBUG = False

ALLOWED_HOSTS = [
    'projectmanagement-1ylk.onrender.com',
    'projectmanagement-tyik.onrender.com',
]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'TaskManagement',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'ProjectManagement.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'ProjectManagement.wsgi.application'

# DATABASE_URL = os.environ.get("DATABASE_URL")

# DATABASES = {
#     'default': dj_database_url.config(
#         default=DATABASE_URL,
#         conn_max_age=600
#     )
# }
DATABASES = {} 
DATABASES["default"]=dj_database_url.parse("postgresql://taskmanagement_x8zn_user:PULPbL6RoncFMIzcQhhuvRwL4S6Ly2jv@dpg-d2a2jler433s73a11dng-a.frankfurt-postgres.render.com/taskmanagement_x8zn")

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# ✅ CORS configuration
CORS_ALLOWED_ORIGINS = [
    "https://projectmanagement-gc4a.vercel.app",
]

CORS_ALLOW_HEADERS = list(default_headers) + [
    'content-type',
]

# Optionally for testing (remember to remove for production)
# CORS_ALLOW_ALL_ORIGINS = True
