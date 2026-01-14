import {
  aws_iam as iam,
  CfnOutput,
  Duration,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { Construct } from "constructs";

interface OidcStackProps extends StackProps {
  githubOrg?: string;
  githubRepo?: string;
  githubBranches?: string[];
}

export class OidcStack extends Stack {
  constructor(scope: Construct, id: string, props?: OidcStackProps) {
    super(scope, id, props);

    const githubOrg = props?.githubOrg ?? "lukewiwa";
    const githubRepo = props?.githubRepo ?? "judge-of-character";
    const githubBranches = props?.githubBranches ?? ["main"];

    const provider = new iam.OpenIdConnectProvider(this, "GithubOIDCProvider", {
      url: "https://token.actions.githubusercontent.com",
      clientIds: ["sts.amazonaws.com"],
    });

    const conditions: iam.Conditions = {
      StringEquals: {
        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
      },
      StringLike: {
        "token.actions.githubusercontent.com:sub": githubBranches.map(
          (branch) => `repo:${githubOrg}/${githubRepo}:ref:refs/heads/${branch}`
        ),
      },
    };

    const role = new iam.Role(this, "GitHubActionsDeployRole", {
      roleName: "GitHubActionsJocDeployRole",
      maxSessionDuration: Duration.hours(1),
      assumedBy: new iam.FederatedPrincipal(
        provider.openIdConnectProviderArn,
        conditions,
        "sts:AssumeRoleWithWebIdentity"
      ),
      // TODO: Restrict to specific permissions in production
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"),
      ],
    });

    new CfnOutput(this, "RoleArn", {
      value: role.roleArn,
      description: "ARN of the IAM role for GitHub Actions",
    });
  }
}
