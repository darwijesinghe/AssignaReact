# See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile 
# to build your images for faster debugging.

# Base Runtime Image
FROM mcr.microsoft.com/dotnet/aspnet:3.1 AS base
WORKDIR /app
# Expose HTTP port
EXPOSE 80

# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build
WORKDIR /src

# Copy only csproj files first (for faster restore layer caching)
COPY ["API/Api/Api.csproj", "API/Api/"]
COPY ["API/Application/Application.csproj", "Application/"]
COPY ["API/Domain/Domain.csproj", "Domain/"]
COPY ["API/Infrastructure/Infrastructure.csproj", "Infrastructure/"]

# Restore dependencies
RUN dotnet restore "API/Api/Api.csproj"

# Now copy the full solution
COPY . .

# Build API project
WORKDIR "/src/API/Api"
RUN dotnet build "Api.csproj" -c Release -o /app/build

# Publish Stage
FROM build AS publish
RUN dotnet publish "Api.csproj" -c Release -o /app/publish

# Final Runtime Image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "Api.dll"]