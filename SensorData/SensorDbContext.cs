using Microsoft.EntityFrameworkCore;

namespace SensorData;

    public class SensorDbContext : DbContext
    {
        public SensorDbContext(DbContextOptions<SensorDbContext> options): base(options) { }
        public virtual DbSet<Gas> Gases { get; set; }

    }