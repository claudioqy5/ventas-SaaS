using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using SaaS.Domain.Entities;

namespace SaaS.Infrastructure.Persistence;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(IConfiguration configuration)
    {
        var connectionString = configuration.GetValue<string>("MongoDB:ConnectionString") ?? "mongodb://localhost:27017";
        var databaseName = configuration.GetValue<string>("MongoDB:DatabaseName") ?? "VentasSaaS";

        var client = new MongoClient(connectionString);
        _database = client.GetDatabase(databaseName);
    }

    public IMongoCollection<Empresa> Empresas => _database.GetCollection<Empresa>("Empresas");
    public IMongoCollection<User> Users => _database.GetCollection<User>("Users");
    public IMongoCollection<Category> Categories => _database.GetCollection<Category>("Categories");
    public IMongoCollection<Product> Products => _database.GetCollection<Product>("Products");
    public IMongoCollection<Client> Clients => _database.GetCollection<Client>("Clients");
    public IMongoCollection<Supplier> Suppliers => _database.GetCollection<Supplier>("Suppliers");
    public IMongoCollection<Sale> Sales => _database.GetCollection<Sale>("Sales");
    public IMongoCollection<Purchase> Purchases => _database.GetCollection<Purchase>("Purchases");
    public IMongoCollection<StockMovement> StockMovements => _database.GetCollection<StockMovement>("StockMovements");
}
