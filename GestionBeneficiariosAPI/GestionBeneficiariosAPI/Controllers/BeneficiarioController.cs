using Microsoft.AspNetCore.Mvc;

namespace GestionBeneficiariosAPI.Controllers
{
    public class BeneficiarioController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
