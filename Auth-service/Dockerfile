# Multi-stage build
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM openjdk:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
# Create an empty DB file if it doesn't exist, though typically volumes are better
RUN touch users.db
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
