const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const signToken = (id) => jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });

    const user = await prisma.user.findUnique({
      where: { email },
      include: { organizer: true, agent: { include: { organizer: true } } }
    });

    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ success: false, message: 'Identifiants incorrects' });

    if (!user.isActive) return res.status(403).json({ success: false, message: 'Compte désactivé' });

    const { password: _, ...safe } = user;
    res.json({ success: true, token: signToken(user.id), user: safe });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

exports.me = async (req, res) => {
  const { password: _, ...safe } = req.user;
  res.json({ success: true, user: safe });
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!(await bcrypt.compare(currentPassword, user.password)))
      return res.status(400).json({ success: false, message: 'Mot de passe actuel incorrect' });
    await prisma.user.update({ where: { id: req.user.id }, data: { password: await bcrypt.hash(newPassword, 12) } });
    res.json({ success: true, message: 'Mot de passe modifié' });
  } catch {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};
