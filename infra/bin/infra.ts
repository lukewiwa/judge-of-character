#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { OidcStack } from "../lib/oidc-stack";
import { DNSStack } from "../lib/dns-stack";
import { CertificateStack } from "../lib/certificate-stack";
import { InfraStack } from "../lib/infra-stack";

const app = new cdk.App();

const defaultRegion = process.env.CDK_DEFAULT_REGION ?? "ap-southeast-2";

// OIDC Stack - GitHub Actions authentication
new OidcStack(app, "JocOidcStack", {
  githubOrg: "lukewiwa",
  githubRepo: "judge-of-character",
  githubBranches: ["main"],
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: defaultRegion,
  },
});

// DNS Stack - Route53 hosted zone
const dnsStack = new DNSStack(app, "JocDNSStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: defaultRegion,
  },
  crossRegionReferences: true,
});

// Certificate Stack - ACM certificate in us-east-1 (required for CloudFront)
const certificateStack = new CertificateStack(
  app,
  "JocCertificateStack",
  dnsStack.hostedZone,
  {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: "us-east-1",
    },
    crossRegionReferences: true,
  }
);
certificateStack.addDependency(dnsStack);

// Infrastructure Stack - S3, CloudFront, and deployment
const infraStack = new InfraStack(
  app,
  "JocInfraStack",
  certificateStack.certificate,
  dnsStack.hostedZone,
  {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: defaultRegion,
    },
    crossRegionReferences: true,
  }
);
infraStack.addDependency(certificateStack);
infraStack.addDependency(dnsStack);
