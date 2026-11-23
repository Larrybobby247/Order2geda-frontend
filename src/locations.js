// Keep in sync with server/src/utils/locations.js (state names).
export const STATES = ['Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT (Abuja)', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'];
// Suggestions only. Members can always type any area.
export const AREAS = {
  Lagos: ['Ikeja', 'Lekki', 'Victoria Island', 'Ikoyi', 'Surulere', 'Yaba', 'Ajah', 'Festac', 'Maryland', 'Gbagada', 'Ikorodu', 'Badagry', 'Oshodi', 'Apapa', 'Magodo', 'Ojo', 'Alimosho', 'Epe'],
  'FCT (Abuja)': ['Wuse', 'Garki', 'Maitama', 'Asokoro', 'Gwarinpa', 'Jabi', 'Kubwa', 'Lugbe', 'Utako', 'Jahi', 'Life Camp', 'Nyanya', 'Karu', 'Gwagwalada'],
  Rivers: ['Port Harcourt', 'GRA', 'Rumuola', 'Trans-Amadi', 'Eleme', 'Obio-Akpor', 'Bonny'], Oyo: ['Ibadan', 'Bodija', 'Ring Road', 'Challenge', 'Iwo Road', 'Ogbomosho'], Ogun: ['Abeokuta', 'Sagamu', 'Ijebu-Ode', 'Ota', 'Mowe'],
  Kano: ['Nassarawa', 'Fagge', 'Gwale', 'Tarauni', 'Kano Municipal'], Kaduna: ['Kaduna North', 'Kaduna South', 'Zaria', 'Barnawa'], Enugu: ['Enugu North', 'Independence Layout', 'Trans-Ekulu', 'Nsukka'], Anambra: ['Awka', 'Onitsha', 'Nnewi'],
  Delta: ['Asaba', 'Warri', 'Sapele', 'Effurun'], Edo: ['Benin City', 'Ekpoma', 'Auchi'], 'Akwa Ibom': ['Uyo', 'Eket'], Kwara: ['Ilorin'], Plateau: ['Jos'], Abia: ['Aba', 'Umuahia'], Imo: ['Owerri'], Osun: ['Osogbo', 'Ile-Ife'], Ondo: ['Akure', 'Ondo'],
};
export const areasFor = (state) => AREAS[state] || [];
export const locLabel = (o) => [o?.area, o?.state].filter(Boolean).join(', ');
