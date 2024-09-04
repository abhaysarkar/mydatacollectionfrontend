 import axios from 'axios';

// const API_BASE_URL = 'https://datacollection-backend-eb040f587829.herokuapp.com/api';
// const IMAGE_API_BASE_URL = 'https://datacollection-backend-eb040f587829.herokuapp.com/apii';

// const ApiService = {
//   getAllMedicalFields: () => {
//     return axios.get(`${API_BASE_URL}/medical-fields`);
//   },

//   getSubDepartmentsByMedicalFieldId: (medicalFieldId) => {
//     return axios.get(`${API_BASE_URL}/medical-fields/${medicalFieldId}/sub-departments`);
//   },

//   getSubDepartmentById: (subDepartmentId) => {
//     return axios.get(`${API_BASE_URL}/sub-departments/${subDepartmentId}`);
//   },

//   getSubDepartmentDescription: (medicalFieldId, subDepartmentId) => {
//     return axios.get(`${API_BASE_URL}/medical-fields/${medicalFieldId}/sub-departments/${subDepartmentId}/description`);
//   },

//   getSubDepartmentFlag: (email, subDepartmentId) => {
//     return axios.get(`${API_BASE_URL}/get-flag/${email}/${subDepartmentId}`);
//   },

//   getReadPrescription: (email, mfid) =>{
//     return axios.get(`${API_BASE_URL}/uniqueSubDepartmentCount/${email}/${mfid}`)
//   },




// //this functions are for image main page 

//   img_getAllMedicalFields: () => {
//     return axios.get(`${IMAGE_API_BASE_URL}/medical-fields`);
//   },

//   img_getSubDepartmentsByMedicalFieldId: (medicalFieldId) => {
//     return axios.get(`${IMAGE_API_BASE_URL}/medical-fields/${medicalFieldId}/sub-departments`);
//   },

//   img_getSubDepartmentById: (subDepartmentId) => {
//     return axios.get(`${IMAGE_API_BASE_URL}/sub-departments/${subDepartmentId}`);
//   },

//   img_getSubDepartmentDescription: (medicalFieldId, subDepartmentId) => {
//     return axios.get(`${IMAGE_API_BASE_URL}/medical-fields/${medicalFieldId}/sub-departments/${subDepartmentId}/description`);
//   },

//   img_getSubDepartmentFlag: (email, subDepartmentId) => {
//     return axios.get(`${IMAGE_API_BASE_URL}/get-flag/${email}/${subDepartmentId}`);
//   },

//   img_getReadPrescription: (email, mfid) =>{
//     return axios.get(`${IMAGE_API_BASE_URL}/uniqueSubDepartmentCount/${email}/${mfid}`)
//   }
    
// };

// export default ApiService;





const API_BASE_URL = 'https://datacollection-backend-eb040f587829.herokuapp.com/api';
const IMAGE_API_BASE_URL = 'https://datacollection-backend-eb040f587829.herokuapp.com/apii';

const ApiService = {
  getAllMedicalFields: () => {
    return axios.get(`${API_BASE_URL}/medical-fields`);
  },

  getSubDepartmentsByMedicalFieldId: (medicalFieldId) => {
    if (!medicalFieldId) {
      return Promise.reject(new Error('Invalid medicalFieldId'));
    }
    return axios.get(`${API_BASE_URL}/medical-fields/${medicalFieldId}/sub-departments`);
  },

  getSubDepartmentById: (subDepartmentId) => {
    if (!subDepartmentId) {
      return Promise.reject(new Error('Invalid subDepartmentId'));
    }
    return axios.get(`${API_BASE_URL}/sub-departments/${subDepartmentId}`);
  },

  getSubDepartmentDescription: (medicalFieldId, subDepartmentId) => {
    if (!medicalFieldId || !subDepartmentId) {
      return Promise.reject(new Error('Invalid medicalFieldId or subDepartmentId'));
    }
    return axios.get(`${API_BASE_URL}/medical-fields/${medicalFieldId}/sub-departments/${subDepartmentId}/description`);
  },

  getSubDepartmentFlag: (email, subDepartmentId) => {
    if (!email || !subDepartmentId) {
      return Promise.reject(new Error('Invalid email or subDepartmentId'));
    }
    return axios.get(`${API_BASE_URL}/get-flag/${email}/${subDepartmentId}`);
  },

  getReadPrescription: (email, mfid) => {
    if (!email || !mfid) {
      return Promise.reject(new Error('Invalid email or mfid'));
    }
    return axios.get(`${API_BASE_URL}/uniqueSubDepartmentCount/${email}/${mfid}`);
  },

  // Functions for the image main page

  img_getAllMedicalFields: () => {
    return axios.get(`${IMAGE_API_BASE_URL}/medical-fields`);
  },

  img_getSubDepartmentsByMedicalFieldId: (medicalFieldId) => {
    if (!medicalFieldId) {
      return Promise.reject(new Error('Invalid medicalFieldId'));
    }
    return axios.get(`${IMAGE_API_BASE_URL}/medical-fields/${medicalFieldId}/sub-departments`);
  },

  img_getSubDepartmentById: (subDepartmentId) => {
    if (!subDepartmentId) {
      return Promise.reject(new Error('Invalid subDepartmentId'));
    }
    return axios.get(`${IMAGE_API_BASE_URL}/sub-departments/${subDepartmentId}`);
  },

  img_getSubDepartmentDescription: (medicalFieldId, subDepartmentId) => {
    if (!medicalFieldId || !subDepartmentId) {
      return Promise.reject(new Error('Invalid medicalFieldId or subDepartmentId'));
    }
    return axios.get(`${IMAGE_API_BASE_URL}/medical-fields/${medicalFieldId}/sub-departments/${subDepartmentId}/description`);
  },

  img_getSubDepartmentFlag: (email, subDepartmentId) => {
    if (!email || !subDepartmentId) {
      return Promise.reject(new Error('Invalid email or subDepartmentId'));
    }
    return axios.get(`${IMAGE_API_BASE_URL}/get-flag/${email}/${subDepartmentId}`);
  },

  img_getReadPrescription: (email, mfid) => {
    if (!email || !mfid) {
      return Promise.reject(new Error('Invalid email or mfid'));
    }
    return axios.get(`${IMAGE_API_BASE_URL}/uniqueSubDepartmentCount/${email}/${mfid}`);
  }
};

export default ApiService;


