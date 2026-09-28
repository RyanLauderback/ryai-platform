package software.amazon.awssdk.services.s3;

import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

/** Mirrors {@code software.amazon.awssdk.services.s3.S3Client} (AWS SDK for Java 2.x). */
public interface S3Client extends AutoCloseable {

  static S3Client create() {
    throw new UnsupportedOperationException("compile-only stub");
  }

  static S3ClientBuilder builder() {
    throw new UnsupportedOperationException("compile-only stub");
  }

  default PutObjectResponse putObject(PutObjectRequest putObjectRequest, RequestBody requestBody) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  default ResponseInputStream<GetObjectResponse> getObject(GetObjectRequest getObjectRequest) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  @Override
  default void close() {
    throw new UnsupportedOperationException("compile-only stub");
  }
}
