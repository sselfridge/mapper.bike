
#!/bin/bash

function localtunnel {
lt -s justtryingtotestmydamnmap --port 3000
}

until localtunnel; do
echo "localtunnel  server crashed"
sleep 2
done