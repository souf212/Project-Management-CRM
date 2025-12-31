# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Project-service/Project-service.csproj", "Project-service/"]
RUN dotnet restore "Project-service/Project-service.csproj"
COPY . .
WORKDIR "/src/Project-service"
RUN dotnet build "Project-service.csproj" -c Release -o /app/build

# Publish Stage
FROM build AS publish
RUN dotnet publish "Project-service.csproj" -c Release -o /app/publish

# Final Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
ENV ASPNETCORE_HTTP_PORTS=8080
COPY --from=publish /app/publish .
# Ensure the DB file can be created if using local file (though volumes are preferred)
ENTRYPOINT ["dotnet", "Project-service.dll"]
