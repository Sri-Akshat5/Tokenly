# Stage 1: Build the application with Maven
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -Dmaven.test.skip=true -B

# Stage 2: Run the packaged jar on a lightweight JRE
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar
# Baked-in defaults (port, JPA, logging, ...); secrets are supplied via
# environment variables at runtime, which take precedence over this file.
COPY src/main/resources/application.properties.example application.properties

EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]
