# mapper.bike

Dev Setup:

1. Clone Repo
2. run npm install
3. Create root/config/keys.js for strava communication (See keys_DUMMY.js for format.
4. Ensure AWS credentials file is setup for DynamoDB access.
   https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/setup-credentials.html
   a. AWS only required for KOM mapper    
5. Dev mode (unix) (use 2 terminals)
   * `npm run dev`
   * `npm run server`
6. For Windows machines:
   * `npm run windev`
   * `npm run winserver`

Will run server on port 3000 and UI dev server on 8080

access on localhost:8080


Aws cred file syntax
```
[dbuser]
aws_access_key_id =
aws_secret_access_key =
```

DynamoDB Setup:

4 tables:
* activities - list of activities to be scanned
* segmentDetails - detail of a segment
   * hasLine-index (string)
* segmentEfforts - a top 10 effort on a segment for an athlete
   * athleteId-rank-index (string)
* users

Deploy to ec2:
* cd to repo
* run pull.sh

pm2 start command:
`pm2 start ecosystem.config.js --env production`

setup port forwarding on ec2:
iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080
iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 8443

