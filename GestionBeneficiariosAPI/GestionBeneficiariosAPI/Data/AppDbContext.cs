using Microsoft.EntityFrameworkCore;
using GestionBeneficiariosAPI.Models;

namespace GestionBeneficiariosAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Beneficiario> Beneficiarios { get; set; }
        public DbSet<DocumentoIdentidad> DocumentosIdentidad { get; set; }
    }
}
