export interface DepartmentItem {
  name: string;
  code: string;
}

export interface DivisionItem {
  name: string;
  code: string;
  departments: DepartmentItem[];
}

export interface DirectorateItem {
  name: string;
  code: string;
  divisions: DivisionItem[];
}

export const ORGANIZATION_STRUCTURE: DirectorateItem[] = [
  {
    name: "Direktorat Utama (CEO)",
    code: "DIR-CEO",
    divisions: [
      {
        name: "Divisi Corporate Governance & Audit",
        code: "DIV-GOV",
        departments: [
          { name: "Departemen Internal Audit", code: "DEPT-AUDIT" },
          { name: "Departemen Corporate Strategy", code: "DEPT-STRAT" }
        ]
      }
    ]
  },
  {
    name: "Direktorat Teknologi & IT (CTO)",
    code: "DIR-IT",
    divisions: [
      {
        name: "Divisi Software Engineering",
        code: "DIV-ENG",
        departments: [
          { name: "Departemen Frontend & Mobile", code: "DEPT-FE" },
          { name: "Departemen Backend Engineering", code: "DEPT-BE" },
          { name: "Departemen Quality Assurance", code: "DEPT-QA" }
        ]
      },
      {
        name: "Divisi Infrastructure & Cloud",
        code: "DIV-INFRA",
        departments: [
          { name: "Departemen DevOps & Cloud", code: "DEPT-DEVOPS" },
          { name: "Departemen Cyber Security", code: "DEPT-SEC" }
        ]
      }
    ]
  },
  {
    name: "Direktorat Keuangan & SDM (CFO & CHRO)",
    code: "DIR-FIN-HR",
    divisions: [
      {
        name: "Divisi Human Resource Management",
        code: "DIV-HR",
        departments: [
          { name: "Departemen Talent Acquisition", code: "DEPT-REC" },
          { name: "Departemen Payroll & Operations", code: "DEPT-PAY" },
          { name: "Departemen Employee Relations", code: "DEPT-DEV" }
        ]
      },
      {
        name: "Divisi Financial Operations",
        code: "DIV-FIN",
        departments: [
          { name: "Departemen Financial Planning", code: "DEPT-FP" },
          { name: "Departemen Accounting & Tax", code: "DEPT-TAX" }
        ]
      }
    ]
  },
  {
    name: "Direktorat Operasional & Bisnis (COO)",
    code: "DIR-OPS",
    divisions: [
      {
        name: "Divisi Business Operations",
        code: "DIV-OPS",
        departments: [
          { name: "Departemen Procurement", code: "DEPT-PROC" },
          { name: "Departemen Logistics & Assets", code: "DEPT-LOG" }
        ]
      },
      {
        name: "Divisi Commercial & Sales",
        code: "DIV-SALES",
        departments: [
          { name: "Departemen B2B Enterprise Sales", code: "DEPT-SALES" },
          { name: "Departemen Marketing & Brand", code: "DEPT-MKT" }
        ]
      }
    ]
  }
];
