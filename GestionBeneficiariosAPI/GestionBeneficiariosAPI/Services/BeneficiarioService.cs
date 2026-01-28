using GestionBeneficiariosAPI.Data;
using GestionBeneficiariosAPI.DTOs;
using GestionBeneficiariosAPI.Models;
using GestionBeneficiariosAPI.Services.implementations;
using Microsoft.Data.SqlClient;
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
            var param = new SqlParameter("@Id", id);

            var result = _context.Beneficiarios
                .FromSqlRaw("EXEC dbo.sp_Beneficiario_ObtenerPorId @Id", param)
                .AsEnumerable()
                .Select(b => new BeneficiarioDto
                {
                    Id = b.Id,
                    Nombres = b.Nombres,
                    Apellidos = b.Apellidos,
                    NumeroDocumento = b.NumeroDocumento,
                    FechaNacimiento = b.FechaNacimiento,
                    Sexo = b.Sexo.ToString()
                })
                .FirstOrDefault();

            return result;
        }


        public async Task CreateAsync(BeneficiarioDto dto)
        {
            await _context.Database.ExecuteSqlRawAsync(
                "EXEC sp_Beneficiario_Insertar @Nombres, @Apellidos, @DocumentoIdentidadId, @NumeroDocumento, @FechaNacimiento, @Sexo",
                new SqlParameter("@Nombres", dto.Nombres),
                new SqlParameter("@Apellidos", dto.Apellidos),
                new SqlParameter("@DocumentoIdentidadId", dto.DocumentoIdentidad.Id),
                new SqlParameter("@NumeroDocumento", dto.NumeroDocumento),
                new SqlParameter("@FechaNacimiento", dto.FechaNacimiento),
                new SqlParameter("@Sexo", dto.Sexo[0])
            );
        }


        public async Task<PagedResultDto<BeneficiarioDto>> GetPagedAsync(int page, int pageSize)
        {
            var result = new List<BeneficiarioDto>();
            int totalItems = 0;

            using var conn = _context.Database.GetDbConnection();
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = "sp_Beneficiario_ListarPaginado";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            cmd.Parameters.Add(new SqlParameter("@Page", page));
            cmd.Parameters.Add(new SqlParameter("@PageSize", pageSize));

            using var reader = await cmd.ExecuteReaderAsync();

            // 1️⃣ Lista
            while (await reader.ReadAsync())
            {
                result.Add(new BeneficiarioDto
                {
                    Id = reader.GetInt32(0),
                    Nombres = reader.GetString(1),
                    Apellidos = reader.GetString(2),
                    DocumentoIdentidad = new DocumentoIdentidadDto
                    {
                        Id = reader.GetInt32(3),
                        Nombre = reader.GetString(7),
                        Abreviatura = reader.GetString(8)
                    },
                    NumeroDocumento = reader.GetString(4),
                    FechaNacimiento = reader.GetDateTime(5),
                    Sexo = reader.GetString(6)
                });
            }

            // 2️⃣ TotalItems
            if (await reader.NextResultAsync() && await reader.ReadAsync())
            {
                totalItems = reader.GetInt32(0);
            }

            return new PagedResultDto<BeneficiarioDto>
            {
                Page = page,
                PageSize = pageSize,
                TotalItems = totalItems,
                Items = result
            };
        }

        public async Task UpdateAsync(int id, BeneficiarioDto dto)
        {
            using var conn = _context.Database.GetDbConnection();
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = "sp_Beneficiario_Actualizar";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            cmd.Parameters.Add(new SqlParameter("@Id", id));
            cmd.Parameters.Add(new SqlParameter("@Nombres", dto.Nombres));
            cmd.Parameters.Add(new SqlParameter("@Apellidos", dto.Apellidos));
            cmd.Parameters.Add(new SqlParameter("@NumeroDocumento", dto.NumeroDocumento));
            cmd.Parameters.Add(new SqlParameter("@FechaNacimiento", dto.FechaNacimiento));
            cmd.Parameters.Add(new SqlParameter("@Sexo", dto.Sexo[0]));
            cmd.Parameters.Add(new SqlParameter("@DocumentoIdentidadId", dto.DocumentoIdentidad.Id));

            await cmd.ExecuteNonQueryAsync();
        }
        public async Task DeleteAsync(int id)
        {
            using var conn = _context.Database.GetDbConnection();
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = "sp_Beneficiario_Eliminar";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            cmd.Parameters.Add(new SqlParameter("@Id", id));

            await cmd.ExecuteNonQueryAsync();
        }

    }
}
