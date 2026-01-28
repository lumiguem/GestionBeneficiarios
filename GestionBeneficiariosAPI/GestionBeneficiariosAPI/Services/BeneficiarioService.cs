using GestionBeneficiariosAPI.Data;
using GestionBeneficiariosAPI.DTOs;
using GestionBeneficiariosAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace GestionBeneficiariosAPI.Services
{
    public class BeneficiarioService : IBeneficiarioService
    {
        private readonly AppDbContext _context;

        public BeneficiarioService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<BeneficiarioDto>> GetAllAsync()
        {
            return await _context.Beneficiarios
                .Include(b => b.DocumentoIdentidad)
                .Select(b => new BeneficiarioDto
                {
                    Id = b.Id,
                    Nombres = b.Nombres,
                    Apellidos = b.Apellidos,
                    NumeroDocumento = b.NumeroDocumento,
                    FechaNacimiento = b.FechaNacimiento,
                    Sexo = b.Sexo.ToString(),
                    DocumentoIdentidad = new DocumentoIdentidadDto
                    {
                        Id = b.DocumentoIdentidad.Id,
                        Nombre = b.DocumentoIdentidad.Nombre,
                        Abreviatura = b.DocumentoIdentidad.Abreviatura
                    }
                })
                .ToListAsync();
        }

        public async Task<BeneficiarioDto?> GetByIdAsync(int id)
        {
            return await _context.Beneficiarios
                .Include(b => b.DocumentoIdentidad)
                .Where(b => b.Id == id)
                .Select(b => new BeneficiarioDto
                {
                    Id = b.Id,
                    Nombres = b.Nombres,
                    Apellidos = b.Apellidos,
                    NumeroDocumento = b.NumeroDocumento,
                    FechaNacimiento = b.FechaNacimiento,
                    Sexo = b.Sexo.ToString(),
                    DocumentoIdentidad = new DocumentoIdentidadDto
                    {
                        Id = b.DocumentoIdentidad.Id,
                        Nombre = b.DocumentoIdentidad.Nombre,
                        Abreviatura = b.DocumentoIdentidad.Abreviatura
                    }
                })
                .FirstOrDefaultAsync();
        }

        public async Task CreateAsync(BeneficiarioDto dto)
        {
            var entity = new Beneficiario
            {
                Nombres = dto.Nombres,
                Apellidos = dto.Apellidos,
                NumeroDocumento = dto.NumeroDocumento,
                FechaNacimiento = dto.FechaNacimiento,
                Sexo = dto.Sexo[0],
                DocumentoIdentidadId = dto.DocumentoIdentidad.Id
            };

            _context.Beneficiarios.Add(entity);
            await _context.SaveChangesAsync();
        }

        public async Task<PagedResultDto<BeneficiarioDto>> GetPagedAsync(int page, int pageSize)
        {
            page = page <= 0 ? 1 : page;
            pageSize = pageSize <= 0 ? 10 : pageSize;

            var query = _context.Beneficiarios
                .Include(b => b.DocumentoIdentidad)
                .AsNoTracking();

            var totalItems = await query.CountAsync();

            var items = await query
                .OrderBy(b => b.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(b => new BeneficiarioDto
                {
                    Id = b.Id,
                    Nombres = b.Nombres,
                    Apellidos = b.Apellidos,
                    NumeroDocumento = b.NumeroDocumento,
                    FechaNacimiento = b.FechaNacimiento,
                    Sexo = b.Sexo.ToString(),
                    DocumentoIdentidad = new DocumentoIdentidadDto
                    {
                        Id = b.DocumentoIdentidad.Id,
                        Nombre = b.DocumentoIdentidad.Nombre,
                        Abreviatura = b.DocumentoIdentidad.Abreviatura
                    }
                })
                .ToListAsync();

            return new PagedResultDto<BeneficiarioDto>
            {
                TotalItems = totalItems,
                Page = page,
                PageSize = pageSize,
                Items = items
            };
        }
    }
}
