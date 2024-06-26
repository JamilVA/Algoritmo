const {
  Usuario,
  Docente,
  Estudiante,
  Apoderado,
  Persona,
  TipoUsuario,
} = require("../config/relations");
// const bcrypt = require('bcryptjs');
const {
  generateToken,
  generateRefreshToken,
} = require("../utils/tokenManager");

// const register = (req, res) => {
//     res.json({ ok: "true" });
// }

const comparePassword = function (password, candidatePassword) {
  return candidatePassword == password;
};

// const hash = (password) => {
//   try {
//     const salt = bcrypt.genSaltSync(10);
//     const hashPassword = bcrypt.hashSync(password, salt);
//     return hashPassword;
//   } catch (error) {
//     console.log(error);
//   }
// }

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Hola", email, password);
    let user = await Usuario.findOne({ where: { Email: email } });
    if (!user)
      return res
        .status(403)
        .json({ error: "Usuario y/o contraseña incorrectos" });

    const respuestaPassword = comparePassword(user.Password, password);

    if (!respuestaPassword)
      return res
        .status(403)
        .json({ error: "Usuario y/o contraseña incorrectos" });

    // //GENERAR JWT
    // const { token, expiresIn } = generateToken(user.Codigo);
    // generateRefreshToken(user.Codigo, res);

    const tipoUsuario = user.CodigoTipoUsuario;
    let codigoPersona = user.CodigoPersona;
    let codigoDocente = 0;
    let codigoEstudiante = 0;
    let codigoApoderado = 0;

    if (tipoUsuario == 2) {
      let _docente = await Docente.findOne({
        where: { CodigoPersona: user.CodigoPersona },
      });
      codigoDocente = _docente.Codigo;
    } else if (tipoUsuario == 3) {
      let _estudiante = await Estudiante.findOne({
        where: { CodigoPersona: user.CodigoPersona },
      });
      codigoEstudiante = _estudiante.Codigo;
    } else if (tipoUsuario == 4) {
      let _apoderado = await Apoderado.findOne({
        where: { CodigoPersona: user.CodigoPersona },
      });
      codigoApoderado = _apoderado.Codigo;
    }

    console.log({
      email,
      tipoUsuario,
      codigoPersona,
      codigoDocente,
      codigoApoderado,
      codigoEstudiante,
    });

    res.json({
      email,
      tipoUsuario,
      codigoPersona,
      codigoDocente,
      codigoApoderado,
      codigoEstudiante,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error de servidor" });
  }
};

const getInfo = async (req, res) => {
  try {
    const { CodigoPersona } = req.query;

    const persona = await Persona.findOne({
      include: [
        {
          model: Usuario,
          attributes: ["Codigo"],
          include: [
            {
              model: TipoUsuario,
              attributes: ["Nombre"],
            },
          ],
        },
      ],
      attributes: ["Nombres", "ApellidoPaterno", "ApellidoMaterno"],
      where: {Codigo: CodigoPersona}
    });

    const usuario = {
      Nombres:
        persona.Nombres +
        " " +
        persona.ApellidoPaterno +
        " " +
        persona.ApellidoMaterno,
      TipoUsuario: persona.Usuario.TipoUsuario.Nombre,
    };

    res.json({
      message: "Datos cargados correctamente",
      usuario,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar los datos" });
  }
};

// const refreshToken = (req, res) => {
//     try {
//         const { token, expiresIn } = generateToken(req.uid);
//         return res.json({ token, expiresIn });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ error: "Error de servidor" });
//     }
// }

const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ ok: true });
};

const changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    let user = await Usuario.findOne({ where: { Email: email } });

    if (!user) return res.status(403).json({ error: "Usuario inexistente" });

    const respuestaPassword = comparePassword(user.Password, oldPassword);

    if (!respuestaPassword)
      return res.status(403).json({ error: "Contraseña incorrecta" });

    await user.update(
      {
        Password: hash(newPassword),
      },
      {
        where: {
          Email: email,
        },
      }
    );
    res.json({ ok: true, message: "Password updated successfull" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error de servidor" });
  }
};

const changePasswordAdmin = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    let user = await Usuario.findOne({ where: { Email: email } });

    if (!user) return res.status(403).json({ error: "Usuario inexistente" });

    await user.update(
      {
        Password: hash(newPassword),
      },
      {
        where: {
          Email: email,
        },
      }
    );
    res.json({ ok: true, message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error de servidor" });
  }
};

module.exports = {
  login,
  logout,
  getInfo,
  changePassword,
  changePasswordAdmin,
};
