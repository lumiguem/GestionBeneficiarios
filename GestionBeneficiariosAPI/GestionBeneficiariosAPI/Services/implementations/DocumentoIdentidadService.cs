using GestionBeneficiariosAPI.Data;
using GestionBeneficiariosAPI.DTOs;
using GestionBeneficiariosAPI.Models;
using GestionBeneficiariosAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GestionBeneficiariosAPI.Services.implementations
{
    public class DocumentoIdentidadService : IDocumentoIdentidadService
    {
        private readonly AppDbContext _context;

        public DocumentoIdentidadService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<DocumentoIdentidad>> GetAllAsync()
        {
            return await _context.DocumentosIdentidad
                
                .Select(d => new DocumentoIdentidad
                {
                    Id = d.Id,
                    Nombre = d.Nombre,
                    Abreviatura = d.Abreviatura,
                    Pais = d.Pais,
                    Longitud = d.Longitud,
                    SoloNumeros = d.SoloNumeros,
                    Activo = d.Activo,

                })
                .ToListAsync();
        }

        public async Task<bool> ToggleActivoAsync(int id)
        {
            var doc = await _context.DocumentosIdentidad
                .FirstOrDefaultAsync(d => d.Id == id);

            if (doc == null)
                return false;

            doc.Activo = !doc.Activo;
            await _context.SaveChangesAsync();

            return true;
        }



    }
}
