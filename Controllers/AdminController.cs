using Microsoft.AspNetCore.Mvc;

namespace WestvilleOldBoysClub.Controllers
{
    public class AdminController : Controller
    {
        public IActionResult AdminDashboard()
        {
            return View();
        }

        public IActionResult RestaurantAdmin()
        {
            return View();
        }
    }
}
