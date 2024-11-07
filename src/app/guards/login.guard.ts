import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loginGuard: CanActivateFn = async (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

  // El guardián de la página de ingreso fuerza la navegación hacia la página
  // de inicio cuando el usuario ya está autenticado. Este es el caso en que
  // el usuario cerró la aplicación sin haber cerrado la sesión, por lo 
  // tanto el sistema determina que si el usuario vuelve a entrar a la aplicación
  // entonces aún quiere usarla y por ello lo redirige a la página de inicio.

  if (await authService.isAuthenticated()) {
    // Si el usuario está autenticado lo deja entrar a la página de inicio
    router.navigate(['/inicio']);
    // Pero se niega la entrada a la página de ingreso
    return false;
  } else {
    // Si el usuario no está autenticado lo deja entrar a la página de ingreso
    return true;
  }
}