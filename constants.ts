import { Classification, OutgoingType, MailSource } from './types';

export const CLASSIFICATIONS = Object.values(Classification);
export const OUTGOING_TYPES = Object.values(OutgoingType);

export const DRIVE_FOLDERS = {
  INCOMING: "https://drive.google.com/drive/folders/1K016rUHfjN7fcAEDN-VbxVygyhm79NUE?usp=sharing",
  OUTGOING: "https://drive.google.com/drive/folders/1e0lVtOuf9ZXVWjZLfQ2kKJPSVdKF4_LL?usp=drive_link"
};

export const MOCK_DATA_INCOMING = [
  {
    id: '1', source: MailSource.EXTERNAL, number: '001/EXT/2025', dateLetter: '2025-10-20', dateReceived: '2025-10-21', 
    dateAction: '2025-10-25', timeAction: '09:00', placeAction: 'Aula Utama', subject: 'Undangan Rapat', 
    agenda: 'Koordinasi Tahunan', agency: 'Kementerian A', notes: '-', documentName: 'invitation.pdf'
  },
  {
    id: '2', source: MailSource.INTERNAL, number: '002/INT/2025', classification: 'PM', dateLetter: '2025-10-22', dateReceived: '2025-10-22', 
    dateAction: '2025-10-26', timeAction: '13:00', placeAction: 'Ruang Rapat 1', subject: 'Bimbingan Teknis', 
    agenda: 'Pelatihan Pegawai', agency: 'Internal', notes: 'Wajib hadir', documentName: 'bimtek.pdf'
  }
];