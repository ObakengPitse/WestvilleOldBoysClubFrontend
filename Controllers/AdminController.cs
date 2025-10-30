using Microsoft.AspNetCore.Mvc;

namespace WestvilleOldBoysClub.Controllers
{
    public class AdminController : Controller
    {
        public IActionResult AdminDashboard()
        {
            return View();
        }
    }
}
