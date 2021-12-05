export JEKYLL_VERSION=4.2.0
docker run --rm --volume="$PWD:/srv/jekyll" -p 4001:4000 jekyll/jekyll:$JEKYLL_VERSION jekyll serve