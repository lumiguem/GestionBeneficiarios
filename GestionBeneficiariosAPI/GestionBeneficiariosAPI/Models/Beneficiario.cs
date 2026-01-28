using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestionBeneficiariosAPI.Models
{
    [Table("Beneficiario")]
    public class Beneficiario
    {
        [Key]
        public int Id { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }

        [ForeignKey("DocumentoIdentidad")]
        public int DocumentoIdentidadId { get; set; }
        public DocumentoIdentidad DocumentoIdentidad { get; set; }

        public string NumeroDocumento { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public char Sexo { get; set; } // 'M' o 'F'
    }
}
