namespace GestionBeneficiariosAPI.DTOs
{
    public class DocumentoIdentidadDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = null!;
        public string Abreviatura { get; set; } = null!;
        public string Pais { get; set; } = null;
    }
}
