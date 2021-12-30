#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { JocInfraStack } from "../lib/joc-infra-stack";

const app = new cdk.App();
new JocInfraStack(app, "JocInfraStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
