namespace GestionBeneficiariosAPI.DTOs
{
    public class BeneficiarioSpResult
    {
        public int Id { get; set; }
        public string Nombres { get; set; } = null!;
        public string Apellidos { get; set; } = null!;
        public int DocumentoIdentidadId { get; set; }
        public string NumeroDocumento { get; set; } = null!;
        public DateTime FechaNacimiento { get; set; }
        public string Sexo { get; set; } = null!;
        public string? DocumentoNombre { get; set; }
        public string? Abreviatura { get; set; }
        public string? Pais { get; set; }
    }

}
