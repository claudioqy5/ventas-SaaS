using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using SaaS.API.Models;

namespace SaaS.API.Data;

// Esta clase es el punto de acceso central a la base de datos MongoDB.
// Todos los controladores la usan para leer y escribir datos.
// Cada propiedad publica representa una coleccion (tabla) dentro de la BD.
public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    // Constructor: lee la cadena de conexion y el nombre de la BD desde el archivo appsettings.json
    public MongoDbContext(IConfiguration configuration)
    {
        var connectionString = configuration.GetValue<string>("MongoDB:ConnectionString") ?? "mongodb://localhost:27017";
        var databaseName = configuration.GetValue<string>("MongoDB:DatabaseName") ?? "VentasSaaS";

        var client = new MongoClient(connectionString);
        _database = client.GetDatabase(databaseName);
    }

    // Colecciones disponibles — cada una mapea a un modelo y una coleccion en MongoDB
    public IMongoCollection<Empresa> Empresas => _database.GetCollection<Empresa>("Empresas");
    public IMongoCollection<User> Users => _database.GetCollection<User>("Users");
    public IMongoCollection<Category> Categories => _database.GetCollection<Category>("Categories");
    public IMongoCollection<Product> Products => _database.GetCollection<Product>("Products");
    public IMongoCollection<Client> Clients => _database.GetCollection<Client>("Clients");
    public IMongoCollection<Supplier> Suppliers => _database.GetCollection<Supplier>("Suppliers");
    public IMongoCollection<Sale> Sales => _database.GetCollection<Sale>("Sales");
    public IMongoCollection<Purchase> Purchases => _database.GetCollection<Purchase>("Purchases");
    public IMongoCollection<StockMovement> StockMovements => _database.GetCollection<StockMovement>("StockMovements");
    public IMongoCollection<Reminder> Reminders => _database.GetCollection<Reminder>("Reminders");
    public IMongoCollection<PaymentMethod> PaymentMethods => _database.GetCollection<PaymentMethod>("PaymentMethods");
    public IMongoCollection<RegisterRequest> RegisterRequests => _database.GetCollection<RegisterRequest>("RegisterRequests");
}
