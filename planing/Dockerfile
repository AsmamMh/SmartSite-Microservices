FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app
COPY pom.xml .

COPY src ./src
RUN mvn clean package -DskipTests


FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copy any jar produced by the builder stage into a deterministic name
COPY --from=builder /app/target/*.jar /app/app.jar
EXPOSE 8089

ENTRYPOINT ["java", "-jar", "/app/app.jar"]