# eKYC Interoperability Standard Helper Services

This service is create to help developer getting start integrate with eKYCIS standard implementation including:

- Generate and verify request token
- Generate and verify fetch signature
- Convert attestation from and to various tier of eKYC standard template through obfuscation

## Elliptic Curve Keypair and DNS-TXT

eKYCIS relies on JWT token as mean of generating session request token, authorization token and fetch signature. To be able to allows token receiver to verify the authenticy and integrity of the token, the Elliptic Curve Digital Signature Algorithm with the P-256 curve and the SHA-256 hash function is selected. This mechanism rely heavily on private-public keypairs which is required to be generated per organization.

To generate Elliptic Curve key pair

```bash
openssl ecparam -name prime256v1 -genkey -noout -out /path/to/your/private_key.pem
openssl ec -in /path/to/your/private_key.pem -pubout > /path/to/your/public_key.pem
```

To generate DNS-TXT record for your token issuer

```bash
echo "ekyc_jwt pub=$(base64 -w0 /path/to/your/public_key.pem)" > /path/to/your/output.txt
```

Add the output to DNS setting of your issuer domain

`TXT   sub.example.com    "OUTPUT_OF_DNS_TXT_RECORD"`

You can add multiple keys into domain for flexibility over the keys rotation.

## Helper Service

To get start please create environment variables as state in `.env.example`

`npm install` & `npm start`

To test the service, please import `eKYCIS-Helper-SVC.postman_collection.json` the sample postman collection into your postman.

If you have any questions, please contact `sereyvathana.tum@techostartup.center`
