# AWS-Lambda-Warmup
AWS Lambdaで発生するコールドスタートを軽減させる為の対策を実施します。

## Prerequisites
* Python3.6
* Node.js 8.10+

## Installation
```sh
$ pip install awscli
$ pip install aws-sam-cli
$ npm install
```

## Configs
変数をプロジェクトに合わせて修正します。

### package.json
```
$ aws s3 mb s3://${bucket-name} --region ${region}
$ sam package --template-file warmup.sam.yml --s3-bucket ${bucket-name} --output-template-file packaged.yml
$ sam deploy --template-file packaged.yml --stack-name ${stack-name} --capabilities CAPABILITY_IAM
```

## Usage
```
$ npm run init
$ npm run deploy
```