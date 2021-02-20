#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { JocInfraStack } from "../lib/joc-infra-stack";

const app = new cdk.App();
new JocInfraStack(app, "JocInfraStack");
