# mapper.bike

Dev Setup:

1. Clone Repo
2. run npm install
3. Create root/config/keys.js for strava communication (See keys_DUMMY.js for format.
4. Ensure AWS credentials file is setup for DynamoDB access.
   https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/setup-credentials.html

'''
[dbuser]
aws_access_key_id =
aws_secret_access_key =
...

setup port forwarding:
iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080
