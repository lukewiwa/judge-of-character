import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as alias from "aws-cdk-lib/aws-route53-targets";
import * as acm from "aws-cdk-lib/aws-certificatemanager";

export class JocInfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const FULLY_QUALIFIED_DOMAIN = process.env.FULLY_QUALIFIED_DOMAIN ?? "";

    const hostedZone = route53.HostedZone.fromLookup(this, "JocHostedZone", {
      domainName: FULLY_QUALIFIED_DOMAIN,
    });

    const websiteBucket = new s3.Bucket(this, "JocPwaBucket", {
      bucketName: FULLY_QUALIFIED_DOMAIN,
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    new s3deploy.BucketDeployment(this, "DeployJocPwa", {
      sources: [s3deploy.Source.asset("../frontend/dist")],
      destinationBucket: websiteBucket,
      retainOnDelete: false,
    });

    const jocCertificate = new acm.DnsValidatedCertificate(this, "JocCert", {
      domainName: `*.${FULLY_QUALIFIED_DOMAIN}`,
      subjectAlternativeNames: [FULLY_QUALIFIED_DOMAIN],
      hostedZone,
      region: "us-east-1",
    });

    const distribution = new cloudfront.Distribution(this, "JocPwaDist", {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: [FULLY_QUALIFIED_DOMAIN],
      certificate: jocCertificate,
    });

    new route53.ARecord(this, "AliasRecord", {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(
        new alias.CloudFrontTarget(distribution)
      ),
    });
  }
}
