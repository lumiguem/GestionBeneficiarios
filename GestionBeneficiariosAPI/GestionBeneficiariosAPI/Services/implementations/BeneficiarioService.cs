using GestionBeneficiariosAPI.Data;
using GestionBeneficiariosAPI.DTOs;
using GestionBeneficiariosAPI.Models;
using GestionBeneficiariosAPI.Services.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace GestionBeneficiariosAPI.Services.implementations
{
    public class BeneficiarioService : IBeneficiarioService
    {
        private readonly AppDbContext _context;

        public BeneficiarioService(AppDbContext context)
        {
            _context = context;
        }


        //MÉTODO PRIVADO DE VALIDACIÓN (REGLA DE NEGOCIO)

        private async Task ValidarDocumentoAsync(int documentoIdentidadId, string numeroDocumento)
        {
            var documento = await _context.DocumentosIdentidad
                .AsNoTracking()
                .FirstOrDefaultAsync(d => d.Id == documentoIdentidadId);

            if (documento == null)
                throw new Exception("El tipo de documento no existe.");

            if (documento.SoloNumeros && !numeroDocumento.All(char.IsDigit))
                throw new Exception("El número de documento solo debe contener números.");

            if (numeroDocumento.Length != documento.Longitud)
                throw new Exception(
                    $"El número de documento debe tener {documento.Longitud} caracteres."
                );
        }

        // LISTAR TODOS
        public async Task<List<BeneficiarioDto>> GetAllAsync()
        {
            var result = new List<BeneficiarioDto>();

            using var conn = _context.Database.GetDbConnection();
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = "sp_Beneficiario_Listar";

            using var reader = await cmd.ExecuteReaderAsync();

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
                        Abreviatura = reader.GetString(8),
                        Pais = reader.GetString(9)
                    },
                    NumeroDocumento = reader.GetString(4),
                    FechaNacimiento = reader.GetDateTime(5),
                    Sexo = reader.GetString(6)
                });
            }

            return result;
        }

      //LISTAR PAGINADO

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
                        Abreviatura = reader.GetString(8),
                        Pais = reader.GetString(9)
                    },
                    NumeroDocumento = reader.GetString(4),
                    FechaNacimiento = reader.GetDateTime(5),
                    Sexo = reader.GetString(6)
                });
            }

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


        // OBTENER POR ID

        public async Task<BeneficiarioDto?> GetByIdAsync(int id)
        {
            BeneficiarioDto? result = null;

            using var conn = _context.Database.GetDbConnection();
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = "sp_Beneficiario_ObtenerPorId";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            cmd.Parameters.Add(new SqlParameter("@Id", id));

            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                result = new BeneficiarioDto
                {
                    Id = reader.GetInt32(0),
                    Nombres = reader.GetString(1),
                    Apellidos = reader.GetString(2),
                    DocumentoIdentidad = new DocumentoIdentidadDto
                    {
                        Id = reader.GetInt32(3),
                        Nombre = reader.GetString(7),
                        Abreviatura = reader.GetString(8),
                        Pais = reader.GetString(9)
                    },
                    NumeroDocumento = reader.GetString(4),
                    FechaNacimiento = reader.GetDateTime(5),
                    Sexo = reader.GetString(6)
                };
            }

            return result;
        }

        // AGREGAR NUEVO

        public async Task<BeneficiarioDto> CreateAsync(BeneficiarioDto dto)
        {
            // validacion
            await ValidarDocumentoAsync(
                dto.DocumentoIdentidad.Id,
                dto.NumeroDocumento
            );

            int newId;

            using var conn = _context.Database.GetDbConnection();
            await conn.OpenAsync();

            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandText = "sp_Beneficiario_Insertar";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Nombres", dto.Nombres));
                cmd.Parameters.Add(new SqlParameter("@Apellidos", dto.Apellidos));
                cmd.Parameters.Add(new SqlParameter("@DocumentoIdentidadId", dto.DocumentoIdentidad.Id));
                cmd.Parameters.Add(new SqlParameter("@NumeroDocumento", dto.NumeroDocumento));
                cmd.Parameters.Add(new SqlParameter("@FechaNacimiento", dto.FechaNacimiento));
                cmd.Parameters.Add(new SqlParameter("@Sexo", dto.Sexo[0]));

                using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    newId = Convert.ToInt32(reader["Id"]);
                }
                else
                {
                    throw new Exception("No se pudo crear el beneficiario.");
                }
            }

            BeneficiarioDto? created = null;

            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandText = "sp_Beneficiario_ObtenerPorId";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id", newId));

                using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    created = new BeneficiarioDto
                    {
                        Id = reader.GetInt32(0),
                        Nombres = reader.GetString(1),
                        Apellidos = reader.GetString(2),
                        DocumentoIdentidad = new DocumentoIdentidadDto
                        {
                            Id = reader.GetInt32(3),
                            Nombre = reader.GetString(7),
                            Abreviatura = reader.GetString(8),
                            Pais = reader.GetString(9)
                        },
                        NumeroDocumento = reader.GetString(4),
                        FechaNacimiento = reader.GetDateTime(5),
                        Sexo = reader.GetString(6)
                    };
                }
            }

            return created!;
        }
        // ACTUALIZAR EXISTENTE

        public async Task UpdateAsync(int id, BeneficiarioDto dto)
        {
            // validacion
            await ValidarDocumentoAsync(
                dto.DocumentoIdentidad.Id,
                dto.NumeroDocumento
            );

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

        //DELETE
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
