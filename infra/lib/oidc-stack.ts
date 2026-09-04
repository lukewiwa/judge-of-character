import { Stack, StackProps, CfnOutput, Duration } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export interface OidcStackProps extends StackProps {
  /**
   * GitHub organization or username
   */
  readonly githubOrg: string;

  /**
   * GitHub repository name
   */
  readonly githubRepo: string;

  /**
   * GitHub branches that can assume the role
   * @default - ["master"]
   */
  readonly githubBranches?: string[];
}

export class OidcStack extends Stack {
  public readonly deployRole: iam.Role;

  constructor(scope: Construct, id: string, props: OidcStackProps) {
    super(scope, id, props);

    const { githubOrg, githubRepo } = props;
    const githubBranches = props.githubBranches ?? ["master"];

    const githubProvider = new iam.OpenIdConnectProvider(
      this,
      "GitHubOidcProvider",
      {
        url: "https://token.actions.githubusercontent.com",
        clientIds: ["sts.amazonaws.com"],
      }
    );

    this.deployRole = new iam.Role(this, "GitHubActionsDeployRole", {
      roleName: "GitHubActionsJocDeployRole",
      assumedBy: new iam.FederatedPrincipal(
        githubProvider.openIdConnectProviderArn,
        {
          StringEquals: {
            "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          },
          StringLike: {
            "token.actions.githubusercontent.com:sub": githubBranches.map(
              (branch) =>
                `repo:${githubOrg}/${githubRepo}:ref:refs/heads/${branch}`
            ),
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
      description: "Role assumed by GitHub Actions for deploying Judge of Character",
      maxSessionDuration: Duration.hours(1),
    });

    // Grant administrator access for CDK deployments
    // Note: In production, you should scope this down to specific permissions
    this.deployRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess")
    );

    new CfnOutput(this, "DeployRoleArn", {
      value: this.deployRole.roleArn,
      description: "ARN of the IAM role for GitHub Actions to assume",
      exportName: "GitHubActionsJocDeployRoleArn",
    });
  }
}
