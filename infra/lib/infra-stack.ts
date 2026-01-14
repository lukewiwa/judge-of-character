import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as alias from "aws-cdk-lib/aws-route53-targets";

export class InfraStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    certificate: acm.ICertificate,
    hostedZone: route53.IHostedZone,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    const websiteBucket = new s3.Bucket(this, "JocPwaBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
    });

    const distribution = new cloudfront.Distribution(this, "JocPwaDist", {
      comment: "Judge of Character static site",
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(websiteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: [hostedZone.zoneName],
      certificate,
    });

    new s3deploy.BucketDeployment(this, "JocPwaDeploy", {
      sources: [s3deploy.Source.asset("../src/dist")],
      destinationBucket: websiteBucket,
      retainOnDelete: false,
      distribution,
      distributionPaths: ["/*"],
    });

    new route53.ARecord(this, "AliasRecord", {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(
        new alias.CloudFrontTarget(distribution)
      ),
    });
  }
}
