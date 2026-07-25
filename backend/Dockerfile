# Build the Spring Boot application
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN apk add --no-cache maven && mvn clean package -DskipTests

# Run the application with Render's dynamic PORT and internal FastAPI address.
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -Dai.fastapi.url=${AI_FASTAPI_URL:-http://${AI_FASTAPI_HOSTPORT:-localhost:8000}/predict} -jar app.jar"]