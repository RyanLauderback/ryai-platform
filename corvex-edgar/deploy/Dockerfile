# Builds the edgar-core artifact and layers it onto the Spark runtime image used on EKS.
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build
COPY mvnw ./
COPY .mvn ./.mvn
COPY pom.xml ./
COPY vendor-stubs ./vendor-stubs
COPY edgar-core ./edgar-core
RUN ./mvnw -B -q -DskipTests package

FROM apache/spark:3.5.9
USER root
RUN mkdir -p /opt/corvex/edgar
COPY --from=build /build/edgar-core/target/edgar-core-8.2.0.jar /opt/corvex/edgar/edgar-core.jar
USER spark
# The driver is submitted with:
#   spark-submit --class com.corvex.edgar.spark.FilingsBatchJob \
#     /opt/corvex/edgar/edgar-core.jar <run-date>
ENTRYPOINT ["/opt/entrypoint.sh"]
