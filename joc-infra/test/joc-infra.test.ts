import {
  expect as expectCDK,
  matchTemplate,
  MatchStyle,
} from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as JocInfra from "../lib/joc-infra-stack";

test("Empty Stack", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new JocInfra.JocInfraStack(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(matchTemplate({ Resources: {} }, MatchStyle.EXACT));
});
