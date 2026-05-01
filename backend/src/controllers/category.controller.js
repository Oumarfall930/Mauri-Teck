const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAll = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({ include: { _count: { select: { events: true } } } });
    res.json({ success: true, categories });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
};

exports.create = async (req, res) => {
  try {
    const { name, description, icon, color } = req.body;
    const cat = await prisma.category.create({ data: { name, description, icon, color } });
    res.status(201).json({ success: true, category: cat });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
};

exports.update = async (req, res) => {
  try {
    const cat = await prisma.category.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, category: cat });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
};

exports.remove = async (req, res) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Catégorie supprimée' });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
};
