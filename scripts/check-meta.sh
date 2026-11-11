#!/bin/bash
# Fail if any page is missing a description or keywords meta tag
status=0
for f in src/main/webapp/*.html; do
  for tag in description keywords; do
    if ! grep -q "name=\"$tag\"" "$f"; then
      echo "FAIL: $f is missing the $tag meta tag"
      status=1
    fi
  done
done
[ $status -eq 0 ] && echo "All pages have description and keywords"
exit $status
