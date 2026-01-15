export type OrgEntry = {
  year: string;
  positions: {
    role: string;
    org: string;
    description?: string;
  }[];
};

export type CommitteeEntry = {
  year: string;
  roles: {
    role: string;
    event: string;
    description?: string;
  }[];
};

export const ORGANIZATIONS: OrgEntry[] = [
  {
    year: "2017-2018",
    positions: [
      { role: "Anggota Komisi C (Kedisiplinan)", org: "Majelis Permusyawaratan Kelas (MPK)" },
    ],
  },
  {
    year: "2018-2019",
    positions: [
      { role: "Sekretaris", org: "Majelis Permusyawaratan Kelas (MPK)" },
    ],
  },
  {
    year: "2020-2021",
    positions: [
      { role: "Anggota Bidgar KD (Kreatifitas dan Dokumentasi)", org: "RGUG" },
    ],
  },
  {
    year: "2021-2022",
    positions: [
      { role: "Ketua Divisi Kreatifitas dan Dokumentasi (KD)", org: "RGUG" },
      { role: "Anggota Divisi KMD (Kreatif Media dan Digital)", org: "Forum OSIS Jawa Barat (FOJB) Gen 9" },
      { role: "Anggota Tim Kreatif", org: "FOJB Gen 9" },
    ],
  },
  {
    year: "2025",
    positions: [
      { role: "Staff Divisi Desain Pendamping Sebaya", org: "ITB 2025" },
      { role: "Tim IT", org: "Phiwiki ITB" },
      { role: "Intern Biro Creative and Branding", org: "Badan Pengurus HIMAFI ITB" },
      { role: "Intern Komisi Publikasi dan Dokumentasi", org: "DPA HIMAFI ITB" },
    ],
  },
];

export const COMMITTEES: CommitteeEntry[] = [
  {
    year: "2021",
    roles: [
      { 
        role: "Ketua Divisi Publikasi, Desain, dan Dokumentasi (PDD)", 
        event: "Musyawarah Tahunan (Musyta)"
      },
      { 
        role: "Staff Divisi Kreatifitas dan Desain", 
        event: "Masanda fest"
      },
    ],
  },
  {
    year: "2022",
    roles: [
      { role: "Ketua Divisi PDD", event: "Pekan Olahraga Antar Kelas (PORAK)" },
      { role: "Ketua Divisi PDD", event: "Ifthar Jamai", description: "Event Buka Bersama Sekolah" },
      { role: "Ketua Divisi PDD", event: "HIPA", description: "Acara Eksternal, Festival Sekolah untuk Umum" },
      { role: "Ketua Divisi PDD", event: "PETASAN", description: "Event Agustusan Sekolah" },
      { role: "Ketua Divisi PDD", event: "Tasamuh", description: "MPLS Sekolah bagi Siswa Baru" },
      { role: "Ketua Divisi PDD", event: "Mabit" },
      { role: "Ketua Divisi PDD", event: "PKJS", description: "Semacam KKN / Pengmas untuk kelas 11" },
      { role: "Ketua Divisi PDD", event: "Musyawarah Tahunan" },
    ],
  },
  {
    year: "2025",
    roles: [
      { 
        role: "Ketua Divisi Publikasi dan Dokumentasi", 
        event: "FGD Tugas Akhir (FGD TA) ITB"
      },
      { 
        role: "Ketua Divisi Desain", 
        event: "Psychological First Aid (PFA)"
      },
      { 
        role: "Staff Divisi Information (Front-End) Bidang IT", 
        event: "OSKM"
      },
      { 
        role: "Kepala Divisi Grafis", 
        event: "Aksi Angkatan Dayanatha Mandala"
      },
      { 
        role: "Staff LO Wisuda Oktober", 
        event: "HIMAFI ITB"
      },
      { 
        role: "Staff Desain Open Recruitment", 
        event: "Pendamping Sebaya ITB"
      },
      { 
        role: "Kepala Divisi Grafis", 
        event: "Pemilu HIMAFI ITB 2026/2027"
      },
    ],
  },
];
