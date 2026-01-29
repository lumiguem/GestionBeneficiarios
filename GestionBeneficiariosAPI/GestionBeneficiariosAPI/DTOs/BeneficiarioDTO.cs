
namespace GestionBeneficiariosAPI.DTOs
{
    public class BeneficiarioDto
    {
        public int Id { get; set; }
        public string Nombres { get; set; } = null!;
        public string Apellidos { get; set; } = null!;
        public string NumeroDocumento { get; set; } = null!;
        public DateTime FechaNacimiento { get; set; }
        public string Sexo { get; set; } = null!;

        public DocumentoIdentidadDto? DocumentoIdentidad { get; set; } = null!;
    }
}
