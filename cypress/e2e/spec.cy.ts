describe('Verificar mi aplicación', () => {
  it('La página de Ingreso con credenciales correctas entre a la página de Inicio usando login de atorres y salga del sistema con logout', () => {
    cy.visit('http://localhost:8100/')
      .then(() => {

        cy.get('#cuenta')
          .type('atorres');

        cy.get('#password')
          .type('1234');

        cy.wait(1000);

        cy.get('#btn-login')
        .click();

        cy.intercept('/inicio')
          .as('route')
          .then(() => {
            cy.wait(1000);

            cy.get('app-header')
              .get('#logout')
              .click();
          });
      });
  });

  it('La página de Ingreso con credenciales incorrectas intente entrar al sistema pero se quede en la página de ingreso', () => {
    cy.visit('http://localhost:8100/');

    cy.get('#cuenta')
      .type('incorrecto');

    cy.get('#password')
      .type('incorrecta');

    cy.wait(1000);

    cy.get('#btn-login')
      .click();

    cy.url()
      .should('include', '/ingreso');

    cy.wait(500);

    cy.get('ion-toast#toast-id')
      .shadow()
      .find('.toast-message')
      .should('exist')
      .and('be.visible')
      .should('contain.text', 'El correo o la password son incorrectos');
  });

  it('El foro agregue una nueva publicación', () => {
    cy.visit('http://localhost:8100/');

    cy.url().then(($url) => {
      if($url.includes('inicio')) {
        cy.get('app-header')
          .get('#logout')
          .click();
      };
    });

    cy.get('#cuenta')
      .type('atorres');

    cy.get('#password')
      .type('1234');

    cy.wait(1000);

    cy.get('#btn-login')
      .click();

    cy.intercept('/inicio')
      .as('route')
      .then(() => {
        cy.wait(1000);

        cy.get('ion-toast#toast-id')
          .shadow()
          .find('.toast-button')
          .click();

        cy.get('app-footer')
          .get('#mi-clase')
          .get('#foro')
          .click();
        
        cy.get('app-foro')
          .get('#post-title')
          .type('Título de la publicación');

        cy.get('#post-body')
          .type('Descripción de la publicación');
        
        cy.wait(1000);

        cy.get('#btn-guardar')
          .click();

        cy.get('ion-toast#toast-id')
          .shadow()
          .find('.toast-message')
          .should('exist')
          .and('be.visible')
          .should('contain.text', 'Publicación creada correctamente:');

        cy.get('app-header')
          .get('#logout')
          .click();
      });
  });

  it('El foro elimine la publicación ingresada en el paso anterior', () => {
    cy.visit('http://localhost:8100/');

    cy.url().then(($url) => {
      if($url.includes('inicio')) {
        cy.get('app-header')
          .get('#logout')
          .click();
      };
    });

    cy.get('#cuenta')
      .type('atorres');

    cy.get('#password')
      .type('1234');

    cy.wait(1000);

    cy.get('#btn-login')
      .click();

    cy.intercept('/inicio')
      .as('route')
      .then(() => {
        cy.wait(1000);

        cy.get('ion-toast#toast-id')
          .shadow()
          .find('.toast-button')
          .click();

        cy.get('app-footer')
          .get('#mi-clase')
          .get('#foro')
          .click();
        
        cy.get('ion-card')
          .contains('Título de la publicación')
          .should('exist');
        
        cy.get('ion-card')
          .contains('Título de la publicación')
          .parents('ion-col')
          .find('ion-button#btn-delete')
          .click();

        cy.get('ion-toast#toast-id')
          .shadow()
          .find('.toast-message')
          .should('exist')
          .and('be.visible')
          .should('contain.text', 'Publicación eliminada correctamente:');
        
        cy.wait(1000);
        
        cy.get('app-header')
          .get('#logout')
          .click();
      });
  });

  it('La componente de Mis Datos realice todas sus validaciones de campos (todos los campos son requeridos, el correo debe ser validado como email válido y la fecha debe ser una fecha válida)', () => {
    cy.visit('http://localhost:8100/');
      

    cy.get('#cuenta')
      .type('atorres');

    cy.get('#password')
      .type('1234');

    cy.wait(1000);

    cy.get('#btn-login')
      .click();

    cy.intercept('/inicio')
      .as('route')
      .then(() => {
        cy.wait(1000);

        cy.get('ion-toast#toast-id')
          .shadow()
          .find('.toast-button')
          .click();

        cy.get('app-footer')
          .get('#mi-clase')
          .click()
          .get('#mis-datos')
          .click();

        cy.get('#nombre').find('input').type('{selectall}{backspace}', { force: true });
        cy.get('#apellido').find('input').type('{selectall}{backspace}', { force: true });
        cy.get('#correo').find('input').type('{selectall}{backspace}', { force: true });
        cy.get('#pregunta').find('input').type('{selectall}{backspace}', { force: true });
        cy.get('#respuesta').find('input').type('{selectall}{backspace}', { force: true });
        cy.get('#fechaNacimiento').find('input').type('2024-11-28', { force: true });
        cy.get('#direccion').find('input').type('{selectall}{backspace}', { force: true });
        cy.get('#contrapass').find('input').type('{selectall}{backspace}', { force: true });

        cy.wait(1000);

        cy.get('#btn-guardar').click();

        cy.get('ion-toast#toast-id')
          .shadow()
          .find('.toast-message')
          .should('exist')
          .and('be.visible')
        
        cy.wait(1000);

        cy.get('ion-toast#toast-id').shadow().find('.toast-button').click();

        cy.get('#nombre').find('input').type('Ana', { force: true });
        cy.get('#btn-guardar').click();

        cy.get('ion-toast#toast-id')
          .shadow()
          .find('.toast-message')
          .should('exist')
          .and('be.visible')
        
        cy.wait(1000);

        cy.get('ion-toast#toast-id').shadow().find('.toast-button').click();

        cy.get('#apellido').find('input').type('Torres Leiva', { force: true });
        cy.get('#btn-guardar').click();

        cy.get('ion-toast#toast-id')
          .shadow()
          .find('.toast-message')
          .should('exist')
          .and('be.visible')
        
        cy.wait(1000);

        cy.get('ion-toast#toast-id').shadow().find('.toast-button').click();

        cy.get('#correo').find('input').type('atorres', { force: true });
        cy.get('#btn-guardar').click();

        cy.get('ion-toast#toast-id')
          .shadow()
          .find('.toast-message')
          .should('exist')
          .and('be.visible')
        
        cy.wait(1000);

        cy.get('ion-toast#toast-id').shadow().find('.toast-button').click();

        cy.get('#correo').find('input').type('@duocuc.cl', { force: true });
        cy.get('#btn-guardar').click();

        cy.get('ion-toast#toast-id')
          .shadow()
          .find('.toast-message')
          .should('exist')
          .and('be.visible')
        
        cy.wait(1000);

        cy.get('ion-toast#toast-id').shadow().find('.toast-button').click();

        cy.get('#pregunta').find('input').type('Nombre de su mascota', { force: true });
        cy.get('#btn-guardar').click();

        cy.get('ion-toast#toast-id')
          .shadow()
          .find('.toast-message')
          .should('exist')
          .and('be.visible')
        
        cy.wait(1000);

        cy.get('ion-toast#toast-id').shadow().find('.toast-button').click();

        cy.get('#respuesta').find('input').type('gato', { force: true });
        cy.get('#btn-guardar').click();

        cy.get('ion-toast#toast-id')
          .shadow()
          .find('.toast-message')
          .should('exist')
          .and('be.visible')
        
        cy.wait(1000);

        cy.get('ion-toast#toast-id').shadow().find('.toast-button').click();

        cy.get('#fechaNacimiento').find('input').type('2000-05-20', { force: true });
        cy.get('#btn-guardar').click();

        cy.get('ion-toast#toast-id')
          .shadow()
          .find('.toast-message')
          .should('exist')
          .and('be.visible')
        
        cy.wait(1000);

        cy.get('ion-toast#toast-id').shadow().find('.toast-button').click();

        cy.get('#direccion').find('input').type('La Florida', { force: true });
        cy.get('#btn-guardar').click();

        cy.get('ion-toast#toast-id')
          .shadow()
          .find('.toast-message')
          .should('exist')
          .and('be.visible')
        
        cy.wait(1000);

        cy.get('ion-toast#toast-id').shadow().find('.toast-button').click();

        cy.get('#contrapass').find('input').type('123', { force: true });
        cy.get('#btn-guardar').click();

        cy.get('ion-toast#toast-id')
          .shadow()
          .find('.toast-message')
          .should('exist')
          .and('be.visible')
        
        cy.wait(1000);

        cy.get('ion-toast#toast-id').shadow().find('.toast-button').click();

        cy.get('#contrapass').find('input').type('{selectall}{backspace}', { force: true });
        cy.get('#contrapass').find('input').type('1234', { force: true });
        cy.get('#btn-guardar').click();

        cy.get('ion-toast#toast-id')
          .shadow()
          .find('.toast-message')
          .should('exist')
          .and('be.visible')

        
        cy.wait(1000);

        cy.get('ion-toast#toast-id').shadow().find('.toast-button').click();
        
        cy.get('#repetirPassword').find('input').type('1234', { force: true });
        cy.get('#btn-guardar').click();

        cy.get('ion-toast#toast-id')
          .shadow()
          .find('.toast-message')
          .should('exist')
          .and('be.visible')
          .should('contain.text', 'El usuario fue guardado correctamente.');
        
        cy.wait(1000);

        cy.get('ion-toast#toast-id').shadow().find('.toast-button').click();

        cy.wait(1000);
        
        cy.get('app-header')
          .get('#logout')
          .click();
      });
  });

  it('La componente Mis Datos grabe correctamente de la actualización de datos', () => {
    cy.visit('http://localhost:8100/');
      

    cy.get('#cuenta')
      .type('atorres');

    cy.get('#password')
      .type('1234');

    cy.wait(1000);

    cy.get('#btn-login')
      .click();

    cy.intercept('/inicio')
      .as('route')
      .then(() => {
        cy.wait(1000);

        cy.get('ion-toast#toast-id')
          .shadow()
          .find('.toast-button')
          .click();

        cy.get('app-footer')
          .get('#mi-clase')
          .click()
          .get('#mis-datos')
          .click();

        cy.get('#nombre').find('input').type('{selectall}{backspace}', { force: true });
        cy.get('#apellido').find('input').type('{selectall}{backspace}', { force: true });

        cy.get('#pregunta').find('input').type('{selectall}{backspace}', { force: true });
        cy.get('#respuesta').find('input').type('{selectall}{backspace}', { force: true });

        cy.get('#contrapass').find('input').type('{selectall}{backspace}', { force: true });

        cy.get('#nombre').find('input').type('ANA', { force: true });
        cy.get('#apellido').find('input').type('TORRES', { force: true });

        cy.get('#pregunta').find('input').type('PREGUNTA', { force: true });
        cy.get('#respuesta').find('input').type('RESPUESTA', { force: true });

        cy.get('#contrapass').find('input').type('abcd', { force: true });
        cy.get('#repetirPassword').find('input').type('abcd', { force: true });

        cy.wait(1000);

        cy.get('#btn-guardar').click();

        cy.get('ion-toast#toast-id')
          .shadow()
          .find('.toast-message')
          .should('exist')
          .and('be.visible')
          .should('contain.text', 'El usuario fue guardado correctamente.');
        
        cy.wait(1000);

        cy.get('ion-toast#toast-id').shadow().find('.toast-button').click();

        cy.get('app-header')
          .get('#logout')
          .click();
        
        cy.wait(1000);

        cy.get('ion-toast#toast-id')
          .shadow()
          .find('.toast-button')
          .click();

        cy.get('#cuenta')
          .find('input')
          .type('{selectall}{backspace}', { force: true });

        cy.get('#cuenta')
          .type('atorres');

        cy.get('#password')
          .find('input')
          .type('{selectall}{backspace}', { force: true });

        cy.get('#password')
          .type('abcd');

        cy.wait(1000);

        cy.get('#btn-login')
          .click();

        cy.get('ion-toast#toast-id')
          .shadow()
          .find('.toast-button')
          .click();

        cy.get('app-footer')
          .get('#mi-clase')
          .click()
          .get('#mis-datos')
          .click();

        cy.wait(10000);
          cy.get('app-header')
          .get('#logout')
          .click();
    });
  });
});