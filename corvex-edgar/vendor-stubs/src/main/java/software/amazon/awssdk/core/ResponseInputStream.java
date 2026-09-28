package software.amazon.awssdk.core;

import java.io.IOException;
import java.io.InputStream;

/** Mirrors {@code software.amazon.awssdk.core.ResponseInputStream} (AWS SDK for Java 2.x). */
public class ResponseInputStream<ResponseT> extends InputStream {

  public ResponseT response() {
    throw new UnsupportedOperationException("compile-only stub");
  }

  @Override
  public int read() throws IOException {
    throw new UnsupportedOperationException("compile-only stub");
  }

  @Override
  public int read(byte[] b, int off, int len) throws IOException {
    throw new UnsupportedOperationException("compile-only stub");
  }

  @Override
  public void close() throws IOException {
    throw new UnsupportedOperationException("compile-only stub");
  }
}
