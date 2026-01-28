using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestionBeneficiariosAPI.Models
{
    [Table("DocumentoIdentidad")]
    public class DocumentoIdentidad
    {
        [Key]
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Abreviatura { get; set; }
        public string Pais { get; set; }
        public int Longitud { get; set; }
        public bool SoloNumeros { get; set; }
        public bool Activo { get; set; } = true;

        public ICollection<Beneficiario> Beneficiarios { get; set; }
    }
}
