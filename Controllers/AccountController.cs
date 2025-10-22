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

        [HttpPost]
        public IActionResult Login(LoginViewModel model)
        {
            if (!ModelState.IsValid)
                return View(model);

            // TODO: Replace with actual authentication logic
            if (model.Email == "admin@example.com" && model.Password == "Password123")
            {
                // Redirect to dashboard or home
                return RedirectToAction("Index", "Home");
            }

            ModelState.AddModelError("", "Invalid email or password.");
            return View(model);
        }

        public IActionResult Logout()
        {
            // TODO: Add logout logic (clear session/cookies)
            return RedirectToAction("Login");
        }
    }
}
