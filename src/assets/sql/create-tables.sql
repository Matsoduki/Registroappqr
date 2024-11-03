CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  pregunta TEXT NOT NULL,
  respuesta TEXT NOT NULL,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  nivel_educacional_id INTEGER NOT NULL,
  fecha_nacimiento TEXT NOT NULL,
  FOREIGN KEY (nivel_educacional_id) REFERENCES nivel_educacional(id)
);

CREATE TABLE IF NOT EXISTS nivel_educacional (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nivel INTEGER NOT NULL,
  descripcion TEXT NOT NULL
);