export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum MailSource {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL'
}

export enum Classification {
  PM = 'PM', PP = 'PP', PS = 'PS', PR = 'PR', OT = 'OT', 
  KA = 'KA', KU = 'KU', PL = 'PL', HK = 'HK', HM = 'HM', 
  KP = 'KP', RT = 'RT', PW = 'PW', TI = 'TI'
}

export enum OutgoingType {
  UNDANGAN = 'UNDANGAN',
  PERMOHONAN = 'PERMOHONAN',
  SPTB = 'SPTB',
  BERITA_ACARA = 'BERITA ACARA',
  SURAT_KEPUTUSAN = 'SURAT KEPUTUSAN',
  NOTA_DINAS = 'NOTA DINAS',
  SPTJM = 'SPTJM',
  IMBAUAN = 'IMBAUAN',
  SARAN_PERBAIKAN = 'SARAN PERBAIKAN',
  IZIN = 'IZIN',
  SURAT_TUGAS = 'SURAT TUGAS',
  MOU = 'MOU',
  LAINNYA = 'LAINNYA'
}

export interface IncomingMail {
  id: string;
  source: MailSource;
  number: string;
  classification?: Classification | string; // Optional for External
  dateLetter: string;
  dateReceived: string;
  dateAction: string; // Tanggal Pelaksanaan
  timeAction: string; // Jam Pelaksanaan
  placeAction: string; // Tempat Pelaksanaan
  subject: string; // Perihal
  agenda: string;
  agency: string; // Instansi
  notes: string; // Keterangan
  documentName: string;
}

export interface OutgoingMail {
  id: string;
  number: string;
  type: OutgoingType;
  classification: string;
  dateLetter: string;
  dateAction: string;
  subject: string;
  agenda: string;
  destinationAgency: string;
  documentName: string;
}

export interface NumberingRequest {
  id: string;
  name: string;
  dateSupervision: string; // Tanggal Pengawasan
  stage: string; // Tahapan
  createdAt: number; // Timestamp for sorting tie-breakers
  generatedNumber: string; // The final calculated number
}
