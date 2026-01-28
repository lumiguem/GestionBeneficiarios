using GestionBeneficiariosAPI.DTOs;
using GestionBeneficiariosAPI.Models;
using Microsoft.EntityFrameworkCore;

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

        public DbSet<BeneficiarioSpResult> BeneficiarioSpResults { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BeneficiarioSpResult>().HasNoKey();
        }

    }
}
