using Microsoft.AspNetCore.Mvc;
using WestvilleOldBoysClub.Models;

namespace WestvilleOldBoysClub.Controllers
{
    public class AccountController : Controller
    {
        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        public IActionResult AdminLogin()
        {
            return View();
        }

        public IActionResult Logout()
        {
            // TODO: Add logout logic (clear session/cookies)
            return RedirectToAction("Login");
        }
    }
}
