"""
Django settings for app project.

Generated by 'django-admin startproject' using Django 4.1.3.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""

from datetime import timedelta
import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = bool(int(os.environ.get('DEBUG', 0)))

ALLOWED_HOSTS = []
ALLOWED_HOSTS.extend(
    filter(
        None,
        os.environ.get('DJANGO_ALLOWED_HOSTS', '').split(',')
    )
)
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

CORS_ORIGIN_WHITELIST = []
CORS_ORIGIN_WHITELIST.extend(
    filter(
        None,
        os.environ.get('DJANGO_CORS_ALLOWED_ORIGINS', '').split(',')
    )
)

CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = []
CSRF_TRUSTED_ORIGINS.extend(
    filter(
        None,
        os.environ.get('DJANGO_CORS_ALLOWED_ORIGINS', '').split(',')
    )
)

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = os.environ.get(
    'SOCIAL_AUTH_GOOGLE_OAUTH2_KEY', 'GOOGLE_OAUTH2_KEY')
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = os.environ.get(
    'SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET', 'GOOGLE_OAUTH2_SECRET')

SITE_ID = 1


# Application definition

INSTALLED_APPS = [
    # cors header
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # django_filters
    'django_filters',
    # django-rest-framework
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    # dj-rest-auth
    'dj_rest_auth',
    'dj_rest_auth.registration',
    # django-allauth
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    # drf_spectacular
    'drf_spectacular',
    # django-cleanup
    'django_cleanup.apps.CleanupConfig',
    # django-imagekit
    'imagekit',
    # apps
    'core',
    'user',
    'pet',
    'customer',
    'karte',
]
if DEBUG:
    INSTALLED_APPS += [
        # Dev extensions
        # Seed Data
        'django_seed',
    ]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'app.urls'

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

WSGI_APPLICATION = 'app.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'HOST': os.environ.get('DB_HOST'),
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'TEST': {
            'NAME': 'test_database',
        },
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'ja-jp'

TIME_ZONE = 'Asia/Tokyo'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'core.User'

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAdminUser',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        # 'rest_framework.authentication.TokenAuthentication',
        # 'rest_framework_simplejwt.authentication.JWTAuthentication'
        'dj_rest_auth.jwt_auth.JWTCookieAuthentication',

    ],
    # drfのschemaをdrf-specacularのAutoSchemaに自動変換.
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    # DjangoFilterBackendフィルタ適用
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
}

SIMPLE_JWT = {
    'AUTH_HEADER_TYPES': ('JWT'),
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}

ACCOUNT_AUTHENTICATION_METHOD = 'email'  # 認証方法をメールアドレスにする
ACCOUNT_USER_MODEL_USERNAME_FIELD = 'name'
ACCOUNT_EMAIL_VERIFICATION = 'mandatory'
ACCOUNT_EMAIL_REQUIRED = True  # メールアドレスを要求する
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_USERNAME_REQUIRED = False  # ユーザー名を要求しない
ACCOUNT_CONFIRM_EMAIL_ON_GET = True  # ユーザー登録後メールから確認ボタンを押したら登録済にする
ACCOUNT_EMAIL_CONFIRMATION_EXPIRE_DAYS = 1

# allauth google provider settings
# https://django-allauth.readthedocs.io/en/latest/providers.html
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'offline',
        },
        'OAUTH_PKCE_ENABLED': True,
    }
}
# dj-rest-auth settings
# https://dj-rest-auth.readthedocs.io/en/latest/configuration.html?highlight=USER_DETAILS_SERIALIZER#configuration
REST_USE_JWT = True
JWT_AUTH_COOKIE = 'jwt-token'
JWT_AUTH_REFRESH_COOKIE = "jwt-refresh-token"
JWT_AUTH_COOKIE_USE_CSRF = True
JWT_AUTH_HTTPONLY = False
JWT_AUTH_RETURN_EXPIRATION = True  # ログイン時のレスポンスに有効期限を含める


# allauth設定
# https://django-allauth.readthedocs.io/en/latest/configuration.html
SOCIALACCOUNT_EMAIL_VERIFICATION = "none"
SOCIALACCOUNT_EMAIL_REQUIRED = True


AUTHENTICATION_BACKENDS = [
    'allauth.account.auth_backends.AuthenticationBackend',
    'django.contrib.auth.backends.ModelBackend',
]

# REST_AUTH User 生成用

REST_AUTH_SERIALIZERS = {
    'USER_DETAILS_SERIALIZER': 'user.serializers.UserSerializer',
}


# mail settings
if DEBUG:
    EMAIL_HOST = 'mailcatcher'
    EMAIL_HOST_USER = ''
    EMAIL_HOST_PASSWORD = ''
    EMAIL_PORT = 1025
    EMAIL_USE_TLS = False


SPECTACULAR_SETTINGS = {
    'COMPONENT_SPLIT_REQUEST': True,
}

# image file path settings
STATIC_URL = '/static/static/'
STATIC_ROOT = '/volumes/static'
MEDIA_URL = '/static/media/'
MEDIA_ROOT = '/volumes/media'

# The number of GET/POST parameters exceeded settings.DATA_UPLOAD_MAX_NUMBER_FIELDS error 対策
DATA_UPLOAD_MAX_NUMBER_FIELDS = 4000
