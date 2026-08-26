import { db, initDatabase } from './config/database';

async function runSeed() {
  console.log('[Seed Payroll] Initializing database schema...');
  await initDatabase();
  console.log('[Seed Payroll] Populating payslip test data for all employees...');

  db.all('SELECT id, name, position, department FROM users', [], (err, users: any[]) => {
    if (err) {
      console.error('Error fetching users:', err);
      process.exit(1);
    }

    const periods = ['2026-08', '2026-07', '2026-06'];
    let count = 0;

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO payroll (user_id, period, base_salary, allowance, overtime_pay, sick_deduction, absent_deduction, late_deduction, tax_bpjs_deduction, net_salary, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PAID')
    `);

    users.forEach((u) => {
      const pos = (u.position || '').toLowerCase();
      let base = 8500000;
      let allow = 1500000;
      if (pos.includes('director') || pos.includes('vp') || pos.includes('head') || pos.includes('c-level')) { base = 25000000; allow = 5000000; }
      else if (pos.includes('manager') || pos.includes('lead')) { base = 16000000; allow = 3000000; }
      else if (pos.includes('senior') || pos.includes('architect')) { base = 12000000; allow = 2000000; }
      else if (pos.includes('specialist') || pos.includes('developer') || pos.includes('engineer')) { base = 9500000; allow = 1500000; }
      else if (pos.includes('junior') || pos.includes('intern')) { base = 5500000; allow = 1000000; }

      periods.forEach((period, idx) => {
        const overtime = 300000 + (idx * 150000) + ((u.id * 50000) % 400000);
        const late = (u.id % 3 === 0) ? 50000 : 0;
        const bpjs = Math.round(base * 0.05);
        const tax = Math.round(base * 0.05);
        const totalTaxBpjs = bpjs + tax;
        const net = (base + allow + overtime) - (late + totalTaxBpjs);

        stmt.run([u.id, period, base, allow, overtime, 0, 0, late, totalTaxBpjs, net]);
        count++;
      });
    });

    stmt.finalize(() => {
      console.log(`[Seed Payroll] Successfully generated ${count} payslips for ${users.length} employees across 3 periods (${periods.join(', ')}).`);
      process.exit(0);
    });
  });
}

runSeed();
