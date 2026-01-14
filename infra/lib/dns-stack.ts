import { aws_route53 as route53, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

export class DNSStack extends Stack {
  public hostedZone: route53.HostedZone;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const fullyQualifiedDomain = this.node.tryGetContext(
      "fullyQualifiedDomain"
    );
    if (!fullyQualifiedDomain) {
      throw new Error(
        "No context value found for 'fullyQualifiedDomain'. Set it in cdk.json or use: cdk deploy -c fullyQualifiedDomain=<value>"
      );
    }

    this.hostedZone = new route53.HostedZone(this, "JocHostedZone", {
      zoneName: fullyQualifiedDomain,
    });
  }
}
