package software.amazon.awssdk.services.s3;

import software.amazon.awssdk.regions.Region;

/** Mirrors {@code software.amazon.awssdk.services.s3.S3ClientBuilder} (AWS SDK for Java 2.x). */
public interface S3ClientBuilder {

  S3ClientBuilder region(Region region);

  S3Client build();
}
