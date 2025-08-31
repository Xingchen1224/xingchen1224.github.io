#!/bin/bash
# Run Pelican development server
docker run --rm --volume="$PWD:/app" -p 8000:8000 pelican-blog pelican --listen --autoreload