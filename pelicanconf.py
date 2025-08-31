#!/usr/bin/env python
# -*- coding: utf-8 -*- #

AUTHOR = 'Xingchen Wang'
SITENAME = 'Xingchen Wang'
SITEURL = ''

PATH = 'content'

TIMEZONE = 'America/New_York'

DEFAULT_LANG = 'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
LINKS = (('Pelican', 'https://getpelican.com/'),
         ('Python.org', 'https://www.python.org/'),
         ('Jinja2', 'https://palletsprojects.com/p/jinja/'),)

# Social widget
SOCIAL = (('LinkedIn', 'https://www.linkedin.com/in/xingchen-wang'),
          ('GitHub', 'https://github.com/Xingchen1224'),)

DEFAULT_PAGINATION = 5

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True

# Theme and appearance
THEME = 'simple'  # Using default simple theme for now
DISPLAY_PAGES_ON_MENU = True
DISPLAY_CATEGORIES_ON_MENU = True

# URL settings to match Jekyll structure
ARTICLE_URL = 'blog/{category}/{slug}/'
ARTICLE_SAVE_AS = 'blog/{category}/{slug}/index.html'
PAGE_URL = '{slug}/'
PAGE_SAVE_AS = '{slug}/index.html'

# Author info
AUTHOR_BIO = "Simplicity is the ultimate sophistication."

# Plugin settings
PLUGIN_PATHS = ['plugins']
PLUGINS = []

# Static paths
STATIC_PATHS = ['images', 'assets']

# Extra path metadata for assets
EXTRA_PATH_METADATA = {
    'assets/images/bio-photo.jpg': {'path': 'assets/images/bio-photo.jpg'},
}

# Menu items
MENUITEMS = (
    ('Posts', '/archives.html'),
    ('About', '/about/'),
)