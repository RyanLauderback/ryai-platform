package com.corvex.edgar.map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.corvex.edgar.model.FilingRecord;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Stream;
import org.junit.jupiter.api.DynamicTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestFactory;

/**
 * Golden coverage for the parse -&gt; normalize -&gt; map pipeline: every raw submission in
 * {@code samples/raw} must produce exactly the record captured in {@code samples/golden}.
 * Comparison is on parsed JSON trees so reformatting of the golden files is harmless.
 */
class FilingRecordGoldenTest {

  private static final Path SAMPLES_DIR =
      Path.of(System.getProperty("edgar.samples.dir", "../samples"));

  /** Batch id pinned for the sample corpus so golden output is reproducible. */
  private static final String SAMPLE_BATCH_ID = "edgar-20260927-01";

  private final FilingRecordMapper mapper = new FilingRecordMapper("s3://corvex-edgar-raw");

  private final ObjectMapper json =
      new ObjectMapper().setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);

  @TestFactory
  Stream<DynamicTest> goldenOutputMatchesEveryRawSample() throws IOException {
    Path rawDir = SAMPLES_DIR.resolve("raw");
    assertTrue(Files.isDirectory(rawDir), "samples/raw directory missing: " + rawDir);
    final List<Path> raws;
    try (Stream<Path> files = Files.list(rawDir)) {
      raws =
          files.filter(p -> p.getFileName().toString().endsWith(".txt")).sorted().toList();
    }
    return raws.stream()
        .map(raw -> DynamicTest.dynamicTest(raw.getFileName().toString(), () -> check(raw)));
  }

  private void check(Path rawPath) throws IOException {
    String basename = rawPath.getFileName().toString().replaceFirst("\\.txt$", "");
    Path goldenPath = SAMPLES_DIR.resolve("golden").resolve(basename + ".json");
    assertTrue(Files.exists(goldenPath), "no golden file for sample " + rawPath);

    FilingRecord record = mapper.map(Files.readString(rawPath), SAMPLE_BATCH_ID);

    JsonNode actual = json.valueToTree(record);
    JsonNode expected = json.readTree(Files.readString(goldenPath));
    assertEquals(expected, actual, "golden mismatch for " + rawPath);
  }

  @Test
  void corpusIsNotEmpty() throws IOException {
    try (Stream<Path> files = Files.list(SAMPLES_DIR.resolve("raw"))) {
      assertFalse(files.findAny().isEmpty(), "samples/raw must not be empty");
    }
  }
}
