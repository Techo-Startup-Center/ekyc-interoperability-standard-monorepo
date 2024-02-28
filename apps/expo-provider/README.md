https://www.nativewind.dev/quick-starts/expo


https://github.com/margelo/react-native-quick-crypto

Error with packaging

``
./android/app/build.gradle
packagingOptions {
    pickFirst '**/libcrypto.so'
}


npx expo run:android

https://mattermost.com/blog/custom-deep-links-for-react-native-apps/

npx uri-scheme open exp://localhost:8081/--/scan --android

npx uri-scheme open ekycis://qr-scan?qr=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJxcl90eXBlIjoiZWt5Y19pbnRlcm9wIiwidGVtcGxhdGUiOiJUM19LWUMiLCJqdGkiOiIxNzA4NjUyODcxLTFjY2I3YzhiLTcwYWQtNGQ3MS1iM2M1LTNmNjlhNTNhMGJkZCIsImV4Y2hhbmdlX21vZGUiOiJESVJFQ1RfQVBJX1BPU1QiLCJjYWxsYmFjayI6Imh0dHBzOi8vaWRwLXByb3ZpZGVyLWRlbW8uc3ZhdGhhbmEuY29tL2FwaS92MS9yZXF1ZXN0L2NhbGxiYWNrIiwiaXNzIjoiaWRwLXByb3ZpZGVyLWRlbW8uc3ZhdGhhbmEuY29tIiwiaWF0IjoxNzA4NjUyODcxLCJleHAiOjE3MDg2NTY0NzF9.4XJlxyNyvhU_O6pOSHBa9Tmdud5uVNXgQQQeEB1x2OtipPYMJx4Z4un2Y39vejg2ttunYouSNeUyhzCWPO6vCA --android