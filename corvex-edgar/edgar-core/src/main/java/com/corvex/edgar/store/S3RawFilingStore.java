package com.corvex.edgar.store;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

/**
 * Raw full-text submissions live in S3, keyed by CIK and accession number:
 * {@code s3://<bucket>/<cik>/<accession>.txt}. Used by the fetch stage of the batch job.
 */
public class S3RawFilingStore implements AutoCloseable {

  private final S3Client s3;
  private final String bucket;

  public S3RawFilingStore(String region, String bucket) {
    this.s3 = S3Client.builder().region(Region.of(region)).build();
    this.bucket = bucket;
  }

  public String rawUri(String cik, String accessionNumber) {
    return "s3://" + bucket + "/" + key(cik, accessionNumber);
  }

  public void putRaw(String cik, String accessionNumber, String document) {
    PutObjectRequest request =
        PutObjectRequest.builder()
            .bucket(bucket)
            .key(key(cik, accessionNumber))
            .contentType("text/plain; charset=utf-8")
            .build();
    s3.putObject(request, RequestBody.fromString(document));
  }

  public String fetchRaw(String cik, String accessionNumber) {
    GetObjectRequest request =
        GetObjectRequest.builder().bucket(bucket).key(key(cik, accessionNumber)).build();
    try (ResponseInputStream<GetObjectResponse> in = s3.getObject(request)) {
      return new String(in.readAllBytes(), StandardCharsets.UTF_8);
    } catch (IOException e) {
      throw new UncheckedIOException("failed to read " + rawUri(cik, accessionNumber), e);
    }
  }

  private static String key(String cik, String accessionNumber) {
    return cik + "/" + accessionNumber + ".txt";
  }

  @Override
  public void close() {
    s3.close();
  }
}
