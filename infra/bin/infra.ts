#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { InfraStack } from '../lib/infra-stack';
import { CertificateStack } from '../lib/certificate-stack';

const app = new cdk.App();

const certificateStack = new CertificateStack(app, "JocCertificateStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "us-east-1",
  },
  crossRegionReferences: true,
});

new InfraStack(app, 'JocInfraStack', certificateStack.certificate, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  },
  crossRegionReferences: true,
}).addDependency(certificateStack);
