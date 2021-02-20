import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";

export class JocInfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const websiteBucket = new s3.Bucket(this, "JocPwaBucket", {
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
    });

    new s3deploy.BucketDeployment(this, "DeployJocPwa", {
      sources: [s3deploy.Source.asset("../../frontend/dist")],
      destinationBucket: websiteBucket,
      retainOnDelete: false,
      destinationKeyPrefix: "web/static", // optional prefix in destination bucket
    });
    // The code that defines your stack goes here
  }
}
