export interface Hospital {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  lat: number;
  lng: number;
  emergencyPhone: string;
  laborRoomPhone: string;
  ambulancePhone: string;
  type: 'govt_apex' | 'dedicated_maternity' | 'multispecialty';
  typeLabelEn: string;
  typeLabelHi: string;
  facilities: string[];
  hasNicuLevel3: boolean;
  hasBloodBank: boolean;
  acceptsAyushmanBharat: boolean;
}

export const EMERGENCY_HOSPITALS_INDIA: Hospital[] = [
  // Bengaluru
  {
    id: 'blr_1',
    name: 'Cloudnine Hospital, Jayanagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: '1533, 9th Main Rd, 3rd Block, Jayanagar, Bengaluru 560011',
    lat: 12.9298,
    lng: 77.5843,
    emergencyPhone: '+91 80 4966 6999',
    laborRoomPhone: '+91 80 4966 6901',
    ambulancePhone: '+91 99000 12345',
    type: 'dedicated_maternity',
    typeLabelEn: 'Dedicated Maternity & Child Center',
    typeLabelHi: 'विशिष्ट प्रसूति एवं शिशु अस्पताल',
    facilities: ['24/7 Labor Ward', 'NICU Level III', 'Adult High Dependency Unit', 'Fetal Medicine'],
    hasNicuLevel3: true,
    hasBloodBank: true,
    acceptsAyushmanBharat: false,
  },
  {
    id: 'blr_2',
    name: 'Vanivilas Women and Children Hospital (BMCRI)',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: 'Victoria Hospital Complex, Fort, K.R. Road, Bengaluru 560002',
    lat: 12.9619,
    lng: 77.5746,
    emergencyPhone: '+91 80 2670 1150',
    laborRoomPhone: '+91 80 2670 1152',
    ambulancePhone: '108',
    type: 'govt_apex',
    typeLabelEn: 'Government Apex Women & Children Hospital',
    typeLabelHi: 'सरकारी शीर्ष महिला एवं बाल अस्पताल',
    facilities: ['24/7 Free Obstetric Casualty', 'NICU Level III', 'Govt Blood Bank', 'Free Janani Shishu Care'],
    hasNicuLevel3: true,
    hasBloodBank: true,
    acceptsAyushmanBharat: true,
  },
  {
    id: 'blr_3',
    name: 'Motherhood Hospital, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: '2266, 100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru 560008',
    lat: 12.9649,
    lng: 77.6416,
    emergencyPhone: '+91 80 6723 8888',
    laborRoomPhone: '+91 80 6723 8802',
    ambulancePhone: '+91 80 6723 8899',
    type: 'dedicated_maternity',
    typeLabelEn: 'Dedicated Maternity & Neonatology',
    typeLabelHi: 'प्रसूति एवं नवजात गहन देखभाल',
    facilities: ['24/7 Emergency Labor Suite', 'NICU Level III', 'Lactation Consultation', 'Epidural Analgesia'],
    hasNicuLevel3: true,
    hasBloodBank: true,
    acceptsAyushmanBharat: false,
  },
  {
    id: 'blr_4',
    name: 'Manipal Hospital, Old Airport Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: '98, HAL Old Airport Rd, Kodihalli, Bengaluru 560017',
    lat: 12.9592,
    lng: 77.6474,
    emergencyPhone: '+91 80 2502 4444',
    laborRoomPhone: '+91 80 2502 4410',
    ambulancePhone: '080 2222 1111',
    type: 'multispecialty',
    typeLabelEn: 'Quaternary Care Multispecialty',
    typeLabelHi: 'सुपर स्पेशियलिटी आपातकालीन अस्पताल',
    facilities: ['High-Risk Obstetric ICU', 'NICU Level III', '24/7 Blood Center', 'Emergency C-Section OT'],
    hasNicuLevel3: true,
    hasBloodBank: true,
    acceptsAyushmanBharat: true,
  },

  // Delhi NCR
  {
    id: 'del_1',
    name: 'Safdarjung Hospital & VMMC (Maternity Wing)',
    city: 'Delhi NCR',
    state: 'Delhi',
    address: 'Ring Road, Opposite AIIMS, Ansari Nagar West, New Delhi 110029',
    lat: 28.5684,
    lng: 77.2068,
    emergencyPhone: '+91 11 2616 5060',
    laborRoomPhone: '+91 11 2616 5072',
    ambulancePhone: '102',
    type: 'govt_apex',
    typeLabelEn: 'Central Government Apex Hospital',
    typeLabelHi: 'केंद्रीय सरकारी शीर्ष अस्पताल',
    facilities: ['24/7 Free Labor Room', 'NICU Level III', 'National Blood Bank', 'Emergency Obstetric OT'],
    hasNicuLevel3: true,
    hasBloodBank: true,
    acceptsAyushmanBharat: true,
  },
  {
    id: 'del_2',
    name: 'Fortis La Femme, Greater Kailash II',
    city: 'Delhi NCR',
    state: 'Delhi',
    address: 'S-549, Greater Kailash II, New Delhi 110048',
    lat: 28.5355,
    lng: 77.2410,
    emergencyPhone: '+91 11 4057 9400',
    laborRoomPhone: '+91 11 4057 9444',
    ambulancePhone: '105010',
    type: 'dedicated_maternity',
    typeLabelEn: 'Specialized Women & Newborn Hospital',
    typeLabelHi: 'विशेष महिला एवं प्रसूति अस्पताल',
    facilities: ['LDR Suites', 'Level III NICU', 'Emergency Maternal Resuscitation', 'High-Risk OB-GYN Team'],
    hasNicuLevel3: true,
    hasBloodBank: true,
    acceptsAyushmanBharat: false,
  },
  {
    id: 'del_3',
    name: 'Apollo Cradle & Children’s Hospital, Moti Nagar',
    city: 'Delhi NCR',
    state: 'Delhi',
    address: '15A, Najafgarh Rd, Moti Nagar, New Delhi 110015',
    lat: 28.6588,
    lng: 77.1423,
    emergencyPhone: '+91 11 4424 4424',
    laborRoomPhone: '+91 11 4424 4410',
    ambulancePhone: '1066',
    type: 'dedicated_maternity',
    typeLabelEn: 'Maternity & Pediatric Emergency Center',
    typeLabelHi: 'प्रसूति एवं बाल चिकित्सा आपात केंद्र',
    facilities: ['24/7 Delivery Ward', 'Neonatal Transport Incubator', 'Advanced Fetal Monitoring'],
    hasNicuLevel3: true,
    hasBloodBank: true,
    acceptsAyushmanBharat: false,
  },

  // Mumbai
  {
    id: 'mum_1',
    name: 'KEM Hospital (Seth GS Medical College) - Maternity Casualty',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'Acharya Donde Marg, Parel, Mumbai 400012',
    lat: 19.0028,
    lng: 72.8427,
    emergencyPhone: '+91 22 2410 7000',
    laborRoomPhone: '+91 22 2410 7400',
    ambulancePhone: '108',
    type: 'govt_apex',
    typeLabelEn: 'Municipal Apex Teaching Hospital',
    typeLabelHi: 'महानगरपालिका शीर्ष अस्पताल',
    facilities: ['24/7 High-Risk Delivery Unit', 'NICU Level III', 'BMC Blood Bank', 'Emergency Obstetrician on-call'],
    hasNicuLevel3: true,
    hasBloodBank: true,
    acceptsAyushmanBharat: true,
  },
  {
    id: 'mum_2',
    name: 'Surya Mother & Child Super Speciality Hospital, Santacruz',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'Mangal Anand Society, Dattatray Rd, Santacruz West, Mumbai 400054',
    lat: 19.0832,
    lng: 72.8398,
    emergencyPhone: '+91 22 6156 7000',
    laborRoomPhone: '+91 22 6156 7001',
    ambulancePhone: '+91 98200 45678',
    type: 'dedicated_maternity',
    typeLabelEn: 'Apex Neonatal & Maternity Center',
    typeLabelHi: 'शीर्ष नवजात एवं प्रसूति अस्पताल',
    facilities: ['Largest Level III NICU in Western India', 'Fetal Surgery', 'LDR Suites', '24/7 On-site Blood Bank'],
    hasNicuLevel3: true,
    hasBloodBank: true,
    acceptsAyushmanBharat: false,
  },

  // Hyderabad
  {
    id: 'hyd_1',
    name: 'Fernandez Hospital, Bogulkunta',
    city: 'Hyderabad',
    state: 'Telangana',
    address: '4-1-1230, Bogulkunta, Abids, Hyderabad 500001',
    lat: 17.3912,
    lng: 78.4820,
    emergencyPhone: '+91 40 4022 2399',
    laborRoomPhone: '+91 40 4022 2400',
    ambulancePhone: '+91 40 4022 2300',
    type: 'dedicated_maternity',
    typeLabelEn: 'High-Risk Maternal & Perinatal Center',
    typeLabelHi: 'उच्च-जोखिम प्रसूति एवं मातृ केंद्र',
    facilities: ['Midwifery-Led Care', 'NICU Level III', 'Obstetric Critical Care Unit', 'Human Milk Bank'],
    hasNicuLevel3: true,
    hasBloodBank: true,
    acceptsAyushmanBharat: true,
  },
  {
    id: 'hyd_2',
    name: 'Rainbow Children’s Hospital & BirthRight, Banjara Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    address: 'Road No. 2, Banjara Hills, Hyderabad 500034',
    lat: 17.4183,
    lng: 78.4357,
    emergencyPhone: '+91 40 4246 2200',
    laborRoomPhone: '+91 40 4246 2222',
    ambulancePhone: '040 4246 2201',
    type: 'dedicated_maternity',
    typeLabelEn: 'Pediatric & Maternity Superspecialty',
    typeLabelHi: 'बाल एवं मातृत्व सुपर स्पेशियलिटी',
    facilities: ['24/7 Obstetric Emergency', 'Quaternary NICU', 'Transport Ambulance with Ventilator'],
    hasNicuLevel3: true,
    hasBloodBank: true,
    acceptsAyushmanBharat: false,
  },

  // Chennai
  {
    id: 'chn_1',
    name: 'Institute of Obstetrics and Gynaecology (Government Maternity Hospital), Egmore',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'Pantheon Rd, Egmore, Chennai 600008',
    lat: 13.0786,
    lng: 78.2588,
    emergencyPhone: '+91 44 2819 1982',
    laborRoomPhone: '+91 44 2819 1980',
    ambulancePhone: '108',
    type: 'govt_apex',
    typeLabelEn: 'Asia’s Oldest Government Maternity Hospital',
    typeLabelHi: 'सरकारी प्रसूति एवं महिला अस्पताल',
    facilities: ['Comprehensive Obstetric Emergency Care', 'NICU Level III', 'Muthulakshmi Reddy Maternity Scheme'],
    hasNicuLevel3: true,
    hasBloodBank: true,
    acceptsAyushmanBharat: true,
  },

  // Kolkata
  {
    id: 'kol_1',
    name: 'Chittaranjan Seva Sadan Hospital (Govt. Maternity Hospital)',
    city: 'Kolkata',
    state: 'West Bengal',
    address: '37, Shyama Prasad Mukherjee Rd, Bakul Bagan, Bhowanipore, Kolkata 700026',
    lat: 22.5298,
    lng: 88.3475,
    emergencyPhone: '+91 33 2475 4236',
    laborRoomPhone: '+91 33 2475 4240',
    ambulancePhone: '102',
    type: 'govt_apex',
    typeLabelEn: 'Government Women & Child Hospital',
    typeLabelHi: 'सरकारी महिला एवं शिशु अस्पताल',
    facilities: ['24/7 Labor Room', 'SNCU / NICU', 'Free Institutional Delivery'],
    hasNicuLevel3: true,
    hasBloodBank: true,
    acceptsAyushmanBharat: true,
  },

  // Pune
  {
    id: 'pun_1',
    name: 'Sassoon General Hospital & BJ Medical College (Maternity Unit)',
    city: 'Pune',
    state: 'Maharashtra',
    address: 'Near Pune Railway Station, Sassoon Rd, Pune 411001',
    lat: 18.5262,
    lng: 73.8744,
    emergencyPhone: '+91 20 2612 8000',
    laborRoomPhone: '+91 20 2612 8050',
    ambulancePhone: '108',
    type: 'govt_apex',
    typeLabelEn: 'Government Teaching Apex Hospital',
    typeLabelHi: 'सरकारी शीर्ष प्रसूति केंद्र',
    facilities: ['24/7 Emergency C-Section', 'NICU Level III', 'Regional Blood Bank'],
    hasNicuLevel3: true,
    hasBloodBank: true,
    acceptsAyushmanBharat: true,
  }
];

// Haversine formula to compute geodesic distance in kilometers
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
