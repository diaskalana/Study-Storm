# FROM eclipse-temurin:17-jdk-alpine
# VOLUME /tmp
# ARG JAR_FILE=target/*.jar
# COPY ${JAR_FILE} app.jar
# ENTRYPOINT ["java","-jar","/app.jar"]




# Use a base image with OpenJDK installed
FROM maven:3.8.4-openjdk-17 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy the Maven project file
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy the source code into the container
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Create a minimal JRE image
FROM eclipse-temurin:17-jdk-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the packaged JAR file from the builder stage
COPY --from=builder /app/target/*.jar /app/app.jar

# Expose the port that your application runs on
EXPOSE 8082

# Define the command to run your application
CMD ["java", "-jar", "app.jar"]
