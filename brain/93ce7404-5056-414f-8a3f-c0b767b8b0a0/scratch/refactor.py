import os
import shutil
import re

backend_path = r"c:\Users\FAMHURP\Desktop\PROYECTOS CFQY\VENTAS SaaS\Backend"
api_path = os.path.join(backend_path, "SaaS.API")

# Create target directories
models_path = os.path.join(api_path, "Models")
services_path = os.path.join(api_path, "Services")
data_path = os.path.join(api_path, "Data")

if not os.path.exists(models_path):
    os.makedirs(models_path)
if not os.path.exists(services_path):
    os.makedirs(services_path)
if not os.path.exists(data_path):
    os.makedirs(data_path)

# File mappings (Source -> Target Directory)
mappings = [
    # Domain -> Models
    (os.path.join(backend_path, "SaaS.Domain", "Entities"), models_path),
    # Application Interfaces -> Services
    (os.path.join(backend_path, "SaaS.Application", "Interfaces"), services_path),
    # Infrastructure Persistence -> Data
    (os.path.join(backend_path, "SaaS.Infrastructure", "Persistence"), data_path),
    # Infrastructure Services -> Services
    (os.path.join(backend_path, "SaaS.Infrastructure", "Services"), services_path),
    # Infrastructure Authentication -> Services
    (os.path.join(backend_path, "SaaS.Infrastructure", "Authentication"), services_path)
]

print("Copying files to SaaS.API...")

for src_dir, dest_dir in mappings:
    if os.path.exists(src_dir):
        for item in os.listdir(src_dir):
            s = os.path.join(src_dir, item)
            d = os.path.join(dest_dir, item)
            if os.path.isfile(s) and s.endswith(".cs"):
                shutil.copy2(s, d)
                print("Copied: %s -> %s" % (item, os.path.basename(dest_dir)))

# Helper to rewrite file content
def rewrite_file(file_path):
    with open(file_path, "r") as f:
        content = f.read()

    # Namespace updates
    content = content.replace("namespace SaaS.Domain.Entities", "namespace SaaS.API.Models")
    content = content.replace("namespace SaaS.Application.Interfaces", "namespace SaaS.API.Services")
    content = content.replace("namespace SaaS.Infrastructure.Services", "namespace SaaS.API.Services")
    content = content.replace("namespace SaaS.Infrastructure.Persistence", "namespace SaaS.API.Data")
    content = content.replace("namespace SaaS.Infrastructure.Authentication", "namespace SaaS.API.Services")

    # Using directive updates
    content = content.replace("using SaaS.Domain.Entities;", "using SaaS.API.Models;")
    content = content.replace("using SaaS.Application.Interfaces;", "using SaaS.API.Services;")
    content = content.replace("using SaaS.Infrastructure.Services;", "using SaaS.API.Services;")
    content = content.replace("using SaaS.Infrastructure.Persistence;", "using SaaS.API.Data;")
    content = content.replace("using SaaS.Infrastructure.Authentication;", "using SaaS.API.Services;")

    with open(file_path, "w") as f:
        f.write(content)

# Apply rewrites to newly copied files
for root, dirs, files in os.walk(api_path):
    for file in files:
        if file.endswith(".cs"):
            rewrite_file(os.path.join(root, file))

print("Updated namespaces and using statements in all C# source files.")

# Update SaaS.API.csproj
csproj_path = os.path.join(api_path, "SaaS.API.csproj")
with open(csproj_path, "r") as f:
    csproj = f.read()

# Replace project references with MongoDB package reference
# Using regex with DOTALL to match multilines easily
csproj_replaced = re.sub(
    r'<ItemGroup>\s*<ProjectReference Include="\.\.\\SaaS\.Infrastructure\\SaaS\.Infrastructure\.csproj" />\s*<ProjectReference Include="\.\.\\SaaS\.Application\\SaaS\.Application\.csproj" />\s*</ItemGroup>',
    '',
    csproj
)

# Insert MongoDB package reference if not already present
if 'Include="MongoDB.Driver"' not in csproj_replaced:
    csproj_replaced = csproj_replaced.replace(
        '<PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="9.0.0" />',
        '<PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="9.0.0" />\n    <PackageReference Include="MongoDB.Driver" Version="3.9.0" />'
    )

with open(csproj_path, "w") as f:
    f.write(csproj_replaced)

print("Updated SaaS.API.csproj references.")

# Delete old project directories
old_dirs = ["SaaS.Domain", "SaaS.Application", "SaaS.Infrastructure"]
for d in old_dirs:
    full_d = os.path.join(backend_path, d)
    if os.path.exists(full_d):
        shutil.rmtree(full_d)
        print("Deleted old directory: %s" % d)

# Simplify solution file if it exists
slnx_path = os.path.join(backend_path, "SaaS.slnx")
if os.path.exists(slnx_path):
    with open(slnx_path, "w") as f:
        f.write('<Solution>\n  <Project Path="SaaS.API\\SaaS.API.csproj" />\n</Solution>\n')
    print("Simplified SaaS.slnx.")

print("Refactoring completed successfully!")
