const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Mauti-Ticket database...');

  // Admin
  const adminPass = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mauti-ticket.mr' },
    update: {},
    create: { email: 'admin@mauti-ticket.mr', password: adminPass, name: 'Super Admin', role: 'ADMIN' }
  });
  console.log('✅ Admin créé:', admin.email);

  // Categories
  const categories = [
    { name: 'Musique', description: 'Concerts et festivals musicaux', icon: '🎵', color: '#D4A853' },
    { name: 'Sport', description: 'Événements sportifs', icon: '⚽', color: '#2E7D32' },
    { name: 'Culture', description: 'Expositions et spectacles culturels', icon: '🎭', color: '#7B1FA2' },
    { name: 'Conférence', description: 'Conférences et séminaires', icon: '💼', color: '#1565C0' },
    { name: 'Fête', description: 'Célébrations et festivités', icon: '🎉', color: '#E65100' },
    { name: 'Formation', description: 'Ateliers et formations', icon: '📚', color: '#00695C' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({ where: { name: cat.name }, update: {}, create: cat });
  }
  console.log('✅ Catégories créées');

  // Organizer
  const orgPass = await bcrypt.hash('org123', 12);
  const orgUser = await prisma.user.upsert({
    where: { email: 'organisateur@mauti-ticket.mr' },
    update: {},
    create: {
      email: 'organisateur@mauti-ticket.mr', password: orgPass,
      name: 'Ahmed Vall', phone: '+22220001234', role: 'ORGANIZER', createdBy: admin.id,
      organizer: { create: { companyName: 'Events Mauritanie SARL', description: 'Organisateur événementiel de référence en Mauritanie', isVerified: true } }
    }
  });
  console.log('✅ Organisateur créé:', orgUser.email);

  console.log('\n🎫 Mauti-Ticket seed terminé avec succès!\n');
  console.log('Comptes de test:');
  console.log('  Admin      → admin@mauti-ticket.mr / admin123');
  console.log('  Organisateur → organisateur@mauti-ticket.mr / org123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
