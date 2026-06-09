FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build-env
WORKDIR /app

# Copy everything and restore
COPY . ./
RUN dotnet restore SaaS.API/SaaS.API.csproj

# Build and publish a release
RUN dotnet publish SaaS.API/SaaS.API.csproj -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build-env /app/out .
EXPOSE 8080
ENTRYPOINT ["dotnet", "SaaS.API.dll"]
