package software.amazon.awssdk.core.sync;

/** Mirrors {@code software.amazon.awssdk.core.sync.RequestBody} (AWS SDK for Java 2.x). */
public final class RequestBody {

  private RequestBody() {}

  public static RequestBody fromString(String contents) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public static RequestBody fromBytes(byte[] bytes) {
    throw new UnsupportedOperationException("compile-only stub");
  }
}
